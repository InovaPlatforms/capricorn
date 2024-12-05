import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(
  request: Request,
  { params }: { params: { bucket: string } }
) {
  const bucket = params.bucket;
  const { searchParams } = new URL(request.url);
  const prefix = searchParams.get('prefix') || 'archive/songs/';
  console.log(`API: Attempting to list files in bucket: ${bucket}, prefix: ${prefix}`);

  try {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    });

    const { Contents } = await s3Client.send(command);

    if (!Contents) {
      console.log(`API: No contents found for bucket: ${bucket}, prefix: ${prefix}`);
      return NextResponse.json([], { status: 200 });
    }

    const files = Contents
      .map(file => file.Key)
      .filter(key => key && key.endsWith('.mp3'));

    console.log(`API: Found ${files.length} files for bucket: ${bucket}, prefix: ${prefix}`);
    return NextResponse.json(files, { status: 200 });
  } catch (error: any) {
    console.error('API: Error listing files:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}