'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { musicBuckets } from '@/data/music';

export default function PlaylistsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Your Playlists</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {musicBuckets.map((bucket) => (
          <Link href={`/music/playlists/${bucket.id}`} key={bucket.id}>
            <motion.div
              className="bg-zinc-900/50 p-4 rounded-md hover:bg-zinc-800/50 transition-colors group cursor-pointer"
              whileHover={{ y: -4 }}
            >
              <div className="relative aspect-square mb-4 rounded-md overflow-hidden">
                <Image
                  src={bucket.image}
                  alt={bucket.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-semibold mb-1">{bucket.name} Mix</h3>
              <p className="text-sm text-gray-400">By INOVA</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
} 
