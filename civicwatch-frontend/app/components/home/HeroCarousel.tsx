'use client';

import React, { useState, useEffect } from 'react';

const slides = [
  {
    headline: '"A cleaner, better-maintained Kanpur — reported by citizens, actioned by the Corporation."',
    sub: 'CivicWatch Citizen Portal · Kanpur Municipal Corporation',
    bg: 'bg-[#123A61]',
  },
  {
    headline: '"See a vehicle in a no-parking zone? Two photos, ten minutes apart, is all it takes."',
    sub: 'Report a No-Parking Violation → instant e-challan on confirmation',
    bg: 'bg-[#0E3357]',
  },
  {
    headline: '"Air, water, or land — report pollution live and the nearest officer is alerted instantly."',
    sub: 'Report Live Pollution → nearest officer notified in real time',
    bg: 'bg-[#0B2A4A]',
  }
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[340px] overflow-hidden bg-navy">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${slide.bg} ${
            index === i ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Abstract background graphics can go here (simplified for Next.js) */}
        </div>
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/90 via-navy-deep/60 to-transparent pointer-events-none"></div>

      <button onClick={() => setIndex((index - 1 + slides.length) % slides.length)} className="absolute top-1/2 left-3.5 -translate-y-1/2 w-[34px] h-[34px] bg-black/35 border border-white/40 text-white flex items-center justify-center z-10 hover:bg-black/55">‹</button>
      <button onClick={() => setIndex((index + 1) % slides.length)} className="absolute top-1/2 right-3.5 -translate-y-1/2 w-[34px] h-[34px] bg-black/35 border border-white/40 text-white flex items-center justify-center z-10 hover:bg-black/55">›</button>

      <div className="absolute right-6 bottom-4 flex gap-1.5 z-10">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full border-none p-0 ${index === i ? 'bg-brass' : 'bg-white/40'}`}></button>
        ))}
      </div>

      <div className="absolute left-0 bottom-0 right-0 max-w-[1120px] mx-auto px-6 pb-8 z-10">
        <nav className="text-[12px] text-[#AFC2D6] font-mono mb-3.5">
          <a href="#" className="hover:text-white hover:underline">Home</a>
        </nav>
        <div className="font-serif italic text-[#EAF1F8] text-[26px] leading-[1.35] max-w-[680px] font-semibold">
          {slides[index].headline}
        </div>
        <div className="text-[#B9C8D8] text-[13px] mt-2.5 max-w-[560px]">
          {slides[index].sub}
        </div>
      </div>
    </div>
  );
}