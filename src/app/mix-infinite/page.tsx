'use client'

import { useEffect, useState, useCallback } from 'react'
import { Track } from '@/types'
import { getRandomTrack } from '@/utils/music-utils'
import FloatingControls from '@/components/music/FloatingControls'

export default function MixInfinite() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [nextTrack, setNextTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [nextAudioElement, setNextAudioElement] = useState<HTMLAudioElement | null>(null)

  const prepareRandomTrack = useCallback(async () => {
    try {
      const track = await getRandomTrack()
      const audio = new Audio(track.url)
      audio.volume = volume
      return { track, audio }
    } catch (error) {
      console.error('Error preparing random track:', error)
      return null
    }
  }, [volume])

  const prepareNextTrack = useCallback(async () => {
    const result = await prepareRandomTrack()
    if (result) {
      setNextTrack(result.track)
      setNextAudioElement(result.audio)
    }
  }, [prepareRandomTrack])

  useEffect(() => {
    const initializeAudio = async () => {
      const result = await prepareRandomTrack()
      if (result) {
        setCurrentTrack(result.track)
        setAudioElement(result.audio)
        await prepareNextTrack()
      }
    }
    initializeAudio()
  }, [prepareRandomTrack, prepareNextTrack])

  useEffect(() => {
    const checkMobile = () => {
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        setVolume(1)
      }
    }
    checkMobile()
  }, [])

  useEffect(() => {
    if (audioElement) {
      audioElement.volume = volume
    }
    if (nextAudioElement) {
      nextAudioElement.volume = volume
    }
  }, [volume, audioElement, nextAudioElement])

  const handlePlay = () => {
    if (audioElement) {
      audioElement.play()
      setIsPlaying(true)
    }
  }

  const handlePause = () => {
    if (audioElement) {
      audioElement.pause()
      setIsPlaying(false)
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
  }

  const handleTrackEnd = async () => {
    if (audioElement && nextAudioElement && nextTrack) {
      // Clean up current audio
      audioElement.pause()
      audioElement.currentTime = 0
      
      // Swap current with next
      setCurrentTrack(nextTrack)
      setAudioElement(nextAudioElement)
      
      // Start playing new current track
      nextAudioElement.play()
      
      // Prepare next track
      await prepareNextTrack()
    }
  }

  useEffect(() => {
    if (audioElement) {
      audioElement.addEventListener('ended', handleTrackEnd)
      return () => {
        audioElement.removeEventListener('ended', handleTrackEnd)
      }
    }
  }, [audioElement, handleTrackEnd])

  if (!currentTrack || !audioElement) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <h1 className="text-4xl font-bold mb-8">Infinite Mix</h1>
          <div className="w-full max-w-md">
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
  )
}

//