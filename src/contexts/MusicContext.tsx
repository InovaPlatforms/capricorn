'use client';
import { createContext, useContext, useState, useRef } from 'react';
import { Track } from '@/types/music';

interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  playTrack: (track: Track) => Promise<void>;
  pauseTrack: () => void;
  resumeTrack: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  trackHistory: Track[];
  currentIndex: number;
}

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(75);
  const [trackHistory, setTrackHistory] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTrack = async (track: Track) => {
    if (!track.s3Key) {
      try {
        const response = await fetch(`/api/listFiles/${track.bucket}?prefix=archive/songs/`);
        const files = await response.json();
        track.s3Key = files[0];
      } catch (error) {
        console.error('Error fetching track:', error);
        return;
      }
    }

    setCurrentTrack(track);
    setTrackHistory(prev => [...prev, track]);
    setCurrentIndex(prev => prev + 1);

    if (audioRef.current) {
      audioRef.current.src = `/api/audio/${track.bucket}/${track.s3Key}`;
      audioRef.current.volume = volume / 100;
      audioRef.current.load();
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing track:', error);
      }
    }
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeTrack = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const setVolume = (newVolume: number) => {
    if (audioRef.current) {
      const volumeValue = Math.max(0, Math.min(100, newVolume));
      audioRef.current.volume = volumeValue / 100;
      setVolumeState(volumeValue);
    }
  };

  const nextTrack = () => {
    if (currentIndex < trackHistory.length - 1) {
      const nextTrack = trackHistory[currentIndex + 1];
      setCurrentIndex(prev => prev + 1);
      playTrack(nextTrack);
    }
  };

  const previousTrack = () => {
    if (currentIndex > 0) {
      const prevTrack = trackHistory[currentIndex - 1];
      setCurrentIndex(prev => prev - 1);
      playTrack(prevTrack);
    }
  };

  return (
    <MusicContext.Provider 
      value={{ 
        currentTrack, 
        isPlaying, 
        volume,
        playTrack, 
        pauseTrack,
        resumeTrack, 
        seekTo, 
        setVolume,
        nextTrack,
        previousTrack,
        trackHistory,
        currentIndex
      }}
    >
      {children}
      <audio 
        ref={audioRef} 
        className="hidden"
        onEnded={nextTrack}
      />
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within MusicProvider');
  return context;
} 