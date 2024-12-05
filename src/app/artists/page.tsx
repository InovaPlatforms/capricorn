'use client';
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Header from '@/components/Header';
import { artists } from '@/data/artists';

export default function Artists() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white overflow-hidden pt-20">
        <div className="container mx-auto px-4 py-32">
          <h1 className="text-6xl font-bold text-center mb-16 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Artists
          </h1>

          {/* Productive Artists */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Active Artists
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artists
                .filter(artist => artist.isProductive)
                .map((artist) => (
                  <motion.div
                    key={artist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/20 to-stone-500/20 rounded-xl blur-xl" />
                    <Link href={`/artists/${artist.id}`}>
                      <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/10 relative overflow-hidden">
                        <div className="relative h-64 w-full">
                          <Image
                            src={artist.image}
                            alt={artist.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            priority={true}
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                            {artist.name}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Upcoming Artists */}
          <div>
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Upcoming Artists
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artists
                .filter(artist => !artist.isProductive)
                .map((artist) => (
                  <motion.div
                    key={artist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/20 to-stone-500/20 rounded-xl blur-xl" />
                    <Link href={`/artists/${artist.id}`}>
                      <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/10 relative overflow-hidden">
                        <div className="relative h-64 w-full">
                          <Image
                            src={artist.image}
                            alt={artist.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                            {artist.name}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 
