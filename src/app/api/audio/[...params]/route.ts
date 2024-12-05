import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
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
  { params }: { params: { params: string[] } }
) {
  const [bucket, ...keyParts] = params.params;
  const key = keyParts.join('/');
  console.log(`Attempting to fetch audio file: ${key} from bucket: ${bucket}`);
  console.log(`AWS Region: ${process.env.AWS_REGION}`);

  const possiblePaths = [
    `archive/songs/${key}`,
    key,
    // Add more possible paths if needed
  ];

  for (const path of possiblePaths) {
    try {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: path,
      });

      console.log(`Trying S3 command for bucket: ${command.input.Bucket}, key: ${command.input.Key}`);

      const { Body, ContentType } = await s3Client.send(command);

      if (!Body) {
        console.log(`S3 response body is null for path: ${path}`);
        continue;
      }

      if (!(Body instanceof Readable)) {
        console.log(`S3 response body is not a Readable stream for path: ${path}`);
        continue;
      }

      const chunks = [];
      for await (const chunk of Body) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      console.log(`Successfully fetched audio file: ${path}, size: ${buffer.length} bytes, Content-Type: ${ContentType}`);

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': ContentType || 'audio/mpeg',
          'Content-Disposition': `inline; filename="${key}"`,
          'Content-Length': buffer.length.toString(),
        },
      });
    } catch (error: any) {
      console.log(`Error fetching file from path ${path}:`, error.message);
      // Continue to the next path if this one fails
    }
  }

  // If we've tried all paths and none worked, return a 404
  console.error('File not found in any of the attempted paths');
  return new NextResponse('File not found', { status: 404 });
}