'use client';
import React from "react";
import { motion } from "framer-motion";
import Header from '@/components/Header';
import { Factory, Cpu, Rocket } from "lucide-react";
import Image from 'next/image';

export default function TheFactory() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white overflow-hidden pt-20">
        {/* Hero Section */}
        <div className="relative container mx-auto px-4 py-32">
          <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-[50rem] h-[50rem] bg-zinc-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute w-[30rem] h-[30rem] bg-stone-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
          </div>

          {/* Historical Context */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center space-y-8 mb-32"
          >
            <p className="text-2xl text-gray-400 italic">The year is 1969.</p>
            <p className="text-xl text-gray-300 leading-relaxed">
              Andy Warhol incorporated a creative innovation studio in the heart of the Flatiron district, Manhattan.
              It became the white-hot center of the creative universe, ushering in and launching those who defined culture.
              The counter-culture revolution, which permeated global culture for decades to come, frequented it.
            </p>
            <p className="text-xl text-gray-400">He called it:</p>
            <h1 className="text-8xl font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              The Factory
            </h1>
            <p className="text-2xl text-gold-500">And it&apos;s time for an update.</p>
          </motion.div>

          {/* Main Description */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative mb-32"
          >
            <div className="grid md:grid-cols-2 gap-8">
              {/* AI Content Generation Card */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/20 to-stone-500/20 rounded-2xl blur-xl" />
                <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/10 h-full">
                  <Factory className="w-12 h-12 mb-6 text-zinc-400" />
                  <h3 className="text-2xl font-bold text-white/90 mb-4">AI Content Generation</h3>
                  <p className="text-gray-300 leading-relaxed">
                    The Factory harnesses the best AI models to create compelling photos, videos, and music, 
                    seamlessly combining them into exceptional entertainment content.
                  </p>
                </div>
              </motion.div>

              {/* Distribution Engine Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/20 to-stone-500/20 rounded-2xl blur-xl" />
                <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/10 h-full">
                  <Rocket className="w-12 h-12 mb-6 text-zinc-400" />
                  <h3 className="text-2xl font-bold text-white/90 mb-4">Distribution Engine</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Our powerful distribution system connects to multiple YouTube channels, 
                    delivering fresh, original content daily to growing audiences.
                  </p>
                </div>
              </motion.div>

              {/* Processing Power Card */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/20 to-stone-500/20 rounded-2xl blur-xl" />
                <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/10 h-full">
                  <Cpu className="w-12 h-12 mb-6 text-zinc-400" />
                  <h3 className="text-2xl font-bold text-white/90 mb-4">Massive Scale</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Leveraging AWS Fargate, we process content across thousands of parallel instances daily,
                    achieving unprecedented speed and quality.
                  </p>
                </div>
              </motion.div>

              {/* Evolution Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/20 to-stone-500/20 rounded-2xl blur-xl" />
                <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/10 h-full">
                  <Factory className="w-12 h-12 mb-6 text-zinc-400" />
                  <h3 className="text-2xl font-bold text-white/90 mb-4">Continuous Evolution</h3>
                  <p className="text-gray-300 leading-relaxed">
                    As AI technology advances, The Factory evolves. Were the manufacturing hub of 
                    AI entertainment, constantly improving with the latest innovations.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Synths Section */}
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-32"
          >
            <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/20 to-stone-500/20 rounded-2xl blur-xl -z-10" />
              
              {/* Content Grid */}
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Text Content */}
                <div className="space-y-8">
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    Synths
                  </h2>
                  
                  <div className="space-y-6">
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-xl text-gray-300"
                    >
                      Synths are AI agents built from the ground up to be literal entertainment machines.
                    </motion.p>

                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-xl text-gray-300"
                    >
                      They are the product of the Factory that scale across social media and are engineered to be maximially viral and compelling.
                    </motion.p>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="py-6"
                    >
                      <p className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
                        The atomic unit of maximal engagement.
                      </p>
                    </motion.div>

                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="text-xl text-gray-300 italic"
                    >
                      If Data is the new oil, these are the drills.
                    </motion.p>

                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="text-xl text-gray-300"
                    >
                      Synths take commodified model outputs - music, photos, video - and endow them with brands which are positioned 
                      in the market with luxury branding to maximize traction.
                    </motion.p>
                  </div>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-2 gap-6 h-full">
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-6"
                  >
                    <div className="relative h-[400px] rounded-xl overflow-hidden">
                      <Image 
                        src="https://z-assets.s3.us-west-1.amazonaws.com/AIA/channel_photos/panthera.png"
                        alt="Synth Character 1" 
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="relative h-[300px] rounded-xl overflow-hidden">
                      <Image 
                        src="https://z-assets..us-west-1.amazonaws.com/AIA/channel_photos/17kazukinozomi.jpeg"
                        alt="Synth Character 2" 
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-6 pt-12"
                  >
                    <div className="relative h-[300px] rounded-xl overflow-hidden">
                      <Image 
                        src="https://z-assets.s3.us-west-1.amazonaws.com/AIA/channel_photos/25-art-deco-high-fashion.png"
                        alt="Synth Character 3" 
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="relative h-[400px] rounded-xl overflow-hidden">
                      <Image 
                        src="https://z-assets.s3.us-west-1.amazonaws.com/AIA/channel_photos/spellbound.png"
                        alt="Synth Character 4" 
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Vision Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/20 to-stone-500/20 rounded-2xl blur-xl -z-10" />
              <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                The Vision
              </h2>
              
              {/* Business Pillars */}
              <p className="text-xl text-gray-300 mb-8">
                AIA operates across two large pillars of business expansion:
              </p>
              <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/20 to-stone-500/20 rounded-xl blur-xl" />
                  <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/10 relative h-full">
                    <h3 className="text-2xl font-bold text-white/90 mb-4">Premium Entertainment Content</h3>
                    <p className="text-gray-400">Made with cutting-edge AI technology</p>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/20 to-stone-500/20 rounded-xl blur-xl" />
                  <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/10 relative h-full">
                    <h3 className="text-2xl font-bold text-white/90 mb-4">Interactive Fandom</h3>
                    <p className="text-gray-400">Endowing Synths with personalities for maximal fan engagement</p>
                  </div>
                </div>
              </div>

              {/* Fundamentals Section */}
              <div className="space-y-8">
                <h3 className="text-3xl font-bold text-white/90 mb-8">
                  The Fundamentals You Can Invest In
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/20 to-stone-500/20 rounded-xl blur-xl" />
                    <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/10 relative h-full">
                      <h4 className="text-xl font-bold text-white/90 mb-2">Better</h4>
                      <p className="text-gray-400">Premium entertainment and media content that sets new standards</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/20 to-stone-500/20 rounded-xl blur-xl" />
                    <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/10 relative h-full">
                      <h4 className="text-xl font-bold text-white/90 mb-2">More</h4>
                      <p className="text-gray-400">Higher volumes of content generation than ever before possible</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/20 to-stone-500/20 rounded-xl blur-xl" />
                    <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/10 relative h-full">
                      <h4 className="text-xl font-bold text-white/90 mb-2">Convenient</h4>
                      <p className="text-gray-400">Access content on demand - when, where, and how you want it</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/20 to-stone-500/20 rounded-xl blur-xl" />
                    <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/10 relative h-full">
                      <h4 className="text-xl font-bold text-white/90 mb-2">Interactive</h4>
                      <p className="text-gray-400">Custom content and interactive media that adapts to you</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </>
  );
} 