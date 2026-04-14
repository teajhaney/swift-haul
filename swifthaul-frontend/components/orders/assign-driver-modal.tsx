'use client';

import { useState } from 'react';
import { X, Search, Check, Loader2 } from 'lucide-react';
import { ORDER_DETAIL } from '@/constants/order-detail';
import { useDrivers } from '@/hooks/drivers/use-drivers';
import { useAssignDriver } from '@/hooks/orders/use-assign-driver';
import type { ApiDriverListItem } from '@/types/driver';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(p => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface AssignDriverModalProps {
  referenceId: string;
  currentDriverId: string | null;
  onSuccess: () => void;
  onClose: () => void;
}

export function AssignDriverModal({
  referenceId,
  currentDriverId,
  onSuccess,
  onClose,
}: AssignDriverModalProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ApiDriverListItem | null>(null);

  const { data, isLoading } = useDrivers({ limit: 50 });
  const assign = useAssignDriver();

  const drivers = data?.data ?? [];

  const filtered = drivers.filter(d => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      (d.vehicleType?.toLowerCase().includes(q) ?? false)
    );
  });

  function handleConfirm() {
    if (!selected) return;
    assign.mutate(
      { referenceId, driverId: selected.id },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
      },
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ORDER_DETAIL.MODAL_TITLE}
      className="modal-backdrop"
      onClick={onClose}
    >
      <div className="modal-panel max-w-md" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="text-base font-semibold text-text-primary">{ORDER_DETAIL.MODAL_TITLE}</h2>
            <p className="text-xs text-text-secondary mt-0.5">{ORDER_DETAIL.MODAL_SUBTITLE}</p>
          </div>
          <button onClick={onClose} className="icon-btn -mr-1 -mt-1" aria-label="Close modal">
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
              onChange={e => setSearch(e.target.value)}
              placeholder={ORDER_DETAIL.MODAL_SEARCH}
              className="form-input pl-9 bg-surface-elevated"
              autoFocus
            />
          </div>
        </div>

        {/* Driver list */}
        <div className="modal-body">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-text-muted" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-8">{ORDER_DETAIL.MODAL_NO_RESULTS}</p>
          ) : (
            <ul className="space-y-1">
              {filtered.map(driver => {
                const isCurrent = driver.id === currentDriverId;
                const isSelected = selected?.id === driver.id;
                const isUnavailable = driver.availability === 'OFFLINE' && !isCurrent;
                const vehicleLabel = driver.vehicleType
                  ? `${driver.vehicleType}${driver.vehiclePlate ? ` · ${driver.vehiclePlate}` : ''}`
                  : 'No vehicle';

                return (
                  <li key={driver.id}>
                    <button
                      onClick={() => setSelected(isSelected ? null : driver)}
                      disabled={isUnavailable}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                        isSelected ? 'bg-primary-subtle border border-primary-light/30' : 'hover:bg-surface-elevated'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        isSelected ? 'bg-primary-light text-white' : 'bg-surface-elevated text-text-secondary'
                      }`}>
                        {getInitials(driver.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-text-primary truncate">{driver.name}</p>
                          {isCurrent && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold shrink-0">Current</span>
                          )}
                        </div>
                        <p className="text-xs text-text-secondary truncate">{vehicleLabel}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`flex items-center gap-1 text-[10px] font-semibold ${driver.availability === 'AVAILABLE' ? 'text-success' : 'text-text-muted'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${driver.availability === 'AVAILABLE' ? 'bg-success' : 'bg-border-strong'}`} />
                          {driver.availability === 'AVAILABLE' ? ORDER_DETAIL.MODAL_AVAILABLE : ORDER_DETAIL.MODAL_BUSY}
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
        <div className="modal-footer justify-between">
          <p className="text-xs text-text-muted">
            {selected ? `Selected: ${selected.name}` : ORDER_DETAIL.MODAL_NONE_SELECTED}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="btn-secondary">{ORDER_DETAIL.MODAL_CANCEL}</button>
            <button
              onClick={handleConfirm}
              disabled={!selected || assign.isPending}
              className="btn-primary flex items-center gap-1.5 whitespace-nowrap"
            >
              {assign.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {ORDER_DETAIL.MODAL_CONFIRM}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
