'use client';
import { useEffect } from 'react';
import { Track } from '@/types';

interface FloatingControlsProps {
  track: Track | null;
  isPlaying: boolean;
  volume: number;
  onPlay: () => void;
  onPause: () => void;
  onVolumeChange: (volume: number) => void;
}

export default function FloatingControls({
  track,
  isPlaying,
  volume,
  onPlay,
  onPause,
  onVolumeChange,
}: FloatingControlsProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        if (isPlaying) {
          onPause();
        } else {
          onPlay();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isPlaying, onPlay, onPause]);

  useEffect(() => {
    const handleVolumeKeys = (event: KeyboardEvent) => {
      if (event.code === 'ArrowUp') {
        event.preventDefault();
        onVolumeChange(Math.min(1, volume + 0.1));
      } else if (event.code === 'ArrowDown') {
        event.preventDefault();
        onVolumeChange(Math.max(0, volume - 0.1));
      }
    };

    window.addEventListener('keydown', handleVolumeKeys);
    return () => {
      window.removeEventListener('keydown', handleVolumeKeys);
    };
  }, [volume, onVolumeChange]);

  if (!track) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-90 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h3 className="text-sm font-medium">{track.title}</h3>
            <p className="text-xs text-gray-400">{track.artist}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={isPlaying ? onPause : onPlay}
            className="p-2 rounded-full hover:bg-white/10"
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
} 
