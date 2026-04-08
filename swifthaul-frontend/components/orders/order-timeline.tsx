import { Check, AlertCircle, RotateCcw, XCircle } from 'lucide-react';
import type { TimelineEvent } from '@/types/order-detail';
import type { OrderStatus } from '@/types/order';

interface OrderTimelineProps {
  events: TimelineEvent[];
}

const TERMINAL_ICONS: Partial<Record<OrderStatus, React.ReactNode>> = {
  FAILED:      <AlertCircle className="w-3.5 h-3.5" />,
  CANCELLED:   <XCircle     className="w-3.5 h-3.5" />,
  RESCHEDULED: <RotateCcw   className="w-3.5 h-3.5" />,
};

const TERMINAL_COLORS: Partial<Record<OrderStatus, string>> = {
  FAILED:      'bg-error text-white border-error',
  CANCELLED:   'bg-gray-400 text-white border-gray-400',
  RESCHEDULED: 'bg-warning text-white border-warning',
};

function DotIcon({ event }: { event: TimelineEvent }) {
  if (event.isCurrent && TERMINAL_ICONS[event.status]) {
    return (
      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${TERMINAL_COLORS[event.status] ?? 'bg-primary-light text-white border-primary-light'}`}>
        {TERMINAL_ICONS[event.status]}
      </div>
    );
  }
  if (event.isCompleted) {
    return (
      <div className="w-7 h-7 rounded-full border-2 border-success bg-success flex items-center justify-center shrink-0 z-10">
        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
      </div>
    );
  }
  if (event.isCurrent) {
    return (
      <div className="w-7 h-7 rounded-full border-2 border-primary-light bg-primary-light flex items-center justify-center shrink-0 z-10">
        <span className="w-2.5 h-2.5 rounded-full bg-white" />
      </div>
    );
  }
  // Upcoming
  return (
    <div className="w-7 h-7 rounded-full border-2 border-border bg-surface flex items-center justify-center shrink-0 z-10">
      <span className="w-2 h-2 rounded-full bg-border" />
    </div>
  );
}

export function OrderTimeline({ events }: OrderTimelineProps) {
  return (
    <ol className="flex flex-col">
      {events.map((event, i) => {
        const isLast = i === events.length - 1;
        const lineActive = event.isCompleted;

        return (
          <li key={`${event.status}-${i}`} className="flex gap-3">
            {/* Dot + connector line */}
            <div className="flex flex-col items-center">
              <DotIcon event={event} />
              {!isLast && (
                <div className={`w-0.5 flex-1 my-1 rounded-full ${lineActive ? 'bg-success' : 'bg-border'}`} />
              )}
            </div>

            {/* Content */}
            <div className={`pb-5 min-w-0 ${isLast ? '' : ''}`}>
              <p className={`text-sm font-semibold leading-none mt-0.5 ${
                event.isCurrent ? 'text-text-primary' : event.isCompleted ? 'text-text-primary' : 'text-text-muted'
              }`}>
                {event.label}
                {event.isCurrent && (
                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary-subtle text-primary-light">
                    Current
                  </span>
                )}
              </p>

              {event.timestamp ? (
                <p className="text-xs text-text-secondary mt-1 font-mono">{event.timestamp}</p>
              ) : (
                <p className="text-xs text-text-muted mt-1">Pending</p>
              )}

              {event.location && (
                <p className="text-xs text-text-secondary mt-0.5">{event.location}</p>
              )}
              {event.note && (
                <p className="text-xs text-error mt-1">{event.note}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
