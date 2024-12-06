import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Generating video URLs...');
    
    // Generate array of video IDs (1 to 36)
    const videoIds = Array.from({ length: 36 }, (_, i) => (i + 1).toString());
    
    // Create URLs for each video using our streaming endpoint
    const urls = videoIds.map(id => `/api/videos/${id}`);
    
    console.log(`Successfully generated ${urls.length} video URLs`);
    
    return new NextResponse(JSON.stringify({ urls }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Range',
        'Access-Control-Expose-Headers': 'Content-Range, Content-Length, Accept-Ranges',
      },
    });
  } catch (error) {
    console.error('Error generating video URLs:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to generate video URLs',
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