'use client';
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Folder, Loader, RefreshCw } from "lucide-react";
import Link from "next/link";
import Header from '@/components/Header';
import Image from "next/image";
import { artists } from '@/data/artists';
import { getBucketStats, launchECSTask, getRunningTasks } from "@/utils/aws-services";
import ArtistLaunchInstances from '@/components/ArtistLaunchInstances';
import FargateInstances from '@/components/FargateInstances';
import YoutubeStats from '@/components/YoutubeStats';

interface BucketStats {
  [key: string]: number;
}

const instanceTypes = [
  {
    name: "Audio Mixing",
    taskDefinition: "Audio_Mixing_TaskDef",
    maxInstances: 100,
    schedule: "1:00 AM",
  },
  {
    name: "Video Mix",
    taskDefinition: "Video_Mix_TaskDef",
    maxInstances: 100,
    schedule: "2:00 AM",
  },
  {
    name: "YouTube Upload",
    taskDefinition: "YouTube_Upload_TaskDef",
    maxInstances: 1,
    schedule: "9:10 AM",
  },
];

export default function ArtistPage({ params }: { params: { id: string } }) {
  const artist = artists.find(a => a.id === params.id);
  const [activeTab, setActiveTab] = useState<'stats' | 'instances' | 'running' | 'youtube'>('instances');
  const [bucketStats, setBucketStats] = useState<BucketStats>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBucketStats = async () => {
    if (!artist) return;
    setIsLoading(true);
    setError(null);

    try {
      const stats: BucketStats = {};
      const artistBucket = getBucketNameForArtist(artist.id);
      
      const folders = [
        'process/uploads/',
        'process/mixed_wavs/',
        'archive/av1/',
        'archive/intro_videos/',
        'archive/big_video_no_audio/',
        'process/thumbnails/',
        'archive/songs/',
      ];

      for (const folder of folders) {
        const count = await getBucketStats(folder, artistBucket);
        stats[folder] = count;
      }
      setBucketStats(stats);
    } catch (err) {
      setError('Failed to fetch bucket statistics');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBucketStats();
  }, [artist, fetchBucketStats]);

  useEffect(() => {
    if (activeTab === 'stats') {
      fetchBucketStats();
    }
  }, [activeTab, fetchBucketStats]);

  useEffect(() => {
    if (activeTab === 'stats') {
      fetchBucketStats();

      const interval = setInterval(fetchBucketStats, 30000);

      return () => clearInterval(interval);
    }
  }, [activeTab, fetchBucketStats]);

    function getBucketNameForArtist(artistId: string): string {
      const bucketMap: { [key: string]: string } = {
        'aia': '1-syb-new',
        'lofi': '4-lofi-new',
        'pophouse': '11-pophouse-new',
        'house': '10-house-new',
        'musicmixes': '2-musicmixes-new',
        'disco': '12-disco',
        'steampunk': '5-steampunk',
        'pantheranoir': '6-pantheranoir',
        'synthwave': '9-synthwave',
        'california': '14-california',
        'aqua': '15-aqua',
        'samurai': '16-samurai',
        'kazukinozomi': '17-kazukinozomi',
        'apollo': '18-apollo',
        'hathor': '20-hathor',
        'cybersound-syndicate': '21-cybersound-syndicate',
        'art-deco-high-fashion': '25-art-deco-high-fashion',
        '1920-': '27-1920-',
      };
      return bucketMap[artistId] || '';
    }

  const handleLaunchInstance = async (taskDefinition: string) => {
    try {
      await launchECSTask(
        taskDefinition,
        process.env.NEXT_PUBLIC_AWS_ECS_CLUSTER!
      );
      // Optionally refresh the task list or show success message
    } catch (err) {
      console.error('Failed to launch instance:', err);
      // Show error message to user
    }
  };

  if (!artist) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white overflow-hidden pt-20">
          <div className="container mx-auto px-4 py-32">
            <h1 className="text-4xl font-bold text-center">Artist not found</h1>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white overflow-hidden">
        <div className="container mx-auto px-4 pt-24 pb-16 md:py-32">
          <Link 
            href="/artists"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8 md:mb-12 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            <span className="text-sm md:text-base">Back to Artists</span>
          </Link>

          <div className="flex flex-col items-center text-center md:flex-row md:text-left md:items-start gap-6 md:gap-8 mb-12">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden ring-2 ring-white/10 shadow-xl">
              <Image
                src={artist.image}
                alt={artist.name}
                fill
                sizes="(max-width: 768px) 8rem, 10rem"
                priority={true}
                className="object-cover"
              />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                {artist.name}
              </h1>
              <p className="text-base md:text-lg text-gray-400">
                {artist.isProductive ? 'Active Artist' : 'Upcoming Artist'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8 md:mb-12">
            {[
              { key: 'instances', label: 'Launch Instances' },
              { key: 'stats', label: 'Statistics' },
              { key: 'running', label: 'Running Instances' },
              { key: 'youtube', label: 'YouTube Stats' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'stats' | 'instances' | 'running' | 'youtube')}
                className={`
                  flex items-center gap-2
                  px-4 py-2.5 rounded-full 
                  text-sm font-medium
                  transition-all duration-200 ease-in-out
                  ${activeTab === tab.key 
                    ? "bg-white/15 text-white shadow-lg shadow-white/5 scale-105 backdrop-blur-xl" 
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white backdrop-blur-sm"}
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'stats' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Statistics</h2>
                <button
                  onClick={fetchBucketStats}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 
                             transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                  <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
                </button>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mb-4"
                  >
                    <Loader size={32} className="text-white/80" />
                  </motion.div>
                  <p className="text-white/60 text-sm md:text-base">Loading statistics...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 px-4">
                  <p className="text-red-400 text-sm md:text-base bg-red-500/10 py-3 px-4 rounded-lg inline-block">
                    {error}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {Object.entries(bucketStats).map(([bucket, count], index) => (
                    <motion.div
                      key={bucket}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="group relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/10 to-stone-500/10 rounded-xl blur-xl transform group-hover:scale-105 transition-transform duration-300" />
                      <div className="bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-xl rounded-xl p-5 md:p-6 border border-white/10 relative transition-colors duration-300">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-lg bg-white/5">
                            <Folder className="text-white/80 h-4 w-4 md:h-5 md:w-5" />
                          </div>
                          <h3 className="text-base md:text-lg font-medium text-white/90 truncate">
                            {bucket.replace('process/', '').replace('archive/', '')}
                          </h3>
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-white/90 mb-1">
                          {count.toLocaleString()}
                        </p>
                        <p className="text-xs md:text-sm text-white/50">Total Files</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'instances' ? (
            <ArtistLaunchInstances 
              artistId={artist.id}
              artistName={artist.name}
              bucketName={getBucketNameForArtist(artist.id)}
            />
          ) : activeTab === 'running' ? (
            <FargateInstances 
              artistId={artist.id}
              bucketName={getBucketNameForArtist(artist.id)}
            />
          ) : activeTab === 'youtube' ? (
            <YoutubeStats 
              artistId={getBucketNameForArtist(artist.id)}
              artistName={artist.name}
            />
          ) : null}
        </div>
      </main>
    </>
  );
} 