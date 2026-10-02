'use client';

import React, { useState, useEffect } from 'react';

export default function Footer() {
  const [visitors, setVisitors] = useState(482916);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisitors((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Scheme / Initiative Strip */}
      <div className="bg-white border-y border-line py-6 mt-12">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="text-[11px] font-mono tracking-[0.6px] uppercase text-ink-faint mb-3.5">
            Integrated with / aligned to national digital initiatives
          </div>
          <div className="flex gap-4 flex-wrap items-stretch">
            {/* Replace src with actual logos in public folder */}
            <div className="flex-1 min-w-[200px] max-w-[230px] border border-line rounded-[2px] bg-white flex items-center justify-center p-[14px_18px] shadow-card">
              <span className="text-ink-soft text-sm font-semibold">Digital India</span>
            </div>
            <div className="flex-1 min-w-[200px] max-w-[230px] border border-line rounded-[2px] bg-white flex items-center justify-center p-[14px_18px] shadow-card">
              <span className="text-ink-soft text-sm font-semibold">Swachh Bharat</span>
            </div>
            <div className="flex-1 min-w-[200px] max-w-[230px] border border-line rounded-[2px] bg-white flex items-center justify-center p-[14px_18px] shadow-card">
              <span className="text-ink-soft text-sm font-semibold">Aadhaar eKYC</span>
            </div>
            <div className="flex-1 min-w-[200px] max-w-[230px] border border-line rounded-[2px] bg-white flex items-center justify-center p-[14px_18px] shadow-card">
              <span className="text-ink-soft text-sm font-semibold">NIC Hosted</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-navy-deep text-[#C9D6E3] pb-8">
        <div className="max-w-[1120px] mx-auto px-6 pt-10 grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10">
          <div>
            <h4 className="text-white text-[13px] uppercase tracking-[0.6px] mb-3.5 font-display font-bold">Useful links</h4>
            <ul className="list-none m-0 p-0">
              {['Archives', 'Site Map', 'Help', 'Website Policies', 'Related Links'].map((link) => (
                <li key={link} className="mb-2 flex items-center gap-1.5">
                  <span className="text-brass font-bold">›</span>
                  <a href="#" className="text-[#AFC2D6] text-[13px] hover:text-white hover:underline decoration-[#AFC2D6]">{link}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex justify-between items-center flex-wrap gap-2.5">
              <h4 className="text-white text-[13px] uppercase tracking-[0.6px] font-display font-bold">Subscribe for updates</h4>
              <h4 className="text-white text-[13px] uppercase tracking-[0.6px] font-display font-bold">Last Updated On: 09.07.2026</h4>
            </div>
            <div className="flex gap-2.5 mt-2.5">
              {['FB', 'X', 'YT', 'IN'].map((social) => (
                <a key={social} href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-[12px] font-mono hover:bg-brass transition-colors">
                  {social}
                </a>
              ))}
            </div>
            <p className="mt-5 pt-4 border-t border-white/10 text-[12.5px] text-[#8FA4BA]">
              All rights reserved to <span className="font-semibold text-white">Kanpur Municipal Corporation</span>, Government of Uttar Pradesh
            </p>
          </div>
        </div>

        {/* Legal Strip */}
        <div className="bg-[#051526] border-t border-white/10 mt-8">
          <div className="max-w-[1120px] mx-auto px-6 py-3 flex justify-between flex-wrap gap-2 text-[11px] text-[#8FA4BA] font-mono">
            <span>
              Website Content Owned by Kanpur Municipal Corporation &nbsp;|&nbsp; Designed, Developed & Hosted by National Informatics Centre (NIC)
            </span>
            <span>
              Best viewed in Chrome / Firefox, 1366×768 resolution &nbsp;|&nbsp; Visitors: <span className="text-white">{visitors.toLocaleString('en-IN')}</span>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}