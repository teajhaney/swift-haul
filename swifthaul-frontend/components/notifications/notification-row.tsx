'use client';

import Link from 'next/link';
import { NotificationIcon } from '@/components/notifications/notification-icon';
import { formatTimestamp } from '@/lib/utils';
import type { ApiNotification } from '@/types/notification';

interface NotificationRowProps {
  n: ApiNotification;
  onRead: (id: string) => void;
  mobile?: boolean;
}

export function NotificationRow({ n, onRead, mobile = false }: NotificationRowProps) {
  const timestamp = formatTimestamp(n.createdAt);
  const href = n.orderReferenceId ? `/orders/${n.orderReferenceId}` : undefined;

  const handleClick = () => {
    if (!n.isRead) onRead(n.id);
  };

  const inner = (
    <>
      <NotificationIcon type={n.type} size={mobile ? 'sm' : 'md'} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-semibold text-text-primary">{n.title}</span>
          <div className={`flex items-center ${mobile ? 'gap-1.5' : 'gap-2'} shrink-0`}>
            <span className={`${mobile ? 'text-[11px]' : 'text-xs'} text-text-muted whitespace-nowrap`}>
              {timestamp}
            </span>
            {!n.isRead && <span className="w-2 h-2 rounded-full bg-primary-light" />}
          </div>
        </div>
        <p className="text-sm text-text-secondary mt-0.5 leading-relaxed">{n.body}</p>
        {n.orderReferenceId && (
          <span className="text-xs font-mono font-semibold text-primary-light mt-1 inline-block">
            {n.orderReferenceId}
          </span>
        )}
      </div>
    </>
  );

  const baseClass = mobile
    ? `w-full flex items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-surface-elevated border-l-[3px] border-solid ${
        !n.isRead ? 'border-l-primary-light bg-primary-subtle/20' : 'border-l-transparent'
      }`
    : `w-full flex items-start gap-4 px-6 py-5 text-left transition-colors hover:bg-surface-elevated ${
        !n.isRead ? 'bg-primary-subtle/40' : ''
      }`;

  if (href) {
    return (
      <Link href={href} className={baseClass} onClick={handleClick}>
        {inner}
      </Link>
    );
  }

  return (
    <button className={baseClass} onClick={handleClick}>
      {inner}
    </button>
  );
}
