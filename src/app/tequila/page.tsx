'use client';
import React, { useEffect, useState, useRef } from "react";
import { VideoError } from '../../types';
import { Play } from 'lucide-react';

const BUCKET_NAME = 'unassigned-videos';

interface VideoState {
  isPlaying: boolean;
  error: string | null;
}

export default function TequilaProfile() {
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoStates, setVideoStates] = useState<{ [key: string]: VideoState }>({});
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  useEffect(() => {
    const generateVideoUrls = () => {
      try {
        setLoading(true);
        setError(null);
        
        // Generate URLs directly from the public bucket
        const urls = Array.from({ length: 36 }, (_, i) => {
          const paddedId = (i + 1).toString().padStart(4, '0');
          return `https://storage.googleapis.com/${BUCKET_NAME}/nk/${paddedId}.mp4`;
        });
        
        console.log('Generated video URLs:', urls.length);
        setVideoUrls(urls);
        videoRefs.current = new Array(urls.length).fill(null);
        
        // Initialize video states
        const initialStates: { [key: string]: VideoState } = {};
        urls.forEach(url => {
          initialStates[url] = { isPlaying: false, error: null };
        });
        setVideoStates(initialStates);
      } catch (error) {
        console.error('Error generating video URLs:', error);
        setError(error instanceof Error ? error.message : 'Failed to load videos');
      } finally {
        setLoading(false);
      }
    };

    generateVideoUrls();
  }, []);

  const handleVideoError = (url: string, event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = event.target as HTMLVideoElement;
    console.error('Video loading error:', {
      url,
      error: video.error?.message || 'Unknown error'
    });
    
    setVideoStates(prev => ({
      ...prev,
      [url]: { ...prev[url], error: video.error?.message || 'Failed to load video' }
    }));
  };

  const handlePlayClick = async (url: string, index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    try {
      setVideoStates(prev => ({
        ...prev,
        [url]: { ...prev[url], isPlaying: true }
      }));
      
      // Load and play the video
      await video.load();
      await video.play();
    } catch (error) {
      console.error('Error playing video:', error);
      setVideoStates(prev => ({
        ...prev,
        [url]: { ...prev[url], error: 'Failed to play video' }
      }));
    }
  };

  const retryVideo = async (url: string, index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    try {
      setVideoStates(prev => ({
        ...prev,
        [url]: { isPlaying: false, error: null }
      }));
      
      await video.load();
    } catch (error) {
      console.error('Error retrying video:', error);
      setVideoStates(prev => ({
        ...prev,
        [url]: { ...prev[url], error: 'Failed to retry video' }
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-500 text-xl">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Tequila&apos;s Videos
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoUrls.map((url, index) => {
            const state = videoStates[url];
            const paddedId = (index + 1).toString().padStart(4, '0');
            return (
              <div key={url} className="relative aspect-video bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <video
                  ref={(el) => { videoRefs.current[index] = el; }}
                  src={url}
                  className="w-full h-full object-cover"
                  controls={state?.isPlaying}
                  playsInline
                  preload="metadata"
                  poster={`https://storage.googleapis.com/${BUCKET_NAME}/thumbnails/nk/${paddedId}.jpg`}
                  onError={(e) => handleVideoError(url, e)}
                />
                {!state?.isPlaying && !state?.error && (
                  <button
                    onClick={() => handlePlayClick(url, index)}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-40 transition-opacity group"
                  >
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-pink-500 bg-opacity-90 group-hover:bg-opacity-100 transition-all transform group-hover:scale-110">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </button>
                )}
                {state?.error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 p-4">
                    <p className="text-red-500 text-sm mb-2">{state.error}</p>
                    <button
                      onClick={() => retryVideo(url, index)}
                      className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}