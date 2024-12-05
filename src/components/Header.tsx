'use client';
import Link from 'next/link';
import { Music, BarChart2, Users, TrendingUp, Factory, PlayCircle, Video, Tv, Headphones } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            INOVA
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/streaming" className="text-sm text-gray-300 hover:text-white transition">
              <div className="flex items-center gap-2">
                <Tv size={20} />
                <span>Streaming</span>
              </div>
            </Link>
            <Link href="/music" className="text-sm text-gray-300 hover:text-white transition">
              <div className="flex items-center gap-2">
                <Headphones size={20} />
                <span>Music</span>
              </div>
            </Link>
            <Link href="/music-videos" className="text-sm text-gray-300 hover:text-white transition">
              <div className="flex items-center gap-2">
                <Video size={20} />
                <span>Music Videos</span>
              </div>
            </Link>
            <Link
              href="/artists"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <Users size={20} />
              <span className="hidden sm:inline">Artists</span>
            </Link>

            <Link
              href="/mix-infinite"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <Music size={20} />
              <span className="hidden sm:inline">Mix Infinite</span>
            </Link>

            <Link
              href="/stats"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <BarChart2 size={20} />
              <span className="hidden sm:inline">Monthly Stats</span>
            </Link>

            <Link
              href="/weekly-stats"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <TrendingUp size={20} />
              <span className="hidden sm:inline">Weekly Stats</span>
            </Link>

            <Link
              href="/thefactory"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <Factory size={20} />
              <span className="hidden sm:inline">The Factory</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 
