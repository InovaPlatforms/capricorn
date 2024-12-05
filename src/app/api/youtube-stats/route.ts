import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];

interface Credentials {
  client_id: string;
  client_secret: string;
  refresh_token: string;
}

async function getYoutubeCredentials(artistId: string): Promise<Credentials> {
  try {
    const youtubePath = path.join('youtube', artistId, 'channel2_credentials.json');
    const credsContent = await fs.readFile(youtubePath, 'utf8');
    const creds: Credentials = JSON.parse(credsContent);
    return creds;
  } catch (error) {
    console.error('Error reading credentials:', error);
    throw new Error('Failed to read YouTube credentials.');
  }
}

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const artistId = searchParams.get('artistId');

    if (!artistId) {
      return NextResponse.json({ error: 'Artist ID is required' }, { status: 400 });
    }

    console.log(`Fetching YouTube stats for artist: ${artistId}`);

    // Get credentials
    const credentials = await getYoutubeCredentials(artistId);

    // Read client_secret.json to get the redirect_uri
    const clientSecretPath = path.join('path_to_your_client_secret', 'client_secret.json'); // Update the path accordingly
    const clientSecretContent = await fs.readFile(clientSecretPath, 'utf8');
    const clientSecret = JSON.parse(clientSecretContent);
    const redirectUri = clientSecret.installed.redirect_uris[0]; // Assuming the first redirect URI is used

    // Initialize OAuth2 client with the correct redirect_uri
    const oauth2Client = new google.auth.OAuth2(
      credentials.client_id,
      credentials.client_secret,
      redirectUri
    );

    oauth2Client.setCredentials({
      refresh_token: credentials.refresh_token,
    });

    // Automatically fetch access token using refresh token
    const accessTokenResponse = await oauth2Client.getAccessToken();

    if (!accessTokenResponse.token) {
      throw new Error('Unable to obtain access token.');
    }

    // Initialize YouTube API
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    // Get channel statistics
    const response = await youtube.channels.list({
      part: ['statistics'],
      mine: true,
    });

    const channelStats = response.data.items?.[0]?.statistics;

    if (!channelStats) {
      return NextResponse.json(
        { 
          error: 'No channel statistics found',
          message: `No stats found for ${artistId}`
        },
        { status: 404 }
      );
    }

    console.log(`Successfully fetched stats for ${artistId}`);

    return NextResponse.json({
      subscriberCount: channelStats.subscriberCount || '0',
      viewCount: channelStats.viewCount || '0',
      videoCount: channelStats.videoCount || '0',
      lastUpdated: new Date().toLocaleString(),
    });

  } catch (error: any) {
    console.error('YouTube API Error:', error);

    return NextResponse.json(
      { 
        error: 'Failed to fetch YouTube statistics',
        details: error.message,
      },
      { status: 500 }
    );
  }
} 