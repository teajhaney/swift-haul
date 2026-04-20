'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Truck, CheckCircle } from 'lucide-react';

import { useOrders } from '@/hooks/orders/use-orders';
import { AssignDriverModal } from '@/components/orders/assign-driver-modal';
import { OPERATIONS } from '@/constants/operations';
import { formatDateString } from '@/lib/utils';

type OpsTab = 'FAILED' | 'CANCELLED';

export default function OperationsPage() {
  const [tab, setTab] = useState<OpsTab>('FAILED');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);

  const { data, isLoading, isError } = useOrders({
    status: tab,
    page,
    limit: 10,
  });

  const orders = data?.data ?? [];
  const total = data?.meta.total ?? 0;

  function openAssign(id: string) {
    setSelectedId(id);
    setAssignOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          {OPERATIONS.HEADING}
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          {OPERATIONS.SUBHEADING}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => {
            setTab('FAILED');
            setPage(1);
          }}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'FAILED'
              ? 'border-primary-light text-primary-light'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          {OPERATIONS.TAB_FAILED}
        </button>
        <button
          onClick={() => {
            setTab('CANCELLED');
            setPage(1);
          }}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'CANCELLED'
              ? 'border-primary-light text-primary-light'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          {OPERATIONS.TAB_CANCELLED}
        </button>
      </div>

      {/* List */}
      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-16 bg-surface-elevated animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success mb-4">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-text-primary">
              {tab === 'FAILED'
                ? OPERATIONS.EMPTY_FAILED_TITLE
                : OPERATIONS.EMPTY_CANCELLED_TITLE}
            </h3>
            <p className="text-sm text-text-secondary max-w-xs mt-1">
              {tab === 'FAILED'
                ? OPERATIONS.EMPTY_FAILED_SUB
                : OPERATIONS.EMPTY_CANCELLED_SUB}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-elevated border-b border-border">
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-5 py-3">
                    {OPERATIONS.COL_ORDER}
                  </th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-4 py-3">
                    {OPERATIONS.COL_REASON}
                  </th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-4 py-3">
                    {OPERATIONS.COL_RECIPIENT}
                  </th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-4 py-3">
                    {OPERATIONS.COL_LAST_DRIVER}
                  </th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-4 py-3">
                    {OPERATIONS.COL_TIME}
                  </th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wider text-text-secondary px-5 py-3">
                    {OPERATIONS.COL_ACTIONS}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map(order => (
                  <tr
                    key={order.referenceId}
                    className="hover:bg-surface-elevated/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/orders/${order.referenceId}`}
                        className="font-mono text-sm font-semibold text-primary-light hover:underline"
                      >
                        {order.referenceId}
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-text-primary">
                          {order.pod?.failReason
                            ? OPERATIONS.REASONS[
                                order.pod
                                  .failReason as keyof typeof OPERATIONS.REASONS
                              ] || order.pod.failReason
                            : 'N/A'}
                        </span>
                        {order.pod?.failureNotes && (
                          <span className="text-xs text-text-muted truncate max-w-[200px]">
                            {order.pod.failureNotes}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-text-primary">
                      {order.recipientName}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-text-muted" />
                        <span className="text-sm text-text-secondary">
                          {order.driver?.name || 'Unassigned'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-text-muted">
                      {formatDateString(order.updatedAt)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openAssign(order.referenceId)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-text-secondary hover:bg-surface-elevated transition-colors"
                        >
                          <Truck className="w-3.5 h-3.5 text-primary-light" />
                          {OPERATIONS.ACTION_REASSIGN}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>



      {/* Assign Driver Modal */}
      {assignOpen && selectedId && (
        <AssignDriverModal
          referenceId={selectedId}
          currentDriverId={null}
          onClose={() => {
            setAssignOpen(false);
            setSelectedId(null);
          }}
          onSuccess={() => {
            setAssignOpen(false);
            setSelectedId(null);
          }}
        />
      )}
    </div>
  );
}
