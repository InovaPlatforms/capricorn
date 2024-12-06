'use client';
import React, { useEffect, useState, useRef } from "react";
import { VideoError } from '../../types';
import { Play, Heart, MessageCircle, DollarSign } from 'lucide-react';

const BUCKET_NAME = 'unassigned-videos';

interface VideoState {
  isPlaying: boolean;
  error: string | null;
  thumbnail: string | null;
}

export default function TequilaProfile() {
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoStates, setVideoStates] = useState<{ [key: string]: VideoState }>({});
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(err => console.log('Auto-play prevented:', err));
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Add observer to new videos
  useEffect(() => {
    videoRefs.current.forEach((videoRef) => {
      if (videoRef && observerRef.current) {
        observerRef.current.observe(videoRef);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [videoUrls]);

  useEffect(() => {
    const generateVideoUrls = () => {
      try {
        setLoading(true);
        setError(null);
        
        const urls = Array.from({ length: 36 }, (_, i) => {
          const paddedId = (i + 1).toString().padStart(4, '0');
          return `https://storage.googleapis.com/${BUCKET_NAME}/nk/${paddedId}.mp4`;
        });
        
        console.log('Generated video URLs:', urls.length);
        setVideoUrls(urls);
        videoRefs.current = new Array(urls.length).fill(null);
        
        const initialStates: { [key: string]: VideoState } = {};
        urls.forEach(url => {
          initialStates[url] = { isPlaying: false, error: null, thumbnail: null };
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

  const generateThumbnail = (video: HTMLVideoElement, url: string) => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    try {
      const thumbnail = canvas.toDataURL('image/jpeg');
      setVideoStates(prev => ({
        ...prev,
        [url]: { ...prev[url], thumbnail }
      }));
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }
  };

  const handleVideoLoad = (url: string, event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = event.target as HTMLVideoElement;
    generateThumbnail(video, url);
  };

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
        [url]: { isPlaying: false, error: null, thumbnail: null }
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
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-500 text-xl">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Profile Header */}
      <div className="bg-gradient-to-b from-blue-600/20 to-[#0D0D0D] pb-6">
        <div className="max-w-7xl mx-auto px-4 pt-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold">
              T
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">Tequila</h1>
              <div className="flex items-center gap-4 text-gray-300">
                <span className="flex items-center gap-1">
                  <Heart size={16} /> 12.4K
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={16} /> 234
                </span>
              </div>
            </div>
            <button className="ml-auto px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-full font-semibold transition-colors">
              Subscribe
            </button>
          </div>
          
          <div className="flex gap-4 border-b border-white/10 pb-4">
            <button className="px-4 py-2 text-blue-500 border-b-2 border-blue-500">Posts</button>
            <button className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Photos</button>
            <button className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Videos</button>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-8">
          {videoUrls.map((url, index) => {
            const state = videoStates[url];
            return (
              <div key={url} className="relative aspect-video bg-[#1A1A1A] rounded-lg overflow-hidden group">
                <video
                  ref={(el) => { videoRefs.current[index] = el; }}
                  src={url}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    state?.isPlaying ? 'scale-[1.02] shadow-xl relative z-10' : ''
                  }`}
                  controls={state?.isPlaying}
                  playsInline
                  loop
                  muted
                  preload="metadata"
                  onLoadedData={(e) => handleVideoLoad(url, e)}
                  onError={(e) => handleVideoError(url, e)}
                />
                {state?.error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 p-4">
                    <p className="text-red-500 text-sm mb-2">{state.error}</p>
                    <button
                      onClick={() => retryVideo(url, index)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button className="hover:text-blue-500 transition-colors">
                        <Heart size={20} />
                      </button>
                      <button className="hover:text-blue-500 transition-colors">
                        <MessageCircle size={20} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-blue-500" />
                      <span className="text-sm font-medium">Unlock for $9.99</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}