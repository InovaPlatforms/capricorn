import Image from "next/image";
import Link from "next/link";

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
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-pink-500/30 via-red-500/30 to-purple-500/30" />
            <h1 className="text-9xl font-bold bg-gradient-to-r from-white via-pink-200 to-purple-400 bg-clip-text text-transparent relative">
              Unlock Your Fantasy
            </h1>
          </div>
          <p className="text-3xl text-gray-300 max-w-3xl leading-relaxed font-light">
            Dive into a world of exclusive content, intimate connections, and premium experiences. 
            Join now to explore what you&apos;ve been missing.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl font-bold rounded-full shadow-lg hover:opacity-90 transition">
              Sign Up & Explore
            </button>
            <Link href="/tequila" className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold rounded-full shadow-lg hover:opacity-90 transition">
              View Tequila
            </Link>
          </div>
        </div>
      </div>

      {/* Photos Section - with visual headers */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col gap-24 max-w-6xl mx-auto">
          {[
            {
              title: "Exclusive Videos",
              image: "https://z-assets.s3.us-west-1.amazonaws.com/AIA/landing_photos/Video.png",
              alt: "Video streaming illustration",
              width: 1920,
              height: 1080
            },
            {
              title: "Private Sessions",
              image: "https://z-assets.s3.us-west-1.amazonaws.com/AIA/landing_photos/Music.png",
              alt: "Music streaming illustration",
              width: 1920,
              height: 1080
            },
            {
              title: "Intimate Moments",
              image: "https://z-assets.s3.us-west-1.amazonaws.com/AIA/landing_photos/Mix.png",
              alt: "Mixed music illustration",
              width: 1920,
              height: 1080
            }
          ].map((item, i) => (
            <div key={i} className="relative">
              <div className="text-center mb-12">
                <h2 className="text-6xl font-bold bg-gradient-to-r from-white via-pink-200 to-purple-400 bg-clip-text text-transparent relative">
                  {item.title}
                </h2>
                <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-pink-500/30 via-red-500/30 to-purple-500/30 -z-10" />
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

      {/* Why Join Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-6xl font-bold bg-gradient-to-r from-white via-pink-200 to-purple-400 bg-clip-text text-transparent">
            Why Join Us?
          </h2>
          <p className="text-2xl text-gray-300 leading-relaxed">
            Unlock exclusive content, connect with your favorite creators, and experience premium entertainment like never before. 
            Here’s what you’ll get:
          </p>
          <ul className="text-xl text-gray-300 space-y-4">
            <li>🎥 Full-length videos and behind-the-scenes content</li>
            <li>💬 Direct messaging with creators</li>
            <li>🔒 Private and secure access to premium content</li>
            <li>🎶 Exclusive music and intimate moments</li>
          </ul>
        </div>
      </div>

      {/* Core Features Section */}
      <div className="container mx-auto px-4 py-32">
        <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent">
          Core Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            {
              title: "Exclusive Content",
              desc: "Access premium videos, photos, and music from your favorite creators.",
              gradient: "from-pink-500/20 via-red-500/20 to-purple-500/20"
            },
            {
              title: "Direct Messaging",
              desc: "Chat directly with creators and build real connections.",
              gradient: "from-red-500/20 via-purple-500/20 to-pink-500/20"
            },
            {
              title: "Private Access",
              desc: "Enjoy secure, private access to exclusive content.",
              gradient: "from-purple-500/20 via-pink-500/20 to-red-500/20"
            },
            {
              title: "Flexible Subscriptions",
              desc: "Choose a subscription plan that works for you.",
              gradient: "from-pink-500/20 via-red-500/20 to-purple-500/20"
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

      {/* Call to Action Section */}
      <div className="container mx-auto px-4 py-32">
        <div className="relative bg-gradient-to-r from-pink-500 via-red-500 to-purple-500 rounded-2xl p-16 text-center shadow-lg">
          <h2 className="text-6xl font-bold text-white mb-8">
            Ready to Unlock the Experience?
          </h2>
          <p className="text-2xl text-white/80 mb-12">
            Don’t miss out on exclusive content, full videos, and intimate connections. 
            Join now and start exploring.
          </p>
          <button className="px-12 py-4 bg-white text-pink-500 text-2xl font-bold rounded-full shadow-lg hover:opacity-90 transition">
            Sign Up Now
          </button>
        </div>
      </div>
    </main>
  );
}


