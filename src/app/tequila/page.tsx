'use client';
import React from "react";
import Image from "next/image";

export default function TequilaProfile() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="absolute inset-0 flex items-center justify-center -z-10">
          <div className="w-[30rem] h-[30rem] bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute w-[20rem] h-[20rem] bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
        </div>

        {/* Profile Header */}
        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-500 via-red-400 to-purple-500 bg-clip-text text-transparent">
            Tequila&apos;s Exclusive Content
          </h1>
          <p className="text-2xl text-gray-300">
            Dive into my world of exclusive, intimate moments. Subscribe for more.
          </p>
        </div>
      </div>

      {/* Featured Content Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Behind the Scenes",
              type: "Exclusive",
              description: "Get a sneak peek into my private life with intimate photos and videos.",
              image: "https://z-assets.s3.us-west-1.amazonaws.com/AIA/landing_photos/Video.png"
            },
            {
              name: "Spicy Photoshoots",
              type: "Premium",
              description: "Access my hottest photoshoots, available only to subscribers.",
              image: "https://z-assets.s3.us-west-1.amazonaws.com/AIA/landing_photos/Music.png"
            },
            {
              name: "Live Sessions",
              type: "Interactive",
              description: "Join me for live streams where we can connect one-on-one.",
              image: "https://z-assets.s3.us-west-1.amazonaws.com/AIA/landing_photos/Mix.png"
            }
          ].map((content, i) => (
            <div key={i} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl blur-xl" />
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/10 relative h-full">
                <div className="aspect-square relative mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={content.image}
                    alt={content.name}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full transform transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  {content.name}
                </h3>
                <p className="text-pink-400 mb-2">{content.type}</p>
                <p className="text-gray-400">{content.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Videos Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Featured Videos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-11:36:24_seed457097_A%20naked%20gorgeous%20Swedish%20female%20supermodel%20with%20massive%20naked%20boobs%20that%20are%20close%20to%20camera%20that%20ar.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-11:48:10_seed41685_A%20naked%20gorgeous%20Swedish%20female%20supermodel%20with%20massive%20naked%20boobs%20that%20are%20close%20to%20camera,%20gracef.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-11:59:35_seed708306_A%20naked%20gorgeous%20Swedish%20female%20supermodel%20with%20massive%20naked%20boobs%20that%20are%20close%20to%20camera,%20doing%20.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-12:24:05_seed860213_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20massive%20breasts%20that%20are%20close%20to%20camera,%20no%20n.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-12:36:47_seed239819_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20breasts%20that%20are%20close%20to%20camera,%20no%20nud.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-12:48:08_seed118426_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20breasts%20that%20are%20close%20to%20camera,%20no%20nud.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-12:59:55_seed27362_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20breasts%20that%20are%20close%20to%20camera,%20no%20nud.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-13:25:13_seed249185_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-14:33:19_seed271376_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-15:07:20_seed840546_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-16:04:29_seed213112_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-16:50:45_seed40562_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-17:02:05_seed741862_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-17:13:52_seed201412_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-17:25:13_seed480424_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-17:36:35_seed813728_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-17:47:55_seed171142_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-17:59:16_seed838673_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-18:11:04_seed95077_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-18:22:24_seed705892_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-18:33:45_seed116683_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-18:45:33_seed668280_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-18:56:52_seed135997_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-19:08:14_seed792934_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-19:19:34_seed430922_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-19:30:55_seed648756_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-19:42:16_seed561456_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-19:53:37_seed730847_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-20:04:59_seed609062_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-20:28:08_seed696962_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-20:50:50_seed700439_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-21:02:37_seed526728_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-21:14:24_seed796751_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-22:23:22_seed314056_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-22:34:44_seed274040_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4",
            "https://storage.googleapis.com/unassigned-videos/nk/2024-12-05-22:46:05_seed949981_A%20gorgeous%20Swedish%20female%20supermodel%20in%20a%20bikini%20with%20large%20covered%20breasts%20that%20are%20close%20to%20camera.mp4"
          ].map((videoUrl, i) => (
            <div key={i} className="relative group">
              <video
                src={videoUrl}
                controls
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* What to Expect Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="relative bg-gradient-to-r from-pink-500/10 via-red-500/10 to-purple-500/10 rounded-2xl p-8 md:p-16">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            What to Expect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Exclusive Content", desc: "Photos and videos you won't find anywhere else." },
              { title: "Personal Messages", desc: "Chat with me directly and get personal updates." },
              { title: "Live Streams", desc: "Join me for intimate live sessions and Q&As." },
              { title: "Special Requests", desc: "Request custom content tailored just for you." }
            ].map((note, i) => (
              <div key={i} className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-white">{note.title}</h3>
                <p className="text-gray-300">{note.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subscribe Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-red-400 to-purple-500 bg-clip-text text-transparent">
            Subscribe Now
          </h2>
          <p className="text-xl text-gray-300">
            Don't miss out on my exclusive content. Join my subscribers today.
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xl font-bold rounded-full shadow-lg hover:opacity-90 transition">
            Subscribe for $9.99/month
          </button>
        </div>
      </div>
    </main>
  );
} 