import { ListObjectsV2Command, ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";
import { RunTaskCommand, ListTasksCommand, DescribeTasksCommand } from "@aws-sdk/client-ecs";
import { 
  s3Client, 
  ecsClient, 
  AWS_BUCKET_NAME, 
  AWS_ECS_CLUSTER,
  AWS_SUBNET_ID,
  AWS_SECURITY_GROUP_ID 
} from "@/config/aws";

export async function getBucketStats(prefix: string, bucket: string): Promise<number> {
  try {
    if (!bucket) {
      console.error('Bucket name is required');
      return 0;
    }

    const response = await fetch(`/api/bucket-stats?prefix=${encodeURIComponent(prefix)}&bucket=${encodeURIComponent(bucket)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch bucket stats');
    }
    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error getting bucket stats:', error);
    return 0;
  }
}

export async function launchECSTask(taskDefinition: string, cluster: string = AWS_ECS_CLUSTER) {
  try {
    const command = new RunTaskCommand({
      cluster,
      taskDefinition,
      launchType: 'FARGATE',
      networkConfiguration: {
        awsvpcConfiguration: {
          subnets: [AWS_SUBNET_ID],
          securityGroups: [AWS_SECURITY_GROUP_ID],
          assignPublicIp: 'ENABLED'
        }
      }
    });

    const response = await ecsClient.send(command);
    return response;
  } catch (error) {
    console.error('Error launching ECS task:', error);
    throw error;
  }
}

export async function getRunningTasks(cluster: string = AWS_ECS_CLUSTER) {
  try {
    const listCommand = new ListTasksCommand({
      cluster,
      desiredStatus: 'RUNNING'
    });
    
    const listResponse = await ecsClient.send(listCommand);
    
    if (!listResponse.taskArns?.length) return [];
    
    const describeCommand = new DescribeTasksCommand({
      cluster,
      tasks: listResponse.taskArns
    });
    
    const describeResponse = await ecsClient.send(describeCommand);
    return describeResponse.tasks || [];
  } catch (error) {
    console.error('Error getting running tasks:', error);
    return [];
  }
} 