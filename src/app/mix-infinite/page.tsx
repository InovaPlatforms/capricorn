'use client'

import { useEffect, useState, useRef } from 'react'
import { FaPlay, FaPause, FaRandom } from 'react-icons/fa'
import Image from 'next/image'

const houseBuckets = [
  { id: '12-disco', name: 'Disco' },
  { id: '10-house-new', name: 'House' },
  { id: '1-syb-new', name: 'SYB' },
  { id: '14-california', name: 'California' },
  { id: '15-aqua', name: 'Aqua' },
  { id: '16-samurai', name: 'Samurai' },
  { id: '17-kazukinozomi', name: 'Kazuki Nozomi' },
  { id: '18-apollo', name: 'Apollo' },
  { id: '2-musicmixes-new', name: 'Music Mixes' },
  { id: '20-hathor', name: 'Hathor' },
  { id: '3-nilewave', name: 'Nilewave' },
  { id: '5-steampunk', name: 'Steampunk' },
  { id: '6-pantheranoir', name: 'Panthera Noir' },
  { id: '7-pebbles-new', name: 'Pebbles' },
  { id: '11-pophouse-new', name: 'Pop House' },
]

const lofiBucket = { id: '4-lofi-new', name: 'Lo-Fi' }

type Track = {
  title: string
  s3Key: string
  bucket: string
}

