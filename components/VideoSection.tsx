"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (!document.fullscreenElement) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-[#08130b] text-white relative overflow-hidden border-y border-gold/15">
      {/* Golden Radial Ambient Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, #C9A227 0%, transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/15 text-gold-light border border-gold/30 text-xs font-bold uppercase tracking-[0.2em] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span>Behind The Scenes Commercial</span>
          </div>

          <h2 className="font-brand text-3xl sm:text-5xl lg:text-6xl font-normal leading-tight mb-4">
            Culinary Grade <br className="hidden sm:inline" />
            <span className="italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-100 to-gold">
              Peeled Garlic in Motion
            </span>
          </h2>

          <p className="text-white/70 max-w-2xl mx-auto text-sm sm:text-base font-light leading-relaxed">
            Watch our farm-fresh peeled garlic cloves ready for professional chefs and home kitchens. Fast-loading, highly optimized streaming.
          </p>
        </motion.div>

        {/* 16:9 Responsive Modern Cinematic Player with Fast-Start Stream */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl sm:rounded-[36px] overflow-hidden border-2 border-gold/40 shadow-2xl bg-black/90 max-w-5xl mx-auto group"
        >
          {/* Responsive 16:9 Aspect Ratio Container */}
          <div className="relative w-full aspect-video">
            <video
              ref={videoRef}
              src="/garlic-commercial-optimized.mp4"
              poster="/product-pack-kitchen.webp"
              preload="metadata"
              playsInline
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Gradient Overlay Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            {/* Floating Top Badge */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs text-white/90">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-[11px] uppercase tracking-wider font-semibold">Organic Gold Garlic Film</span>
            </div>

            {/* Custom Interactive Player Controls */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-center justify-between z-20">
              
              {/* Play / Pause Button */}
              <button
                onClick={togglePlay}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gold/90 hover:bg-gold text-[#08130b] text-xs uppercase tracking-wider font-bold shadow-lg transition-all flex items-center gap-2"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span>Play</span>
                  </>
                )}
              </button>

              {/* Mute / Unmute & Quality Badge */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={toggleMute}
                  className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  )}
                </button>

                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white transition-colors"
                  aria-label="Toggle Fullscreen"
                  title="Fullscreen"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>

                <span className="hidden sm:inline-block text-[11px] uppercase tracking-widest text-gold-light/80 bg-black/60 px-3 py-1.5 rounded-full border border-white/10">
                  Fast-Stream Optimized &bull; 720p HD
                </span>
              </div>
            </div>

          </div>
        </motion.div>

        {/* 3 Value Pillars */}
        <div className="grid sm:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto text-center sm:text-left">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-gold font-brand text-2xl font-bold block mb-1">Pan-India Reach</span>
            <p className="text-xs text-white/70 leading-relaxed font-light">
              Doorstep supply across Bihar, Bengal, Delhi NCR, Mumbai & all major Indian hubs.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-gold/30">
            <span className="text-gold font-brand text-2xl font-bold block mb-1">Chef&apos;s Preference</span>
            <p className="text-xs text-white/70 leading-relaxed font-light">
              Zero water retention or chemical bleaching — delivers authentic pungent aroma.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="text-gold font-brand text-2xl font-bold block mb-1">Time & Cost Saver</span>
            <p className="text-xs text-white/70 leading-relaxed font-light">
              Save up to 40% kitchen preparation labor costs in high-volume food service.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
