'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Wand2, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Image from 'next/image';
import { launchECSTask } from "@/utils/aws-services";
import toast from 'react-hot-toast';

export default function MusicVideos() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentPrompts] = useState([
    "A cyberpunk cityscape with neon lights and flying cars",
    "An underwater kingdom with bioluminescent creatures",
    "A steampunk concert hall with mechanical musicians",
    "A space station nightclub with alien DJs"
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    try {
      // Launch the ECS task for music video generation
      const taskArn = await launchECSTask(prompt);

      if (taskArn) {
        toast.success('Music video generation started successfully!');
      } else {
        throw new Error('Failed to start task');
      }
    } catch (error) {
      console.error('Error launching task:', error);
      toast.error('Failed to start music video generation');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white pt-32">
        <div className="max-w-6xl mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <Video size={48} className="text-blue-500" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Music Video Generator
              </h1>
            </motion.div>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Create stunning music videos using AI. Just describe your vision, and we&apos;ll bring it to life.
            </p>
          </div>

          {/* Prompt Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mb-16"
          >
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your music video concept..."
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 size={20} />
                    Generate
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Recent Prompts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-xl font-semibold mb-4">Try these prompts:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentPrompts.map((recentPrompt, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(recentPrompt)}
                  className="text-left p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
                >
                  <p className="text-gray-300">{recentPrompt}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Generated Videos Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-32"
          >
            <h2 className="text-2xl font-bold mb-8">Recent Generations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Example video cards */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/5 rounded-lg overflow-hidden">
                  <div className="relative aspect-video">
                    <Image
                      src={`https://picsum.photos/seed/${i}/800/450`}
                      alt="Generated video thumbnail"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-black p-2 rounded-full transition-colors">
                      <Video size={20} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Generated Video #{i}</h3>
                    <p className="text-sm text-gray-400">A stunning visualization of electronic music...</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
} 