export default function EndlessHouseMix() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [nextTrack, setNextTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isAudioReady, setIsAudioReady] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentGenre, setCurrentGenre] = useState<'house' | 'lofi'>('house')
  const [isMobile, setIsMobile] = useState(false);
  const [hasShuffled, setHasShuffled] = useState(false);

  useEffect(() => {
    const initializeAudio = async () => {
      await prepareRandomTrack('house')
      console.log('Initial track prepared for genre: house')
    }
    initializeAudio()
  }, [prepareRandomTrack])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getRandomTrack = async (genre: 'house' | 'lofi'): Promise<Track> => {
    console.log(`getRandomTrack called. Genre: ${genre}`)
    let bucket: typeof lofiBucket | typeof houseBuckets[number]
    let prefix: string

    if (genre === 'lofi') {
      bucket = lofiBucket
      prefix = 'archive/songs_lofi/'
    } else {
      bucket = houseBuckets[Math.floor(Math.random() * houseBuckets.length)]
      prefix = 'archive/songs/'
    }

    console.log(`Fetching track for genre: ${genre}`)
    try {
      const response = await fetch(`/api/listFiles/${bucket.id}?prefix=${prefix}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const files: string[] = await response.json()
      if (files.length === 0) {
        throw new Error(`No files found for the selected genre`)
      }
      const randomFile = files[Math.floor(Math.random() * files.length)]
      console.log(`Track selected`)
      return {
        title: randomFile.replace(/^.*[\\/]/, '').replace(/\.[^/.]+$/, ''),
        s3Key: randomFile,
        bucket: bucket.id
      }
    } catch (error: any) {
      console.error(`Error fetching files:`, error)
      throw error
    }
  }

  const prepareRandomTrack = async (genre: 'house' | 'lofi') => {
    console.log(`prepareRandomTrack called. Genre: ${genre}`)
    try {
      const newTrack = await getRandomTrack(genre)
      console.log(`New track prepared`)
      setCurrentTrack(newTrack)
      if (audioRef.current) {
        setIsAudioReady(false)
        audioRef.current.src = `/api/audio/${newTrack.bucket}/${newTrack.s3Key}`
        console.log(`Audio source set`)
        
        if (isMobile) {
          // For mobile, we'll set isAudioReady to true immediately
          setIsAudioReady(true);
        } else {
          // For desktop, we'll wait for the 'canplay' event
          audioRef.current.load();
        }
      }
      prepareNextTrack(genre)
    } catch (error) {
      console.error('Error preparing random track:', error)
    }
  }

  const prepareNextTrack = async (genre: 'house' | 'lofi') => {
    try {
      const nextTrack = await getRandomTrack(genre)
      setNextTrack(nextTrack)
    } catch (error) {
      console.error('Error preparing next track:', error)
    }
  }

  const playTrack = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true)
        console.log('Audio playback started')
      }).catch(error => {
        console.error('Error playing audio:', error)
      })
    }
  }

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
        console.log('Audio playback paused')
      } else {
        playTrack()
      }
    }
  }

  const playRandomTrack = async () => {
    await prepareRandomTrack(currentGenre)
    playTrack()
    if (isMobile) {
      setHasShuffled(true);
    }
  }

  const toggleGenre = async () => {
    const newGenre = currentGenre === 'house' ? 'lofi' : 'house'
    console.log(`Toggling genre from ${currentGenre} to ${newGenre}`)
    setCurrentGenre(newGenre)

    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      console.log('Current audio paused')
    }

    try {
      await prepareRandomTrack(newGenre)
      console.log(`New track prepared for genre: ${newGenre}`)
      playTrack()
    } catch (error) {
      console.error('Error preparing audio after genre switch:', error)
    }
  }

  useEffect(() => {
    const handleEnded = () => {
      console.log('Track ended, loading next track')
      if (nextTrack) {
        setCurrentTrack(nextTrack)
        if (audioRef.current) {
          setIsAudioReady(false)
          audioRef.current.src = `/api/audio/${nextTrack.bucket}/${nextTrack.s3Key}`
          console.log(`Next audio source set`)
          audioRef.current.play().then(() => {
            setIsPlaying(true)
            console.log('Next track playing')
          }).catch(error => {
            console.error('Error playing next audio:', error)
          })
        }
        prepareNextTrack(currentGenre)
      }
    }

    const handleCanPlay = () => {
      console.log('Audio is ready to play')
      if (!isMobile) {
        setIsAudioReady(true)
      }
    }

    const currentAudioRef = audioRef.current

    if (currentAudioRef) {
      currentAudioRef.addEventListener('ended', handleEnded)
      if (!isMobile) {
        currentAudioRef.addEventListener('canplay', handleCanPlay)
      }
      console.log('Event listeners for ended and canplay added')
    }

    return () => {
      if (currentAudioRef) {
        currentAudioRef.removeEventListener('ended', handleEnded)
        if (!isMobile) {
          currentAudioRef.removeEventListener('canplay', handleCanPlay)
        }
        console.log('Event listeners for ended and canplay removed')
      }
    }
  }, [currentGenre, nextTrack, isMobile, prepareNextTrack])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-gray-900 to-red-900 overflow-hidden">
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-gold-500 to-black opacity-75 rounded-full blur-3xl animate-pulse-slow"></div>
          <Image
            src="https://z-assets.s3.us-west-1.amazonaws.com/AIA/music_streaming_service/Vinyl.png"
            alt="Vinyl Record"
            width={320}
            height={320}
            className="absolute top-0 left-0 w-full h-full animate-spin-slow"
            style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-black bg-opacity-70 rounded-full flex items-center justify-center shadow-2xl">
              <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 bg-gradient-to-br from-red-700 to-gold-500 rounded-full shadow-inner"></div>
            </div>
          </div>
          {/* AIA logo on top of the vinyl with drop shadow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Image
              src="https://z-assets.s3.us-west-1.amazonaws.com/AIA/brand_assets/Vinyl+(7).png"
              alt="AIA Music Logo"
              width={240}
              height={240}
              className="object-contain filter drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] animate-fade-in"
            />
          </div>
        </div>

        <div className="flex items-center space-x-8 mb-12">
          {(!isMobile || (isMobile && hasShuffled)) && (
            <button
              onClick={togglePlayPause}
              disabled={!isAudioReady && !isPlaying}
              className={`bg-gradient-to-r from-red-700 to-gold-500 text-black p-4 rounded-full shadow-lg hover:from-red-800 hover:to-gold-600 transition transform hover:scale-110 ${
                !isAudioReady && !isPlaying ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {(isAudioReady || isPlaying || isMobile) ? (
                isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />
              ) : (
                <span className="text-xs font-semibold">Loading...</span>
              )}
            </button>
          )}
          <button
            onClick={playRandomTrack}
            className="bg-gradient-to-r from-black to-red-900 text-gold-500 p-4 rounded-full shadow-lg hover:from-gray-900 hover:to-red-800 transition transform hover:scale-110"
            aria-label="Play Random Track"
          >
            <FaRandom size={24} />
          </button>
        </div>

        <div className="flex items-center space-x-4 bg-black bg-opacity-50 p-3 rounded-full shadow-xl">
          <span className={`text-sm font-bold ${currentGenre === 'house' ? 'text-red-500' : 'text-gold-500'}`}>House</span>
          <button
            onClick={toggleGenre}
            className="relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none"
            style={{ backgroundColor: currentGenre === 'house' ? '#B91C1C' : '#B7791F' }}
            aria-label="Toggle Genre"
          >
            <span
              className={`inline-block w-4 h-4 transform transition-transform bg-black rounded-full shadow-md ${
                currentGenre === 'house' ? 'translate-x-1' : 'translate-x-7'
              }`}
            />
          </button>
          <span className={`text-sm font-bold ${currentGenre === 'lofi' ? 'text-gold-500' : 'text-red-500'}`}>Lo-Fi</span>
        </div>
      </main>

      <audio 
        ref={audioRef} 
        className="hidden"
        onEnded={() => {}}
      />
    </div>
  )
}

//