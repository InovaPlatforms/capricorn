'use client';
import { Play, Pause, SkipForward, SkipBack, Volume2, Shuffle, Repeat, Heart } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import { Track } from '@/types/music';

interface PlaybackControlsProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  progress: number;
  duration: number;
  volume: number;
  onPlayPause: () => void;
  onVolumeChange: (volume: number) => void;
  onSeek: (time: number) => void;
  onToggleMute: () => void;
}

export default function PlaybackControls({
  currentTrack,
  isPlaying,
  isLoading,
  progress,
  duration,
  volume,
  onPlayPause,
  onVolumeChange,
  onSeek,
  onToggleMute
}: PlaybackControlsProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-zinc-900 border-t border-white/10 px-4">
      {/* ... existing playback controls JSX ... */}
    </div>
  );
} 