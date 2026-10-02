'use client';

import React, { useState, useEffect } from 'react';

export default function StatTicker() {
  const [openReports, setOpenReports] = useState(14);
  const [aqi, setAqi] = useState(162);

  // Simulated live updates
  useEffect(() => {
    const timer = setInterval(() => {
      setOpenReports((prev) => Math.max(6, prev + (Math.random() > 0.5 ? 1 : -1)));
      setAqi((prev) => Math.max(90, prev + Math.round((Math.random() - 0.5) * 6)));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-paper-raised border-b border-line">
      <div className="max-w-[1120px] mx-auto px-6 py-3.5 grid grid-cols-2 md:grid-cols-4 gap-3.5 md:gap-0">
        
        <div className="md:px-5 md:border-l-0 border-line flex flex-col">
          <div className="text-[10px] font-mono tracking-[0.6px] uppercase text-ink-faint">Open reports today</div>
          <div className="font-mono text-[24px] font-medium text-ink mt-0.5 tracking-[1px] flex items-center">
            {openReports}
            <span className="w-1.5 h-1.5 rounded-full bg-river ml-2 animate-pulse"></span>
          </div>
        </div>

        <div className="md:px-5 md:border-l border-line flex flex-col">
          <div className="text-[10px] font-mono tracking-[0.6px] uppercase text-ink-faint">Challans issued today</div>
          <div className="font-mono text-[24px] font-medium text-ink mt-0.5 tracking-[1px]">6</div>
        </div>

        <div className="md:px-5 md:border-l border-line flex flex-col">
          <div className="text-[10px] font-mono tracking-[0.6px] uppercase text-ink-faint">Road km cleaned this week</div>
          <div className="font-mono text-[24px] font-medium text-ink mt-0.5 tracking-[1px]">38.4</div>
        </div>

        <div className="md:px-5 md:border-l border-line flex flex-col">
          <div className="text-[10px] font-mono tracking-[0.6px] uppercase text-ink-faint">Kanpur AQI (avg)</div>
          <div className="font-mono text-[24px] font-medium text-ink mt-0.5 tracking-[1px]">{aqi}</div>
        </div>

      </div>
    </div>
  );
}