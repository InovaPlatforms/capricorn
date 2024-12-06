import { Storage } from '@google-cloud/storage';
import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { Readable } from 'stream';

// Convert a Node.js Readable stream to a Web ReadableStream
function nodeStreamToWebStream(nodeStream: Readable) {
  return new ReadableStream({
    start(controller) {
      nodeStream.on('data', (chunk) => {
        controller.enqueue(chunk);
      });
      nodeStream.on('end', () => {
        controller.close();
      });
      nodeStream.on('error', (err) => {
        controller.error(err);
      });
    },
  });
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const fileName = `nk/${id.padStart(4, '0')}.mp4`;

    console.log('Streaming video:', fileName);
    
    const credentialsPath = path.join(process.cwd(), '.secrets', 'video-streaming-sa.json');
    const credentials = JSON.parse(await fs.readFile(credentialsPath, 'utf8'));

    const storage = new Storage({
      credentials,
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'inova-441715',
    });

    const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET || 'unassigned-videos';
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    const [exists] = await file.exists();
    if (!exists) {
      console.error(`File does not exist: ${fileName}`);
      return new NextResponse('Video not found', { status: 404 });
    }

    const [metadata] = await file.getMetadata();
    const fileSize = Number(metadata.size);

    // Handle range requests
    const range = request.headers.get('range');
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const readStream = file.createReadStream({
        start,
        end,
      });

      const headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': String(chunkSize),
        'Content-Type': 'video/mp4',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Range',
        'Access-Control-Expose-Headers': 'Content-Range, Content-Length, Accept-Ranges',
      };

      return new Response(nodeStreamToWebStream(readStream), {
        status: 206,
        headers,
      });
    } else {
      // Handle non-range requests
      const readStream = file.createReadStream();

      const headers = {
        'Content-Length': String(fileSize),
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Range',
        'Access-Control-Expose-Headers': 'Content-Range, Content-Length, Accept-Ranges',
      };

      return new Response(nodeStreamToWebStream(readStream), {
        status: 200,
        headers,
      });
    }
  } catch (error) {
    console.error('Error streaming video:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to stream video',
        details: error instanceof Error ? error.message : String(error)
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Range',
      'Access-Control-Expose-Headers': 'Content-Range, Content-Length, Accept-Ranges',
      'Access-Control-Max-Age': '3600'
    },
  });
} 