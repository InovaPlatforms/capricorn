import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(
  request: Request,
  { params }: { params: { key: string } }
) {
  const key = params.key;
  console.log(`Attempting to fetch audio file: ${key}`);
  console.log(`AWS Region: ${process.env.AWS_REGION}`);
  console.log(`S3 Bucket: ${process.env.S3_BUCKET_NAME}`);

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key, // Remove 'archive/songs/' prefix
    });

    console.log(`Sending S3 command for bucket: ${command.input.Bucket}, key: ${command.input.Key}`);

    const { Body, ContentType } = await s3Client.send(command);

    if (!Body) {
      console.error('S3 response body is null');
      return new NextResponse('File not found', { status: 404 });
    }

    if (!(Body instanceof Readable)) {
      console.error('S3 response body is not a Readable stream');
      return new NextResponse('Invalid file format', { status: 500 });
    }

    const chunks = [];
    for await (const chunk of Body) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    console.log(`Successfully fetched audio file: ${key}, size: ${buffer.length} bytes`);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': ContentType || 'audio/mpeg',
        'Content-Disposition': `inline; filename="${key}"`,
      },
    });
  } catch (error: any) {
    console.error('Error fetching audio file:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return new NextResponse(`Error fetching audio file: ${error.message}`, { status: 500 });
  }
}