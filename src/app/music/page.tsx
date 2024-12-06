'use client';
import { useEffect, useState, useCallback } from 'react';
import { Track } from '@/types';
import TrackList from '@/components/music/TrackList';
import FloatingControls from '@/components/music/FloatingControls';

export default function MusicPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch('/api/tracks');
        const data = await response.json();
        setTracks(data);
      } catch (error) {
        console.error('Error fetching tracks:', error);
      }
    };
    fetchTracks();
  }, []);

  const handleTrackSelect = useCallback((track: Track) => {
    if (audioElement) {
      audioElement.pause();
    }
    
    const newAudio = new Audio(track.url);
    newAudio.volume = volume;
    setAudioElement(newAudio);
    setCurrentTrack(track);
    setIsPlaying(false);
  }, [volume]);

  useEffect(() => {
    if (tracks.length > 0 && !currentTrack) {
      handleTrackSelect(tracks[0]);
    }
  }, [tracks, currentTrack, handleTrackSelect]);

  const handlePlay = () => {
    if (audioElement) {
      audioElement.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioElement) {
      audioElement.volume = newVolume;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Music</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <TrackList
              tracks={tracks}
              currentTrack={currentTrack}
              onTrackSelect={handleTrackSelect}
              isPlaying={isPlaying}
            />
          </div>
          <div>
            <FloatingControls
              track={currentTrack}
              isPlaying={isPlaying}
              volume={volume}
              onPlay={handlePlay}
              onPause={handlePause}
              onVolumeChange={handleVolumeChange}
            />
          </div>
        </div>
      </div>
    </main>
  );
} 