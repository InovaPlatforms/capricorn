import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative container mx-auto px-4 py-40">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="absolute inset-0 flex items-center justify-center -z-10">
          <div className="w-[50rem] h-[50rem] bg-zinc-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute w-[30rem] h-[30rem] bg-stone-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
        </div>
        
        <div className="flex flex-col items-center text-center space-y-12 relative">
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-violet-500/30 via-blue-500/30 to-indigo-500/30" />
            <h1 className="text-9xl font-bold bg-gradient-to-r from-white via-blue-200 to-violet-400 bg-clip-text text-transparent relative">
              INOVA
            </h1>
          </div>
          <p className="text-3xl text-gray-300 max-w-3xl leading-relaxed font-light">
            The world&apos;s first AI-powered streaming platform, delivering endless premium entertainment 
            through advanced generative AI technology
          </p>
        </div>
      </div>

      {/* Photos Section - with visual headers */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col gap-24 max-w-6xl mx-auto">
          {[
            {
              title: "Video Streaming",
              image: "https://z-assets.s3.us-west-1.amazonaws.com/AIA/landing_photos/Video.png",
              alt: "Video streaming illustration",
              width: 1920,
              height: 1080
            },
            {
              title: "Music Streaming",
              image: "https://z-assets.s3.us-west-1.amazonaws.com/AIA/landing_photos/Music.png",
              alt: "Music streaming illustration",
              width: 1920,
              height: 1080
            },
            {
              title: "Infinite Mixed Music",
              image: "https://z-assets.s3.us-west-1.amazonaws.com/AIA/landing_photos/Mix.png",
              alt: "Mixed music illustration",
              width: 1920,
              height: 1080
            }
          ].map((item, i) => (
            <div key={i} className="relative">
              <div className="text-center mb-12">
                <h2 className="text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-violet-400 bg-clip-text text-transparent relative">
                  {item.title}
                </h2>
                <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-violet-500/30 via-blue-500/30 to-indigo-500/30 -z-10" />
              </div>
              <div className="relative overflow-hidden rounded-md">
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  className="w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Entertainment Unleashed - added here */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-violet-400 bg-clip-text text-transparent">
            AI Entertainment Unleashed
          </h2>
          <p className="text-2xl text-gray-300 leading-relaxed">
            Welcome to the future of streaming. INOVA brings you an ever-growing library of 
            AI-generated entertainment. Discover movies, shows, and music created by advanced AI, 
            curated for quality, and delivered through a seamless streaming experience.
          </p>
        </div>
      </div>

      {/* Core Technology Section */}
      <div className="container mx-auto px-4 py-32">
        <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
          Core Technology
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            {
              title: "AI Content Library",
              desc: "Vast collection of AI-generated movies, shows, and music, continuously expanding",
              gradient: "from-violet-500/20 via-blue-500/20 to-indigo-500/20"
            },
            {
              title: "Smart Curation",
              desc: "Advanced algorithms that match you with content you'll love",
              gradient: "from-blue-500/20 via-indigo-500/20 to-violet-500/20"
            },
            {
              title: "Premium Quality",
              desc: "High-quality AI-generated content vetted for exceptional viewing experience",
              gradient: "from-indigo-500/20 via-violet-500/20 to-blue-500/20"
            },
            {
              title: "Smart Discovery",
              desc: "Intelligent content recommendations based on your preferences",
              gradient: "from-violet-500/20 via-blue-500/20 to-indigo-500/20"
            }
          ].map((value, i) => (
            <div key={i} className="relative group h-[300px]">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/50 to-stone-900/50 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br opacity-50 rounded-xl">
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} blur-2xl`} />
                </div>
                <div className="absolute inset-0 bg-grid-white/[0.02]" />
                <div className="relative h-full flex flex-col justify-center p-8">
                  <div className="absolute top-0 right-0 w-32 h-32">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rotate-45 transform origin-top-left" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    {value.title}
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Capabilities Section - now comes after photos */}
      <div className="container mx-auto px-4 py-32">
        <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
          System Capabilities
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "🎬",
              title: "AI Movies & Shows",
              desc: "Curated selection of AI-generated films and series",
              gradient: "from-violet-500/20 to-blue-600/20"
            },
            {
              icon: "🎵",
              title: "AI Music",
              desc: "Extensive library of AI-composed music across all genres",
              gradient: "from-blue-500/20 to-indigo-600/20"
            },
            {
              icon: "📝",
              title: "Content Library",
              desc: "Growing collection of AI-created entertainment",
              gradient: "from-indigo-500/20 to-violet-600/20"
            },
            {
              icon: "🎭",
              title: "Genre Variety",
              desc: "Diverse selection spanning all popular categories",
              gradient: "from-violet-600/20 to-blue-500/20"
            },
            {
              icon: "🎨",
              title: "Quality Control",
              desc: "Carefully curated AI content meeting high standards",
              gradient: "from-blue-600/20 to-indigo-500/20"
            },
            {
              icon: "🔄",
              title: "Regular Updates",
              desc: "New AI-generated content added to library regularly",
              gradient: "from-indigo-600/20 to-violet-500/20"
            }
          ].map((feature, i) => (
            <div key={i} className="relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-xl blur-xl`} />
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-8 border border-white/10 relative h-full">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Modified Process Section */}
      <div className="container mx-auto px-4 py-32">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-500/10 via-stone-500/10 to-neutral-500/10 rounded-2xl blur-2xl" />
          <div className="relative bg-white/[0.02] backdrop-blur-xl rounded-2xl p-16 border border-white/10">
            <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Our Process
            </h2>
            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                { 
                  number: "01", 
                  title: "Script Generation", 
                  desc: "Create compelling narratives." 
                },
                { 
                  number: "02", 
                  title: "Visual Creation", 
                  desc: "Generate stunning visuals." 
                },
                { 
                  number: "03", 
                  title: "Music Composition", 
                  desc: "Craft original soundtracks." 
                },
                { 
                  number: "04", 
                  title: "Final Assembly", 
                  desc: "Blend elements seamlessly." 
                }
              ].map((step, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl font-bold text-zinc-600 mb-4">{step.number}</div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


