'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/parking', label: 'Report parking' },
    { href: '/pollution', label: 'Report pollution' },
    { href: '/rewards', label: 'Rewards' },
    { href: '/admin', label: 'Police dashboard' },
  ];

  return (
    <header className="w-full flex flex-col">
      {/* Marquee Announcement Bar */}
      <div className="bg-[#FCEFD9] border-b border-[#EAD9B0] flex items-center">
        <span className="bg-brass text-white text-[11px] font-bold tracking-[0.4px] uppercase px-4 py-[7px] font-mono shrink-0">
          Announcements
        </span>
        <div className="flex-1 overflow-hidden whitespace-nowrap py-[7px]">
          <div className="inline-block pl-full text-[12.5px] text-brass-dark font-medium animate-marquee">
            Ward-wise cleanliness ranking for June released &nbsp;•&nbsp; No-parking enforcement now live near all metro pillars
          </div>
        </div>
      </div>

      {/* Main Topbar */}
      <div className="sticky top-0 z-50 bg-white border-b border-line">
        <div className="flex items-center justify-between px-6 py-3.5 max-w-[1120px] mx-auto gap-4 flex-wrap">
          
          <Link href="/" className="flex items-center gap-[13px]">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 border-2 border-line-strong p-1.5">
              <span className="text-xl">🏛️</span> {/* Placeholder */}
            </div>
            <div className="flex flex-col">
              <span className="text-ink-soft text-[11px] tracking-[0.4px] mb-[1px]">Government of Uttar Pradesh</span>
              <h1 className="text-ink text-[16px] font-display font-bold tracking-[0.1px] leading-tight">
                Kanpur Municipal Corporation — CivicWatch
              </h1>
            </div>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-[10px]">
            {status === 'authenticated' ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-mono text-river-dark font-bold">Welcome, Citizen</span>
                <button 
                  onClick={() => signOut()} 
                  className="border border-alert text-alert px-[18px] py-[9px] rounded-[2px] text-[13px] font-semibold hover:bg-alert hover:text-white transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/register" className="border border-navy text-navy px-[18px] py-[9px] rounded-[2px] text-[13px] font-semibold hover:bg-paper transition-colors">
                  Sign Up
                </Link>
                <Link href="/login" className="border border-navy bg-navy text-white px-[18px] py-[9px] rounded-[2px] text-[13px] font-semibold hover:bg-navy-deep transition-colors">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real Navigation Strip */}
      <nav className="bg-navy border-t-[3px] border-brass overflow-x-auto">
        <div className="flex max-w-[1120px] mx-auto px-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 flex items-center gap-2 px-5 py-3.5 border-b-[3px] text-[12.5px] font-semibold tracking-[0.4px] uppercase whitespace-nowrap transition-colors ${
                  isActive 
                    ? 'text-white border-brass bg-white/5' 
                    : 'border-transparent text-[#B9C8D8] hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}