'use client';

import { useState } from 'react';
import { X, Search, Check } from 'lucide-react';
import { ORDER_DETAIL } from '@/constants/order-detail';
import { MOCK_DRIVERS } from '@/constants/order-detail-mock';
import type { Driver } from '@/types/order-detail';

interface AssignDriverModalProps {
  currentDriverId: string | null;
  onConfirm: (driver: Driver) => void;
  onClose: () => void;
}

export function AssignDriverModal({ currentDriverId, onConfirm, onClose }: AssignDriverModalProps) {
  const [search, setSearch]         = useState('');
  const [selected, setSelected]     = useState<Driver | null>(null);

  const filtered = MOCK_DRIVERS.filter((d) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return d.name.toLowerCase().includes(q) || d.vehicle.toLowerCase().includes(q);
  });

  function handleConfirm() {
    if (selected) {
      onConfirm(selected);
      onClose();
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ORDER_DETAIL.MODAL_TITLE}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-surface rounded-xl shadow-2xl w-full max-w-md flex flex-col max-h-[85vh]">

          {/* Header */}
          <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-border shrink-0">
            <div>
              <h2 className="text-base font-semibold text-text-primary">{ORDER_DETAIL.MODAL_TITLE}</h2>
              <p className="text-xs text-text-secondary mt-0.5">{ORDER_DETAIL.MODAL_SUBTITLE}</p>
            </div>
            <button
              onClick={onClose}
              className="icon-btn -mr-1 -mt-1"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="px-5 py-3 border-b border-border shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={ORDER_DETAIL.MODAL_SEARCH}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-surface-elevated text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-light/20 focus:border-primary-light transition-colors"
                autoFocus
              />
            </div>
          </div>

          {/* Driver list */}
          <div className="overflow-y-auto flex-1 px-3 py-2">
            {filtered.length === 0 ? (
              <p className="text-sm text-text-secondary text-center py-8">{ORDER_DETAIL.MODAL_NO_RESULTS}</p>
            ) : (
              <ul className="space-y-1">
                {filtered.map((driver) => {
                  const isCurrent  = driver.id === currentDriverId;
                  const isSelected = selected?.id === driver.id;

                  return (
                    <li key={driver.id}>
                      <button
                        onClick={() => setSelected(isSelected ? null : driver)}
                        disabled={!driver.isAvailable && !isCurrent}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                          isSelected
                            ? 'bg-primary-subtle border border-primary-light/30'
                            : 'hover:bg-surface-elevated'
                        }`}
                      >
                        {/* Avatar */}
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                          isSelected ? 'bg-primary-light text-white' : 'bg-surface-elevated text-text-secondary'
                        }`}>
                          {driver.avatarInitials}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-text-primary truncate">{driver.name}</p>
                            {isCurrent && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold shrink-0">Current</span>
                            )}
                          </div>
                          <p className="text-xs text-text-secondary truncate">{driver.vehicle}</p>
                        </div>

                        {/* Availability badge + check */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`flex items-center gap-1 text-[10px] font-semibold ${
                            driver.isAvailable ? 'text-success' : 'text-text-muted'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${driver.isAvailable ? 'bg-success' : 'bg-border-strong'}`} />
                            {driver.isAvailable ? ORDER_DETAIL.MODAL_AVAILABLE : ORDER_DETAIL.MODAL_BUSY}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-primary-light" />}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-border flex items-center justify-between gap-3 shrink-0">
            <p className="text-xs text-text-muted">
              {selected ? `Selected: ${selected.name}` : ORDER_DETAIL.MODAL_NONE_SELECTED}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-surface-elevated transition-colors"
              >
                {ORDER_DETAIL.MODAL_CANCEL}
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selected}
                className="px-4 py-2 rounded-lg bg-primary-light hover:bg-primary-hover text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {ORDER_DETAIL.MODAL_CONFIRM}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
