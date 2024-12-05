'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, Shuffle, Repeat, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';
import { musicBuckets } from '@/data/music';
import { MusicBucket } from '@/types/music';

interface Track {
  id: string;
  title: string;
  artist: string;
  image: string;
  duration: number;
  s3Key?: string;
  bucket: string;
}

// Create initial playlists with placeholder data
const initialPlaylists = musicBuckets.map(bucket => ({
  title: `${bucket.name} Mix`,
  items: Array(6).fill(null).map((_, i) => ({
    id: `${bucket.id}-${i}`,
    title: `${bucket.name} Track ${i + 1}`,
    artist: bucket.name,
    image: bucket.image || musicBuckets[0].image,
    duration: 0,
    bucket: bucket.id
  }))
}));

export default function Music() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [nextTrack, setNextTrack] = useState<Track | null>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(66);
  const [duration, setDuration] = useState(0);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const [playlists] = useState(initialPlaylists);

  // Fetch a single track when needed
  const fetchTrack = async (bucket: string): Promise<string | null> => {
    try {
      const response = await fetch(`/api/listFiles/${bucket}?prefix=archive/songs/`);
      if (!response.ok) throw new Error('Failed to fetch tracks');
      
      const files: string[] = await response.json();
      if (files.length === 0) return null;

      return files[Math.floor(Math.random() * files.length)];
    } catch (error) {
      console.error('Error fetching track:', error);
      return null;
    }
  };

  // Handle track selection
  const handleTrackSelect = async (track: Track) => {
    setIsLoading(true);
    setIsAudioReady(false);

    try {
      // Only fetch the S3 key if we don't have it yet
      if (!track.s3Key) {
        const s3Key = await fetchTrack(track.bucket);
        if (s3Key) {
          track = { ...track, s3Key };
        } else {
          throw new Error('Failed to fetch track');
        }
      }

      setCurrentTrack(track);
      if (audioRef.current) {
        audioRef.current.src = `/api/audio/${track.bucket}/${track.s3Key}`;
        audioRef.current.load();
        setIsPlaying(true);
      }

      // Prepare next track in the background
      if (!nextTrack?.s3Key) {
        const nextS3Key = await fetchTrack(track.bucket);
        if (nextS3Key) {
          setNextTrack({
            ...track,
            id: `next-${track.bucket}`,
            s3Key: nextS3Key
          });
        }
      }
    } catch (error) {
      console.error('Error playing track:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Audio event handlers
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsAudioReady(true);
      if (isPlaying) audio.play();
    };

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = async () => {
      if (nextTrack) {
        await handleTrackSelect(nextTrack);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isPlaying, nextTrack]);

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(percent * 100);
  };

  const handleProgressBarHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * audioRef.current.duration;
    
    // Update tooltip position and time
    const tooltip = e.currentTarget.querySelector('.progress-tooltip');
    if (tooltip instanceof HTMLElement) {
      tooltip.textContent = formatTime(time);
      tooltip.style.left = `${e.clientX - rect.left}px`;
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white pt-16">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <div className="w-64 bg-black p-6 hidden md:block">
            <nav className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-400">LIBRARY</h2>
                <div className="space-y-2">
                  {['Made For You', 'Recently Played', 'Liked Songs', 'Albums', 'Artists', 'Podcasts'].map((item) => (
                    <button
                      key={item}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-md hover:bg-white/5"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-400">PLAYLISTS</h2>
                <div className="space-y-2">
                  {musicBuckets.map((bucket) => (
                    <button
                      key={bucket.id}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-md hover:bg-white/5"
                    >
                      {bucket.name} Mix
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
              {/* Hero Section */}
              <div className="mb-12">
                <h1 className="text-3xl font-bold mb-6">Good evening</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {musicBuckets.map((bucket: MusicBucket) => (
                    <Link
                      key={bucket.id}
                      href={`/music/artists/${bucket.artistId}`}
                      className="flex items-center bg-white/5 hover:bg-white/10 transition-colors rounded-md overflow-hidden"
                    >
                      <div className="relative w-16 h-16">
                        <Image
                          src={bucket.image}
                          alt={bucket.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="px-4 font-medium">{bucket.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Playlists */}
              {playlists.map((section) => (
                <div key={section.title} className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">{section.title}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {section.items.map((item) => (
                      <motion.div
                        key={item.id}
                        className="bg-zinc-900/50 p-4 rounded-md hover:bg-zinc-800/50 transition-colors group cursor-pointer"
                        whileHover={{ y: -4 }}
                        onClick={() => handleTrackSelect(item)}
                      >
                        <div className="relative aspect-square mb-4 rounded-md overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <button 
                            className="absolute right-2 bottom-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0"
                            disabled={isLoading && currentTrack?.id === item.id}
                          >
                            {isLoading && currentTrack?.id === item.id ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Play fill="white" size={20} />
                            )}
                          </button>
                        </div>
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-400">{item.artist}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-zinc-900 border-t border-white/10 px-4">
          <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
            {/* Track Info */}
            <div className="flex items-center space-x-4">
              {currentTrack && (
                <>
                  <div className="relative w-14 h-14">
                    <Image
                      src={currentTrack.image}
                      alt={currentTrack.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{currentTrack.title}</h4>
                    <p className="text-xs text-gray-400">{currentTrack.artist}</p>
                  </div>
                  <button className="text-gray-400 hover:text-white">
                    <Heart size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Playback Controls */}
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-6">
                <button className="text-gray-400 hover:text-white">
                  <Shuffle size={20} />
                </button>
                <button className="text-gray-400 hover:text-white">
                  <SkipBack size={20} />
                </button>
                <button
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition"
                  onClick={() => {
                    if (audioRef.current) {
                      if (isPlaying) {
                        audioRef.current.pause();
                      } else {
                        audioRef.current.play();
                      }
                      setIsPlaying(!isPlaying);
                    }
                  }}
                  disabled={!isAudioReady && !currentTrack}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="text-black" size={20} />
                  ) : (
                    <Play className="text-black" size={20} />
                  )}
                </button>
                <button className="text-gray-400 hover:text-white">
                  <SkipForward size={20} />
                </button>
                <button className="text-gray-400 hover:text-white">
                  <Repeat size={20} />
                </button>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs text-gray-400">
                  {formatTime((progress / 100) * duration)}
                </span>
                <div 
                  ref={progressBarRef}
                  className="h-1 bg-white/20 rounded-full cursor-pointer relative group"
                  onClick={handleProgressBarClick}
                  onMouseMove={handleProgressBarHover}
                >
                  <div 
                    className="h-full bg-white rounded-full relative group-hover:bg-green-500 transition-colors"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {/* Add tooltip */}
                  <div 
                    className="progress-tooltip absolute -top-8 transform -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ left: '50%' }}
                  >
                    0:00
                  </div>
                </div>
                <span className="text-xs text-gray-400">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <Volume2 
                size={20} 
                className="text-gray-400 hover:text-white cursor-pointer"
                onClick={() => setVolume(prev => prev === 0 ? 66 : 0)}
              />
              <div 
                ref={volumeBarRef}
                className="w-24 h-1 bg-white/20 rounded-full cursor-pointer group"
                onClick={(e) => {
                  if (!volumeBarRef.current || !audioRef.current) return;
                  const rect = volumeBarRef.current.getBoundingClientRect();
                  const percent = (e.clientX - rect.left) / rect.width;
                  const newVolume = Math.max(0, Math.min(100, percent * 100));
                  setVolume(newVolume);
                  if (audioRef.current) audioRef.current.volume = newVolume / 100;
                }}
              >
                <div 
                  className="h-full bg-white rounded-full relative group-hover:bg-green-500 transition-colors"
                  style={{ width: `${volume}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audio player */}
        <audio 
          ref={audioRef} 
          className="hidden"
          onVolumeChange={(e) => {
            if (audioRef.current) {
              setVolume(audioRef.current.volume * 100);
            }
          }}
        />
      </main>
    </>
  );
} 