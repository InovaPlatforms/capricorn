'use client';
import React, { useEffect, useState, useRef, useCallback } from "react";
import { VideoError } from '../../types';
import { Play, Heart, MessageCircle, DollarSign } from 'lucide-react';

const BUCKET_NAME = 'unassigned-videos';
const VIDEOS_PER_PAGE = 6;
const TOTAL_VIDEOS = 36;

interface VideoState {
  isPlaying: boolean;
  error: string | null;
  thumbnail: string | null;
}

export default function TequilaProfile() {
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoStates, setVideoStates] = useState<{ [key: string]: VideoState }>({});
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());
  const [hasMore, setHasMore] = useState(true);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadVideos = useCallback(async () => {
    if (loading || !hasMore) return;
    
    try {
      setLoading(true);
      
      // Calculate the next page to load
      const nextPage = Math.floor(videoUrls.length / VIDEOS_PER_PAGE) + 1;
      
      // Check if we've already loaded this page
      if (loadedPages.has(nextPage)) {
        setLoading(false);
        return;
      }
      
      const startIndex = (nextPage - 1) * VIDEOS_PER_PAGE;
      const newUrls = Array.from({ length: VIDEOS_PER_PAGE }, (_, i) => {
        const videoNumber = startIndex + i + 1;
        if (videoNumber > TOTAL_VIDEOS) return null;
        const paddedId = videoNumber.toString().padStart(4, '0');
        return `https://storage.googleapis.com/${BUCKET_NAME}/nk/${paddedId}.mp4`;
      }).filter((url): url is string => url !== null);

      if (newUrls.length === 0) {
        setHasMore(false);
        return;
      }

      setVideoUrls(prev => [...prev, ...newUrls]);
      videoRefs.current = [...videoRefs.current, ...new Array(newUrls.length).fill(null)];

      const initialStates: { [key: string]: VideoState } = {};
      newUrls.forEach(url => {
        initialStates[url] = { isPlaying: false, error: null, thumbnail: null };
      });
      setVideoStates(prev => ({ ...prev, ...initialStates }));

      // Mark this page as loaded
      setLoadedPages(prev => new Set(Array.from(prev).concat([nextPage])));
      setHasMore(startIndex + VIDEOS_PER_PAGE < TOTAL_VIDEOS);
    } catch (error) {
      console.error('Error loading videos:', error);
      setError(error instanceof Error ? error.message : 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, videoUrls.length, loadedPages]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadVideos();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [loadVideos]);

  // Video playback observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(err => console.log('Auto-play prevented:', err));
          } else {
            video.pause();
            video.currentTime = 0;
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

  // Initial load
  useEffect(() => {
    loadVideos();
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
                  preload="none"
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
          
          {/* Loading indicator and infinite scroll trigger */}
          <div ref={loadMoreRef} className="py-8 flex justify-center">
            {loading && (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}