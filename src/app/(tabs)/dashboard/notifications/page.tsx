
"use client";

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Settings2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const notificationsData = [
  {
    type: "Transfer Success",
    message: "You have successfully sent Johnathan $10.00",
    time: "2m",
    read: false,
    icon: <ArrowUpCircle className="h-6 w-6 text-blue-500" />
  },
  {
    type: "Transfer Success",
    message: "You have successfully sent Starbucks $10.00",
    time: "30m",
    read: false,
    icon: <ArrowUpCircle className="h-6 w-6 text-blue-500" />
  },
  {
    type: "Receive $100.00",
    message: "You received a payment from Fiver Inter of $100.00",
    time: "3h",
    read: true,
    icon: <ArrowDownCircle className="h-6 w-6 text-green-500" />
  },
  {
    type: "Receive $200.00",
    message: "You received a payment from Upwork of $200.00",
    time: "4h",
    read: true,
    icon: <ArrowDownCircle className="h-6 w-6 text-green-500" />
  },
   {
    type: "Transfer Success",
    message: "You have successfully sent johnatan $10.00",
    time: "2m",
    read: false,
    icon: <ArrowUpCircle className="h-6 w-6 text-blue-500" />
  },
  {
    type: "Transfer Success",
    message: "You have successfully sent Startbucks $10.00",
    time: "30m",
    read: false,
    icon: <ArrowUpCircle className="h-6 w-6 text-blue-500" />
  },
  {
    type: "Receive $100.00",
    message: "You received a payment from Fiver Inter of $100.00",
    time: "3h",
    read: true,
    icon: <ArrowDownCircle className="h-6 w-6 text-green-500" />
  },
];

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotifications = notificationsData.filter(notification =>
    notification.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchTerm.toLowerCase())
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
                {filteredNotifications.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 w-full p-4 border-b border-border last:border-b-0">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <p className="font-semibold text-foreground text-base">{item.type}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 sm:mt-0">
                          <span>{item.time}</span>
                          {!item.read && <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 pr-4">{item.message}</p>
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
