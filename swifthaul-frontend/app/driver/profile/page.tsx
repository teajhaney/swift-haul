'use client';

import { useState } from 'react';
import {
  Phone,
  Mail,
  Truck,
  Star,
  Package,
  TrendingUp,
  Flame,
  LogOut,
  ChevronRight,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { DriverTopbar } from '@/components/driver/driver-topbar';
import { DriverBottomNav } from '@/components/driver/driver-bottom-nav';
import {
  MOCK_DRIVER_PROFILE,
  AVAILABILITY_OPTIONS,
  AVAILABILITY_STYLES,
} from '@/constants/driver-profile-mock';
import type { DriverAvailabilityStatus } from '@/types/driver-pages';

export default function DriverProfilePage() {
  const profile = MOCK_DRIVER_PROFILE;
  const [availability, setAvailability] = useState<DriverAvailabilityStatus>(
    profile.availability
  );

  const activeStyle = AVAILABILITY_STYLES[availability];

  return (
    <>
      <DriverTopbar />

      <div className="max-w-2xl mx-auto px-4 py-6 pb-24 space-y-5">
        {/* ── Profile hero ── */}
        <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mb-3 shadow-md">
            <span className="text-2xl font-bold text-white">
              {profile.initials}
            </span>
          </div>
          <h1 className="text-xl font-bold text-text-primary">
            {profile.name}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-subtle text-primary-light tracking-wide uppercase">
              {profile.role}
            </span>
            <span className="flex items-center gap-0.5 text-sm text-warning font-semibold">
              <Star className="w-3.5 h-3.5 fill-warning" />
              {profile.rating}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Joined {profile.joinedDate}
          </p>

          {/* Availability toggle */}
          <div className="flex gap-2 mt-5 w-full">
            {AVAILABILITY_OPTIONS.map(opt => {
              const isActive = availability === opt.value;
              const style = AVAILABILITY_STYLES[opt.value];
              return (
                <button
                  key={opt.value}
                  onClick={() => setAvailability(opt.value)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    isActive
                      ? style.active
                      : 'border-border bg-surface-elevated text-text-muted hover:border-border-strong'
                  }`}
                >
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? 'bg-white' : style.dot}`}
                  />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-surface rounded-xl border border-border p-4 text-center">
            <div className="w-8 h-8 rounded-lg bg-primary-subtle flex items-center justify-center mx-auto mb-2">
              <Package className="w-4 h-4 text-primary-light" />
            </div>
            <p className="text-2xl font-bold text-text-primary">
              {profile.totalDeliveries}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mt-0.5">
              Total Deliveries
            </p>
          </div>
          <div className="bg-surface rounded-xl border border-border p-4 text-center">
            <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center mx-auto mb-2">
              <Star className="w-4 h-4 text-warning fill-warning" />
            </div>
            <p className="text-2xl font-bold text-text-primary">
              {profile.rating}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mt-0.5">
              Rating
            </p>
          </div>
          <div className="bg-surface rounded-xl border border-border p-4 text-center">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <p className="text-2xl font-bold text-text-primary">
              {profile.onTimeRate}%
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mt-0.5">
              On-time Rate
            </p>
          </div>
          <div className="bg-surface rounded-xl border border-border p-4 text-center">
            <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center mx-auto mb-2">
              <Flame className="w-4 h-4 text-accent" />
            </div>
            <p className="text-2xl font-bold text-text-primary">
              {profile.currentStreak}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mt-0.5">
              Day Streak
            </p>
          </div>
        </div>

        {/* ── Contact info ── */}
        <div className="bg-surface rounded-xl border border-border shadow-sm divide-y divide-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <Phone className="w-4 h-4 text-text-muted shrink-0" />
            <span className="text-sm text-text-secondary flex-1">
              {profile.phone}
            </span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <Mail className="w-4 h-4 text-text-muted shrink-0" />
            <span className="text-sm text-text-secondary flex-1">
              {profile.email}
            </span>
          </div>
        </div>

        {/* ── Vehicle info ── */}
        <div className="bg-surface rounded-xl border border-border shadow-sm p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-3">
            Vehicle
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-text-secondary" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">
                {profile.vehicle}
              </p>
              <p className="text-xs text-text-muted font-mono mt-0.5">
                {profile.licensePlate}
              </p>
            </div>
            <span className="ml-auto px-2 py-0.5 rounded text-[10px] font-bold bg-surface-elevated border border-border text-text-secondary tracking-wide uppercase">
              {profile.vehicleType}
            </span>
          </div>
        </div>

        {/* ── Settings links ── */}
        <div className="bg-surface rounded-xl border border-border shadow-sm divide-y divide-border">
          {[
            { icon: Shield, label: 'Privacy & Security' },
            { icon: HelpCircle, label: 'Help & Support' },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-surface-elevated transition-colors text-left"
            >
              <Icon className="w-4 h-4 text-text-muted shrink-0" />
              <span className="flex-1 text-sm text-text-secondary">
                {label}
              </span>
              <ChevronRight className="w-4 h-4 text-text-muted" />
            </button>
          ))}
        </div>

        {/* ── Sign out ── */}
        <button className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-error/30 text-error text-sm font-semibold hover:bg-error/5 transition-colors">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <DriverBottomNav />
    </>
  );
}
