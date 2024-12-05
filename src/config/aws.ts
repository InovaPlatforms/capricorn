import { S3Client } from "@aws-sdk/client-s3";
import { ECSClient } from "@aws-sdk/client-ecs";

// AWS Configuration
export const AWS_REGION = process.env.NEXT_PUBLIC_AWS_REGION || 'us-west-1';
export const AWS_BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || 'z-assets';
export const AWS_ECS_CLUSTER = process.env.NEXT_PUBLIC_AWS_ECS_CLUSTER || 'SYB';
export const AWS_SUBNET_ID = process.env.NEXT_PUBLIC_AWS_SUBNET_ID || 'subnet-005b6948c385d16cd';
export const AWS_SECURITY_GROUP_ID = process.env.NEXT_PUBLIC_AWS_SECURITY_GROUP_ID || 'sg-0387532d649bda07f';

// Initialize AWS clients
export const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!
  }
});

export const ecsClient = new ECSClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!
  }
}); 