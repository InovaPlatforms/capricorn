'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Pause, Clock, Music, ChevronDown, ChevronLeft } from 'lucide-react';
import { Track } from '@/types/music';
import { artists } from '@/data/artists';
import { musicBuckets } from '@/data/music';
import { useMusic } from '@/contexts/MusicContext';
import PlaybackControls from '@/components/music/PlaybackControls';
import FloatingControls from '@/components/music/FloatingControls';
import { useRouter } from 'next/navigation';

const TRACKS_PER_PAGE = 10;

export default function ArtistPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [displayedTracks, setDisplayedTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const artist = artists.find(a => a.id === params.id);
  const bucket = musicBuckets.find(b => b.name === artist?.name);
  const { currentTrack, isPlaying, playTrack, pauseTrack } = useMusic();
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const fetchArtistTracks = async () => {
      if (!bucket) return;
      setIsLoading(true);
      
      try {
        const response = await fetch(`/api/listFiles/${bucket.id}?prefix=archive/songs/`);
        const files = await response.json();
        
        const trackList = files.map((file: string) => ({
          id: `${bucket.id}-${file}`,
          title: file.replace(/^.*[\\/]/, '').replace(/\.[^/.]+$/, ''),
          artist: artist?.name || '',
          image: artist?.image || '',
          duration: 0,
          s3Key: file,
          bucket: bucket.id
        }));

        setTracks(trackList);
        setDisplayedTracks(trackList.slice(0, TRACKS_PER_PAGE));
      } catch (error) {
        console.error('Error fetching tracks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistTracks();
  }, [params.id, artist, bucket]);

  const loadMoreTracks = () => {
    const nextPage = page + 1;
    const start = 0;
    const end = nextPage * TRACKS_PER_PAGE;
    setDisplayedTracks(tracks.slice(start, end));
    setPage(nextPage);
  };

  const handlePlayPause = (track: Track) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        pauseTrack();
      } else {
        playTrack(track);
      }
    } else {
      playTrack(track);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  if (!artist || !bucket) return null;

  return (
    <>
      <div className="p-8 pb-32"> {/* Added padding bottom for playback controls */}
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft size={20} />
          <span>Back</span>
        </button>

        {/* Artist Header with gradient background */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/50 to-black" />
          <div className="relative flex items-end space-x-6 p-8">
            <Image
              src={artist.image}
              alt={artist.name}
              width={232}
              height={232}
              className="rounded-lg shadow-xl"
            />
            <div>
              <span className="text-sm font-medium">Artist</span>
              <h1 className="text-7xl font-bold mb-6">{artist.name}</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Music className="w-4 h-4" />
                <span>{tracks.length} tracks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 mt-6">
          <button 
            className="bg-green-500 text-black rounded-full p-4 hover:scale-105 transition"
            onClick={() => tracks.length > 0 && playTrack(tracks[0])}
          >
            <Play fill="currentColor" size={24} />
          </button>
          <button className="text-gray-400 hover:text-white transition">
            Follow
          </button>
        </div>

        {/* Tracks List */}
        <div className="mt-8">
          <table className="w-full text-left">
            <thead className="border-b border-white/10">
              <tr className="text-gray-400 text-sm">
                <th className="pb-3 w-12">#</th>
                <th className="pb-3">TITLE</th>
                <th className="pb-3 w-48">ALBUM</th>
                <th className="pb-3 w-48 text-right">
                  <Clock size={16} />
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedTracks.map((track, index) => (
                <motion.tr
                  key={track.id}
                  className="group hover:bg-white/10 cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  onClick={() => handlePlayPause(track)}
                >
                  <td className="py-4 text-gray-400">
                    <div className="flex items-center justify-center w-6 h-6">
                      {currentTrack?.id === track.id ? (
                        isPlaying ? (
                          <Pause size={16} className="text-green-500" />
                        ) : (
                          <Play size={16} className="text-green-500" />
                        )
                      ) : (
                        <span className="group-hover:hidden">{index + 1}</span>
                      )}
                      <Play size={16} className="hidden group-hover:block text-white" />
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={track.image}
                        alt={track.title}
                        width={40}
                        height={40}
                        className="rounded"
                      />
                      <span className={currentTrack?.id === track.id ? 'text-green-500' : ''}>
                        {track.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-gray-400">{artist.name} Collection</td>
                  <td className="py-4 text-gray-400 text-right">3:45</td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* Load More Button */}
          {displayedTracks.length < tracks.length && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={loadMoreTracks}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                <span>Show More</span>
                <ChevronDown size={16} />
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center mt-8">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
      <FloatingControls 
        track={currentTrack}
        isPlaying={isPlaying}
        volume={volume}
        onPlay={playTrack}
        onPause={pauseTrack}
        onVolumeChange={handleVolumeChange}
      />
    </>
  );
} 