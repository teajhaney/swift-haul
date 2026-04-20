'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Truck, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { TRACKING } from '@/constants/tracking';

export default function TrackingLandingPage() {
  const [token, setToken] = useState('');
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      router.push(`/track/${token.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* ── Navigation ── */}
      <nav className="h-20 bg-surface/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center shadow-lg shadow-primary-light/20">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-primary tracking-tight">
              {TRACKING.BRAND}
            </span>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="text-sm font-semibold text-text-secondary hover:text-primary-light transition-colors"
          >
            Driver Login
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col lg:flex-row">
        {/* ── Left Content (Text + Input) ── */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24">
          <div className="max-w-xl mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-subtle text-primary-light text-xs font-bold tracking-wider uppercase mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-light opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-light"></span>
              </span>
              Real-time Global Tracking
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary leading-[1.1] mb-6 tracking-tight">
              Track your package <br />
              <span className="text-primary-light">wherever it goes.</span>
            </h1>

            <p className="text-lg text-text-secondary mb-10 leading-relaxed">
              Enter your tracking number below to see the real-time status and
              live map location of your delivery.
            </p>

            <form onSubmit={handleTrack} className="relative group">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-text-muted group-focus-within:text-primary-light transition-colors" />
                <input
                  type="text"
                  placeholder="Enter Tracking Number (e.g. SH-8F3X9K2)"
                  value={token}
                  onChange={e => setToken(e.target.value)}
                  className="w-full h-16 sm:h-20 pl-14 pr-40 rounded-2xl bg-surface border-2 border-border text-lg font-medium text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-light focus:ring-4 focus:ring-primary-light/10 transition-all shadow-xl shadow-black/[0.03]"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!token.trim()}
                  className="absolute right-3 top-3 bottom-3 px-8 rounded-xl bg-primary-light hover:bg-primary-hover text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-primary-light/30 active:scale-95"
                >
                  Track
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Feature small points */}
            <div className="mt-12 grid grid-cols-2 gap-8 py-8 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-text-secondary">
                  Secure Tracking
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center text-info">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-text-secondary">
                  Live GPS Updates
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Content (Abstract Map / Image) ── */}
        <div className="hidden lg:flex flex-1 relative bg-primary items-center justify-center overflow-hidden">
          {/* Abstract background layers */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          ></div>

          {/* Mock Map UI for aesthetic */}
          <div className="relative w-4/5 h-[70%] bg-surface rounded-[2.5rem] shadow-2xl overflow-hidden border-[12px] border-primary-light/20 scale-110 lg:scale-100 transition-transform hover:scale-[1.02] duration-700">
            <div
              className="absolute inset-0 grayscale opacity-20"
              style={{
                backgroundImage:
                  "url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/0,0,1,0/1200x800?access_token=none')",
                backgroundSize: 'cover',
              }}
            ></div>

            {/* Route line */}
            <svg className="absolute inset-0 w-full h-full p-20 opacity-40">
              <path
                d="M 100 400 Q 250 150 500 350 T 900 200"
                fill="none"
                stroke="#1A6FB5"
                strokeWidth="8"
                strokeDasharray="20 15"
                strokeLinecap="round"
              />
            </svg>

            {/* Float pins */}
            <div className="absolute top-[35%] left-[25%] animate-bounce duration-[2000ms]">
              <div className="w-12 h-12 rounded-2xl bg-accent border-4 border-white shadow-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="absolute bottom-[25%] right-[20%]">
              <div className="w-10 h-10 rounded-full bg-success border-4 border-white shadow-xl flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
            </div>

            {/* Status card float */}
            <div className="absolute top-10 left-10 right-10 p-6 bg-surface/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-text-muted uppercase tracking-widest">
                  Live Delivery Status
                </span>
                <span className="px-2 py-0.5 rounded bg-success/10 text-success text-[10px] font-bold">
                  ON TIME
                </span>
              </div>
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-primary-light"></div>
              </div>
            </div>
          </div>

          {/* Decorative glows */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-light/30 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-[120px]"></div>
        </div>
      </main>

      <footer className="py-10 px-6 border-t border-border bg-surface">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-bold text-text-muted tracking-widest uppercase">
            © 2026 {TRACKING.BRAND} LOGISTICS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-8">
            <button className="text-xs font-semibold text-text-muted hover:text-primary-light transition-colors">
              Privacy Policy
            </button>
            <button className="text-xs font-semibold text-text-muted hover:text-primary-light transition-colors">
              Terms of Service
            </button>
            <button className="text-xs font-semibold text-text-muted hover:text-primary-light transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
