'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // NextAuth ka signIn method call kar rahe hain
    const res = await signIn('credentials', {
      redirect: false, // Page auto-reload rokne ke liye
      email,
      password,
    });

    if (res?.error) {
      setError('Invalid email or password. Please try again.');
      setIsLoading(false);
    } else {
      // Login successful hone par home ya dashboard par redirect
      router.push('/');
      router.refresh(); // Session state update karne ke liye
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-paper py-12 px-5">
      <div className="max-w-[420px] w-full bg-paper-raised border border-line-strong rounded-[2px] p-8 shadow-card-hover relative overflow-hidden">
        
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-brass"></div>

        <div className="text-center mb-7">
          <h2 className="text-[24px] font-bold font-display text-ink mb-1.5">Citizen Sign In</h2>
          <p className="text-ink-soft text-[13.5px]">Access your CivicWatch rewards wallet and report history.</p>
        </div>

        {error && (
          <div className="bg-[#FBF1EE] border border-dashed border-alert text-alert-dark text-[13px] p-3 rounded-[2px] mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[12.5px] font-semibold text-ink-soft mb-1.5 uppercase tracking-[0.5px] font-mono">
              Email Address <span className="text-alert">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="citizen@example.com"
              className="w-full p-[9px_10px] border border-line-strong rounded-[2px] bg-white font-body text-[14px] text-ink focus:outline-none focus:border-navy transition-colors"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-semibold text-ink-soft mb-1.5 uppercase tracking-[0.5px] font-mono">
              Password <span className="text-alert">*</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-[9px_10px] border border-line-strong rounded-[2px] bg-white font-body text-[14px] text-ink focus:outline-none focus:border-navy transition-colors"
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center gap-2 text-[12.5px] text-ink-soft cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 accent-navy" />
              Remember me
            </label>
            <a href="#" className="text-[12.5px] text-navy font-semibold hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-navy text-white px-5 py-2.5 rounded-[2px] text-[14px] font-semibold mt-4 hover:bg-navy-deep disabled:opacity-60 transition-colors"
          >
            {isLoading ? 'Authenticating...' : 'Secure Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-line text-center">
          <p className="text-[13px] text-ink-soft">
            Don't have an account?{' '}
            <Link href="/register" className="text-navy font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}