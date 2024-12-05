import { ECSClient, ListTasksCommand, DescribeTasksCommand } from '@aws-sdk/client-ecs';
import { NextResponse } from 'next/server';

// Create ECS client outside the handler to be reused
const ecsClient = new ECSClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export const dynamic = 'force-dynamic';  // This is crucial - prevents static caching
export const revalidate = 0;  // Disable static page regeneration

export async function GET() {
  try {
    console.log('Fetching live tasks at:', new Date().toISOString());

    const listCommand = new ListTasksCommand({
      cluster: process.env.NEXT_PUBLIC_AWS_ECS_CLUSTER,
      maxResults: 100
    });

    const listResponse = await ecsClient.send(listCommand);
    console.log('Live Task List:', {
      taskCount: listResponse.taskArns?.length || 0,
      timestamp: new Date().toISOString()
    });

    if (!listResponse.taskArns || listResponse.taskArns.length === 0) {
      return NextResponse.json({ 
        tasks: [], 
        timestamp: new Date().toISOString(),
        message: 'No tasks found' 
      });
    }

    const describeCommand = new DescribeTasksCommand({
      cluster: process.env.NEXT_PUBLIC_AWS_ECS_CLUSTER,
      tasks: listResponse.taskArns
    });

    const describeResponse = await ecsClient.send(describeCommand);
    
    const tasks = describeResponse.tasks?.map(task => ({
      taskArn: task.taskArn,
      taskDefinitionArn: task.taskDefinitionArn,
      lastStatus: task.lastStatus,
      desiredStatus: task.desiredStatus,
      cpu: task.cpu,
      memory: task.memory,
      createdAt: task.createdAt?.toISOString(),
      group: task.group
    })) || [];

    return NextResponse.json({
      tasks,
      timestamp: new Date().toISOString(),
      count: tasks.length
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Surrogate-Control': 'no-store',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });

  } catch (error: any) {
    console.error('Error fetching live tasks:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get tasks',
        message: error.message,
        timestamp: new Date().toISOString(),
        tasks: [] 
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0'
        }
      }
    );
  }
} 