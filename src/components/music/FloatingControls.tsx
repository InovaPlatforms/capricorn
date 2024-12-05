'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, Shuffle, Repeat, Heart } from 'lucide-react';
import Image from 'next/image';
import { useMusic } from '@/contexts/MusicContext';

export default function FloatingControls() {
  const { 
    currentTrack, 
    isPlaying, 
    volume,
    playTrack, 
    pauseTrack,
    resumeTrack,
    seekTo, 
    setVolume,
    nextTrack,
    previousTrack 
  } = useMusic();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = document.querySelector('audio');
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
    
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        setDuration(audioRef.current.duration);
      }
    };

    audioRef.current?.addEventListener('timeupdate', handleTimeUpdate);
    return () => audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  if (!currentTrack) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * audioRef.current.duration;
    seekTo(newTime);
    setProgress(percent * 100);
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current || !audioRef.current) return;
    const rect = volumeBarRef.current.getBoundingClientRect();
    const newVolume = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black to-zinc-900/95 backdrop-blur-lg border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 h-24">
        <div className="flex items-center justify-between h-full">
          {/* Track Info */}
          <div className="flex items-center space-x-4 w-1/4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={currentTrack.image}
                alt={currentTrack.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-medium truncate">{currentTrack.title}</h4>
              <p className="text-xs text-gray-400 truncate">{currentTrack.artist}</p>
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Heart size={20} />
            </button>
          </div>

          {/* Playback Controls */}
          <div className="flex flex-col items-center w-2/4">
            <div className="flex items-center space-x-6 mb-2">
              <button className="text-gray-400 hover:text-white transition-colors">
                <Shuffle size={20} />
              </button>
              <button 
                onClick={previousTrack}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SkipBack size={24} />
              </button>
              <button
                onClick={() => isPlaying ? pauseTrack() : (currentTrack ? resumeTrack() : null)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="text-black" size={24} />
                ) : (
                  <Play className="text-black translate-x-0.5" size={24} />
                )}
              </button>
              <button 
                onClick={nextTrack}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SkipForward size={24} />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Repeat size={20} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center space-x-2 w-full">
              <span className="text-xs text-gray-400 w-12 text-right">
                {formatTime((progress / 100) * duration)}
              </span>
              <div 
                ref={progressBarRef}
                className="flex-grow h-1 bg-white/20 rounded-full cursor-pointer group relative"
                onClick={handleProgressClick}
                onMouseMove={(e) => {
                  if (!progressBarRef.current || !audioRef.current) return;
                  const rect = progressBarRef.current.getBoundingClientRect();
                  const percent = (e.clientX - rect.left) / rect.width;
                  const tooltip = e.currentTarget.querySelector('.progress-tooltip');
                  if (tooltip instanceof HTMLElement) {
                    tooltip.style.opacity = '1';
                    tooltip.style.left = `${e.clientX - rect.left}px`;
                    tooltip.textContent = formatTime(percent * duration);
                  }
                }}
                onMouseLeave={(e) => {
                  const tooltip = e.currentTarget.querySelector('.progress-tooltip');
                  if (tooltip instanceof HTMLElement) {
                    tooltip.style.opacity = '0';
                  }
                }}
              >
                <div 
                  className="h-full bg-white rounded-full relative group-hover:bg-green-500 transition-colors"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div 
                  className="progress-tooltip absolute -top-8 px-2 py-1 bg-black rounded text-xs pointer-events-none opacity-0 transition-opacity"
                  style={{ transform: 'translateX(-50%)' }}
                >
                  0:00
                </div>
              </div>
              <span className="text-xs text-gray-400 w-12">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center justify-end space-x-2 w-1/4">
            <div 
              className="relative"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <button 
                onClick={() => setVolume(volume > 0 ? 0 : 75)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Volume2 size={20} />
              </button>
              {showVolumeSlider && (
                <div 
                  ref={volumeBarRef}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-32 h-1 bg-white/20 rounded-full cursor-pointer"
                  onClick={handleVolumeChange}
                >
                  <div 
                    className="h-full bg-white rounded-full relative"
                    style={{ width: `${volume}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 
