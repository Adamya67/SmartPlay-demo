"use client";

import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRelativeDate } from "@/lib/utils/format";

type NotificationResponse = {
  notifications: Array<{
    id: string;
    title: string;
    body: string;
    read: boolean;
    createdAt: string;
  }>;
};

async function fetchNotifications(): Promise<NotificationResponse> {
  const response = await fetch("/api/notifications");
  if (!response.ok) {
    throw new Error("Unable to load notifications");
  }
  return response.json();
}

export function NotificationsPopover() {
  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  const unreadCount = data?.notifications.filter((entry) => !entry.read).length ?? 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative rounded-full border border-white/10 bg-white/5 p-2 text-slate-200">
        <Bell className="size-4" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex size-5 items-center justify-center rounded-full bg-lime-400 text-[10px] font-bold text-slate-950">
            {unreadCount}
          </span>
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 space-y-1">
        {(data?.notifications ?? []).slice(0, 6).map((notification) => (
          <DropdownMenuItem key={notification.id} className="block">
            <div className="text-sm font-medium text-white">{notification.title}</div>
            <div className="mt-1 text-sm text-slate-300">{notification.body}</div>
            <div className="mt-1 text-xs text-slate-500">
              {formatRelativeDate(notification.createdAt)}
            </div>
          </DropdownMenuItem>
        ))}
        {!data?.notifications?.length ? (
          <DropdownMenuItem>No notifications yet.</DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
