'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Info } from 'lucide-react';
import Header from '@/components/Header';
import { artists } from '@/data/artists';

// Filter productive artists and create content categories
const productiveArtists = artists.filter(artist => artist.isProductive);

const categories = [
  {
    title: "Trending Now",
    content: productiveArtists.slice(0, 5).map((artist, index) => ({
      id: index + 1,
      title: `${artist.name} Originals`,
      image: artist.image
    }))
  },
  {
    title: "Popular on INOVA",
    content: productiveArtists.slice(5, 10).map((artist, index) => ({
      id: index + 6,
      title: `${artist.name} Series`,
      image: artist.image
    }))
  },
  {
    title: "Generated For You",
    content: productiveArtists.slice(10, 15).map((artist, index) => ({
      id: index + 11,
      title: `${artist.name} Collection`,
      image: artist.image
    }))
  }
];

export default function Streaming() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const featuredArtist = productiveArtists[0];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-white">
        {/* Hero Section with Fixed Height */}
        <section className="relative h-[800px]"> {/* Fixed height instead of viewport-based */}
          <Image
            src={featuredArtist.image}
            alt={featuredArtist.name}
            fill
            className="object-cover"
            priority
          />
          {/* Simplified gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          {/* Hero Content - Fixed Position */}
          <div className="absolute left-0 right-0 bottom-32 px-8 md:px-16"> {/* Fixed bottom positioning */}
            <div className="max-w-6xl mx-auto space-y-6">
              <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tight leading-none">
                {featuredArtist.name} Presents
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl">
                Experience the world&apos;s first AI-generated entertainment series by{' '}
                <span className="text-white">{featuredArtist.name}</span>, 
                crafted specifically for you using cutting-edge neural networks.
              </p>
            </div>
          </div>
        </section>

        {/* Content Categories - Separate Section */}
        <section className="bg-black pt-16"> {/* Separate section with padding */}
          {categories.map((category, index) => (
            <div key={index} className="mb-16">
              <h2 className="text-2xl font-medium mb-6 px-8 md:px-16">
                {category.title}
              </h2>
              <div className="px-8 md:px-16">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {category.content.map((item) => (
                    <motion.div
                      key={item.id}
                      className="relative aspect-video rounded-md overflow-hidden cursor-pointer"
                      onHoverStart={() => setHoveredItem(item.id)}
                      onHoverEnd={() => setHoveredItem(null)}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      {hoveredItem === item.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center"
                        >
                          <div className="text-center p-4">
                            <h3 className="font-bold mb-2 text-sm md:text-base">
                              {item.title}
                            </h3>
                            <button className="bg-white/90 text-black px-4 py-2 rounded-md text-sm hover:bg-white transition">
                              Play
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </>
  );
} 