
"use client";

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Settings2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useNotification } from '@/hooks/use-notification';

// We'll fetch real notifications from the backend via the hook

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { getUserNotifications, pagination, loading, markAsRead } = useNotification();

  useEffect(() => {
    // load first page of notifications (sorted by hook)
    getUserNotifications({ limit: 100, offset: 0 });
  }, [getUserNotifications]);

  const filteredNotifications = (pagination.data || []).filter((notification: any) =>
    (notification.type || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    (notification.message || '').toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-[#F4F4F7] dark:bg-[#1A1C1E]">
       <main className="flex-grow w-full relative z-10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 mt-6">
          <Card className="bg-white dark:bg-[#2C3542] rounded-2xl p-6 shadow-md">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-[250px] bg-background h-12 rounded-full border-border"
                  />
                </div>
                <Button variant="outline" className="w-full sm:w-auto h-12 rounded-full">
                  <Settings2 className="mr-2 h-5 w-5" />
                  Filter
                </Button>
              </div>

              <div className="flex flex-col gap-6">
                {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
                {!loading && filteredNotifications.length === 0 && (
                  <div className="text-sm text-muted-foreground">No notifications</div>
                )}
                {filteredNotifications.map((item: any, index: number) => (
                  <div key={item.id || index} className="flex items-start gap-4 w-full p-4 border-b border-border last:border-b-0">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      {item.type && item.type.toLowerCase().includes('receive') ? <ArrowDownCircle className="h-6 w-6 text-green-500" /> : <ArrowUpCircle className="h-6 w-6 text-blue-500" />}
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <p className="font-semibold text-foreground text-base">{item.type}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 sm:mt-0">
                          <span>{item.createdAt ? new Date(item.createdAt).toLocaleString() : item.time}</span>
                          {item.status === 'UNREAD' && <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 pr-4">{item.message}</p>
                      <div className="mt-2 flex items-center gap-2">
                        {item.status === 'UNREAD' && (
                          <button
                            onClick={() => markAsRead(item.id)}
                            className="text-sm text-muted-foreground underline"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
