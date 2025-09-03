
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BellIcon } from "lucide-react";
import Link from "next/link";
import { useNotification } from "@/hooks/use-notification";
import { NotificationType, NotificationStatus } from "@/app/types/api";

export function NotificationPopup() {
  const { notifications, unreadCount, markAsRead, getUserNotifications, loading } = useNotification();

  // If there are any unread notifications, show only unread sorted newest->oldest.
  // Otherwise, show all notifications sorted newest->oldest.
  const visibleNotifications = (() => {
    const sorted = (notifications || []).slice().sort((a, b) => {
      const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tb - ta;
    });

    const hasUnread = sorted.some((n) => n.status === NotificationStatus.UNREAD);
    if (hasUnread) return sorted.filter((n) => n.status === NotificationStatus.UNREAD);
    return sorted;
  })();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="p-2 bg-[rgba(255,255,255,0.07)] rounded-full h-12 w-12 flex items-center justify-center relative"
        >
          <BellIcon className="h-6 w-6 text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-0 -right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{unreadCount}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[90vw] max-w-md bg-white dark:bg-[#1A1C1E] p-6 rounded-2xl shadow-lg border-none"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-foreground tracking-[-0.03em]">Notification</h3>
          <button
            onClick={() => getUserNotifications({ limit: 100, offset: 0 })}
            className="text-sm text-muted-foreground underline"
          >
            Refresh
          </button>
        </div>

        <div className="flex flex-col gap-6 max-h-[60vh] overflow-y-auto">
          {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
          {!loading && visibleNotifications.length === 0 && (
            <div className="text-sm text-muted-foreground">No notifications</div>
          )}
          {visibleNotifications.map((item) => (
            <DropdownMenuItem key={item.id} className="p-0 focus:bg-transparent">
              <div className="flex items-start gap-4 w-full">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  {/* simple icon based on type */}
                  {item.type === NotificationType.LOAN ? <svg className="h-6 w-6 text-yellow-500" /> : <svg className="h-6 w-6 text-blue-500" />}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-foreground">{item.message}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{new Date(item.createdAt).toLocaleTimeString()}</span>
                      {item.status === NotificationStatus.UNREAD && (
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 pr-4">{item.message}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {item.actions?.map((a, i) => (
                      <button key={i} onClick={a.onClick} className="text-sm text-primary underline">{a.label}</button>
                    ))}
                    <button
                      onClick={() => markAsRead(item.id)}
                      className="text-sm text-muted-foreground underline"
                    >
                      Mark read
                    </button>
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator className="my-6 bg-border" />

        <Button asChild variant="outline" className="w-full h-12">
          <Link href="/dashboard/notifications">View all notifications</Link>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
