'use client';

import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Youtube, Loader, RefreshCw, Users, Eye, Film } from "lucide-react";

interface YoutubeStatsProps {
  artistId: string;
  artistName: string;
}

interface ChannelStats {
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
  lastUpdated: string;
}

export default function YoutubeStats({ artistId, artistName }: YoutubeStatsProps) {
  const [stats, setStats] = useState<ChannelStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchYoutubeStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/youtube-stats?artistId=${artistId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch YouTube stats');
      }

      setStats(data);
    } catch (err: any) {
      console.error('Error fetching YouTube stats:', err);
      setError(err.message || 'Failed to load YouTube statistics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold flex items-center">
          <Youtube size={32} className="mr-3 text-red-500" />
          YouTube Statistics
        </h2>
        <button
          onClick={fetchYoutubeStats}
          disabled={loading}
          className="text-gold-500 hover:text-white transition-colors duration-300 
                   bg-black-800 px-4 py-2 rounded-lg shadow-md flex items-center"
        >
          {loading ? (
            <>
              <Loader className="animate-spin mr-2" size={20} />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <RefreshCw size={20} className="mr-2" />
              <span>Fetch Stats</span>
            </>
          )}
        </button>
      </div>

      {error ? (
        <div className="text-red-400 bg-red-900/20 rounded-lg p-4">
          {error}
        </div>
      ) : stats ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-gold-500" size={24} />
              <h3 className="text-lg text-white/90">Subscribers</h3>
            </div>
            <p className="text-4xl font-bold text-white">
              {parseInt(stats.subscriberCount).toLocaleString()}
            </p>
          </div>
          
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="text-gold-500" size={24} />
              <h3 className="text-lg text-white/90">Total Views</h3>
            </div>
            <p className="text-4xl font-bold text-white">
              {parseInt(stats.viewCount).toLocaleString()}
            </p>
          </div>
          
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Film className="text-gold-500" size={24} />
              <h3 className="text-lg text-white/90">Videos</h3>
            </div>
            <p className="text-4xl font-bold text-white">
              {parseInt(stats.videoCount).toLocaleString()}
            </p>
          </div>

          <div className="col-span-full text-right text-sm text-white/40">
            Last updated: {stats.lastUpdated}
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-12 text-white/60">
          Click &quot;Fetch Stats&quot; to load YouTube statistics
        </div>
      )}
    </div>
  );
}