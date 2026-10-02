'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/users/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        // Extracting error message from Django DRF response
        const errorMessage = errorData.email ? errorData.email[0] : 'Registration failed. Please check your details.';
        throw new Error(errorMessage);
      }

      setSuccess(true);
      // 2 second baad login page par redirect kar denge
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-paper py-12 px-5">
      <div className="max-w-[480px] w-full bg-paper-raised border border-line-strong rounded-[2px] p-8 shadow-card-hover relative overflow-hidden">
        
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-river"></div>

        <div className="text-center mb-7">
          <h2 className="text-[24px] font-bold font-display text-ink mb-1.5">Citizen Registration</h2>
          <p className="text-ink-soft text-[13.5px]">Join CivicWatch to report issues and earn rewards.</p>
        </div>

        {error && (
          <div className="bg-[#FBF1EE] border border-dashed border-alert text-alert-dark text-[13px] p-3 rounded-[2px] mb-5">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-[#E6F4EA] border border-dashed border-river text-river-dark text-[13px] p-3 rounded-[2px] mb-5">
            Account created successfully! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-[12.5px] font-semibold text-ink-soft mb-1.5 uppercase tracking-[0.5px] font-mono">
              Full Name <span className="text-alert">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              required
              value={formData.full_name}
              onChange={handleChange}
              placeholder="e.g. Ramesh Kumar"
              className="w-full p-[9px_10px] border border-line-strong rounded-[2px] bg-white font-body text-[14px] text-ink focus:outline-none focus:border-navy transition-colors"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-semibold text-ink-soft mb-1.5 uppercase tracking-[0.5px] font-mono">
              Email Address <span className="text-alert">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="citizen@example.com"
              className="w-full p-[9px_10px] border border-line-strong rounded-[2px] bg-white font-body text-[14px] text-ink focus:outline-none focus:border-navy transition-colors"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-semibold text-ink-soft mb-1.5 uppercase tracking-[0.5px] font-mono">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
              className="w-full p-[9px_10px] border border-line-strong rounded-[2px] bg-white font-body text-[14px] text-ink focus:outline-none focus:border-navy transition-colors"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-semibold text-ink-soft mb-1.5 uppercase tracking-[0.5px] font-mono">
              Password <span className="text-alert">*</span>
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full p-[9px_10px] border border-line-strong rounded-[2px] bg-white font-body text-[14px] text-ink focus:outline-none focus:border-navy transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full bg-navy text-white px-5 py-2.5 rounded-[2px] text-[14px] font-semibold mt-4 hover:bg-navy-deep disabled:opacity-60 transition-colors"
          >
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-line text-center">
          <p className="text-[13px] text-ink-soft">
            Already have an account?{' '}
            <Link href="/login" className="text-navy font-semibold hover:underline">
              Sign In here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}