'use client';
import Header from '@/components/Header';
import { MusicProvider } from '@/contexts/MusicContext';

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MusicProvider>
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
        <Header />
        <main className="pt-16">
          {children}
        </main>
      </div>
    </MusicProvider>
  );
} 
