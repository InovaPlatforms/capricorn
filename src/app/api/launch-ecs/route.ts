import { ECSClient, RunTaskCommand } from '@aws-sdk/client-ecs';
import { NextResponse } from 'next/server';

const ecsClient = new ECSClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
const CAPACITY_RETRY_DELAY = 5000; // 5 seconds
const VERCEL_TIMEOUT = 9000; // 9 seconds per batch to stay well under Vercel's limits
const BATCH_SIZE = 25; // Smaller batch size for better management
const MAX_BATCH_RETRIES = 3; // New constant for batch retries

async function attemptTaskLaunch(
  ecsClient: ECSClient,
  taskDefinition: string,
  retryCount = 0
) {
  try {
    if (taskDefinition.includes('Video_Mix')) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
    }

    const response = await ecsClient.send(new RunTaskCommand({
      cluster: process.env.NEXT_PUBLIC_AWS_ECS_CLUSTER,
      taskDefinition: taskDefinition,
      count: 1,
      networkConfiguration: {
        awsvpcConfiguration: {
          subnets: [process.env.AWS_SUBNET_ID || ''],
          securityGroups: [process.env.AWS_SECURITY_GROUP_ID || ''],
          assignPublicIp: 'ENABLED'
        }
      },
      capacityProviderStrategy: [{
        capacityProvider: 'FARGATE_SPOT',
        weight: 1,
        base: 0
      }]
    }));

    return response;
  } catch (error: any) {
    if (retryCount < MAX_RETRIES) {
      const isCapacityError = error.message?.includes('Capacity');
      const delay = isCapacityError ? CAPACITY_RETRY_DELAY : RETRY_DELAY;
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return attemptTaskLaunch(ecsClient, taskDefinition, retryCount + 1);
    }
    throw error;
  }
}

export async function POST(request: Request) {
  const encoder = new TextEncoder();
  const { taskDefinition, count } = await request.json();
  
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  
  let isStreamClosed = false;

  const sendMessage = async (message: string) => {
    if (!isStreamClosed) {
      try {
        await writer.write(encoder.encode(`data: ${JSON.stringify({ message })}\n\n`));
      } catch (error) {
        isStreamClosed = true;
      }
    }
  };

  const cleanup = async () => {
    if (!isStreamClosed) {
      try {
        isStreamClosed = true;
        await writer.close();
      } catch (error) {
        // Ignore close errors
      }
    }
  };

  (async () => {
    const startTime = Date.now();
    try {
      await sendMessage(`Starting launch of ${count} tasks for ${taskDefinition}`);
      
      let successfulLaunches = 0;
      let failedTasks: number[] = [];
      const batches = Math.ceil(count / BATCH_SIZE);
      
      // First attempt for all tasks
      for (let batch = 0; batch < batches && !isStreamClosed; batch++) {
        const batchStart = batch * BATCH_SIZE;
        const batchEnd = Math.min((batch + 1) * BATCH_SIZE, count);
        
        await sendMessage(`Processing batch ${batch + 1}/${batches} (${batchStart + 1}-${batchEnd})`);

        const batchResults = await processBatch(batchStart, batchEnd);
        successfulLaunches += batchResults.successes;
        failedTasks.push(...batchResults.failures);

        // Add delay between batches
        if (batch < batches - 1 && !isStreamClosed) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Retry failed tasks
      let retryAttempt = 0;
      while (failedTasks.length > 0 && retryAttempt < MAX_BATCH_RETRIES && !isStreamClosed) {
        await sendMessage(`Retrying ${failedTasks.length} failed tasks (Attempt ${retryAttempt + 1}/${MAX_BATCH_RETRIES})`);
        
        const retryResults = await processBatch(0, failedTasks.length, failedTasks);
        successfulLaunches += retryResults.successes;
        
        // Update failed tasks list with only the ones that failed again
        failedTasks = retryResults.failures;
        retryAttempt++;

        // Add delay between retry attempts
        if (failedTasks.length > 0 && retryAttempt < MAX_BATCH_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, CAPACITY_RETRY_DELAY));
        }
      }

      if (!isStreamClosed) {
        const finalMessage = failedTasks.length > 0
          ? `Launch complete. Successfully launched ${successfulLaunches}/${count} tasks. ${failedTasks.length} tasks failed after all retry attempts.`
          : `Launch complete. Successfully launched all ${count} tasks.`;
        await sendMessage(finalMessage);
      }
    } catch (error: any) {
      if (!isStreamClosed) {
        await sendMessage(`Error: ${error.message}`);
      }
    } finally {
      await cleanup();
    }
  })();

  // Helper function to process a batch of tasks
  async function processBatch(start: number, end: number, taskIndices?: number[]) {
    let successes = 0;
    const failures: number[] = [];

    for (let i = start; i < end && !isStreamClosed; i++) {
      const taskIndex = taskIndices ? taskIndices[i] : i + 1;
      
      try {
        if (taskDefinition.includes('Video_Mix')) {
          const response = await attemptTaskLaunch(ecsClient, taskDefinition);
          
          if (response.tasks?.length) {
            successes++;
            await sendMessage(`Successfully launched task ${taskIndex}/${count}`);
          }

          if (response.failures?.length) {
            failures.push(taskIndex);
            await sendMessage(`Failed to launch task ${taskIndex}: ${response.failures[0].reason}`);
          }

          if (i < end - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } else {
          const response = await attemptTaskLaunch(ecsClient, taskDefinition);
          
          if (response.tasks?.length) {
            successes++;
            await sendMessage(`Successfully launched task ${taskIndex}/${count}`);
          }

          if (response.failures?.length) {
            failures.push(taskIndex);
            await sendMessage(`Failed to launch task ${taskIndex}: ${response.failures[0].reason}`);
          }
        }
      } catch (error: any) {
        failures.push(taskIndex);
        await sendMessage(`Error launching task ${taskIndex}: ${error.message}`);
      }
    }

    return { successes, failures };
  }

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
} 