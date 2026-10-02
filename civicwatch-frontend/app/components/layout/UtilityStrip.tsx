'use client';

import React from 'react';

export default function UtilityStrip() {
  const adjustFontSize = (dir: number) => {
    // Basic logic for font-size adjustment (can be expanded later)
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      let currentSize = parseFloat(window.getComputedStyle(root).fontSize);
      if (dir === 0) currentSize = 14.5;
      else currentSize = Math.max(12, Math.min(20, currentSize + dir * 1.2));
      root.style.fontSize = `${currentSize}px`;
    }
  };

  const toggleContrast = () => {
    if (typeof window !== 'undefined') {
      document.body.classList.toggle('high-contrast');
    }
  };

  return (
    <div className="bg-navy-deep text-[#C9D6E3] text-[11.5px] px-6 py-1.5 flex justify-end gap-[18px] font-mono">
      <a href="#main-content" className="hover:text-white hover:underline transition-colors">Skip to Main Content</a>
      <a href="#" title="Screen Reader Access" className="hover:text-white hover:underline transition-colors">Screen Reader Access</a>
      
      <span className="flex gap-[2px] border-x border-[#2E4A64] px-3 items-center">
        <button type="button" title="Decrease text size" onClick={() => adjustFontSize(-1)} className="hover:text-white hover:underline px-1">A-</button>
        <button type="button" title="Default text size" onClick={() => adjustFontSize(0)} className="hover:text-white hover:underline px-1">A</button>
        <button type="button" title="Increase text size" onClick={() => adjustFontSize(1)} className="hover:text-white hover:underline px-1">A+</button>
      </span>
      
      <button onClick={toggleContrast} title="Toggle high contrast" className="hover:text-white hover:underline transition-colors">High Contrast</button>
      <a href="#" className="hover:text-white hover:underline transition-colors">Sitemap</a>
      <a href="#" className="hover:text-white hover:underline transition-colors">हिंदी में देखें</a>
    </div>
  );
}