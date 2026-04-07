"use client";

import { Bell } from "lucide-react";
import { NOTIFICATION_BELL } from "@/constants/messages";

interface NotificationBellProps {
  count?: number;
  className?: string;
  iconClassName?: string;
}

/** Bell icon with an optional unread badge. */
export function NotificationBell({
  count = 0,
  className = "",
  iconClassName = "w-5 h-5",
}: NotificationBellProps) {
  return (
    <button
      className={`icon-btn ${className}`}
      aria-label={
        count > 0
          ? NOTIFICATION_BELL.ARIA_LABEL_UNREAD(count)
          : NOTIFICATION_BELL.ARIA_LABEL_DEFAULT
      }
    >
      <Bell className={iconClassName} />
      {count > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F27830]" />
      )}
    </button>
  );
}
