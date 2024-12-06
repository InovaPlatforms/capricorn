'use client';

import React from 'react';
import { Track, formatTime } from '@/utils/music-utils';
import { Play, Pause } from 'lucide-react';

interface TrackListProps {
  tracks: Track[];
  currentTrack?: Track;
  isPlaying: boolean;
  onTrackSelect: (track: Track) => void;
}

export default function TrackList({
  tracks,
  currentTrack,
  isPlaying,
  onTrackSelect,
}: TrackListProps) {
  return (
    <div className="space-y-2">
      {tracks.map((track) => {
        const isCurrentTrack = currentTrack?.id === track.id;
        return (
          <div
            key={track.id}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              isCurrentTrack
                ? 'bg-blue-500/10 hover:bg-blue-500/20'
                : 'hover:bg-white/5'
            }`}
            onClick={() => onTrackSelect(track)}
          >
            <div className="flex items-center gap-4">
              <button
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  isCurrentTrack ? 'bg-blue-500' : 'bg-white/10'
                } hover:bg-blue-600 transition-colors`}
              >
                {isCurrentTrack && isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
              <div>
                <h3 className="font-medium">{track.title}</h3>
                <p className="text-sm text-gray-400">{track.artist}</p>
              </div>
            </div>
            {track.duration && (
              <span className="text-sm text-gray-400">
                {formatTime(track.duration)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
} 