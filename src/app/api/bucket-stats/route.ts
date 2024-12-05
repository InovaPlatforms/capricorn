import { NextResponse } from 'next/server';
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { S3Client } from '@aws-sdk/client-s3';

// Create S3 client with credentials - using NEXT_PUBLIC_ prefix for now
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const prefix = searchParams.get('prefix');
  const bucket = searchParams.get('bucket');

  if (!prefix || !bucket) {
    return NextResponse.json({ error: 'Prefix and bucket are required' }, { status: 400 });
  }

  try {
    let totalCount = 0;
    let continuationToken: string | undefined;

    do {
      const command = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
        MaxKeys: 1000, // Maximum allowed by S3
      });
      
      const response = await s3Client.send(command);
      totalCount += response.KeyCount || 0;
      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    return NextResponse.json({ count: totalCount });
  } catch (error) {
    console.error('Error getting bucket stats:', error);
    return NextResponse.json({ error: 'Failed to get bucket stats' }, { status: 500 });
  }
} 