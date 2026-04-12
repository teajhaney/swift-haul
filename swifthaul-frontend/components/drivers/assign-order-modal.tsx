'use client';

import { useState, useMemo } from 'react';
import { X, Search, Check, MapPin } from 'lucide-react';
import { MOCK_ORDERS } from '@/constants/orders-mock';
import { PRIORITY_STYLES, PRIORITY_LABELS } from '@/constants/orders';
import type { Order } from '@/types/order';

interface AssignOrderModalProps {
  driverName: string;
  onConfirm: (order: Order) => void;
  onClose: () => void;
}

const ASSIGNABLE_STATUSES = ['PENDING'];

export function AssignOrderModal({ driverName, onConfirm, onClose }: AssignOrderModalProps) {
  const [search,   setSearch]   = useState('');
  const [selected, setSelected] = useState<Order | null>(null);

  const candidates = useMemo(
    () => MOCK_ORDERS.filter(o => ASSIGNABLE_STATUSES.includes(o.status) && o.driver === null),
    []
  );

  const filtered = useMemo(() => {
    if (!search) return candidates;
    const q = search.toLowerCase();
    return candidates.filter(
      o =>
        o.referenceId.toLowerCase().includes(q) ||
        o.recipient.toLowerCase().includes(q) ||
        o.destination.toLowerCase().includes(q)
    );
  }, [search, candidates]);

  function handleConfirm() {
    if (selected) { onConfirm(selected); onClose(); }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Assign order to driver"
      className="modal-backdrop"
      onClick={onClose}
    >
      <div className="modal-panel max-w-md" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="text-base font-semibold text-text-primary">Assign New Order</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Select a pending order to assign to{' '}
              <span className="font-semibold text-text-primary">{driverName}</span>
            </p>
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
              placeholder="Search by order ID or recipient…"
              className="form-input pl-9 bg-surface-elevated"
              autoFocus
            />
          </div>
        </div>

        {/* Order list */}
        <div className="modal-body">
          {filtered.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-8">No unassigned orders found.</p>
          ) : (
            <ul className="space-y-1">
              {filtered.map(order => {
                const isSelected = selected?.referenceId === order.referenceId;
                return (
                  <li key={order.referenceId}>
                    <button
                      onClick={() => setSelected(isSelected ? null : order)}
                      className={`w-full flex items-start gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                        isSelected ? 'bg-primary-subtle border border-primary-light/30' : 'hover:bg-surface-elevated'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-sm font-semibold text-primary-light">{order.referenceId}</span>
                          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${PRIORITY_STYLES[order.priority]}`}>
                            {PRIORITY_LABELS[order.priority]}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-text-primary">{order.recipient}</p>
                        <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {order.destination}
                        </p>
                        <p className="text-[10px] font-mono text-text-muted mt-0.5">{order.date} · {order.time}</p>
                      </div>
                      <div className="shrink-0 mt-0.5">
                        {isSelected
                          ? <Check className="w-4 h-4 text-primary-light" />
                          : <span className="w-4 h-4 rounded-full border-2 border-border-strong block" />
                        }
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
            {selected ? `Selected: ${selected.referenceId}` : 'No order selected'}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="btn-secondary">Cancel</button>
            <button onClick={handleConfirm} disabled={!selected} className="btn-primary">
              Assign Order
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
