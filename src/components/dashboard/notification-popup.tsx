
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BellIcon, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

const notifications = [
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
    {
    type: "Receive $200.00",
    message: "You received a payment from Upwork of $200.00",
    time: "4h",
    read: true,
    icon: <ArrowDownCircle className="h-6 w-6 text-green-500" />
  },
];

export function NotificationPopup() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="p-2 bg-[rgba(255,255,255,0.07)] rounded-full h-12 w-12 flex items-center justify-center"
        >
          <BellIcon className="h-6 w-6 text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[90vw] max-w-md bg-white dark:bg-[#1A1C1E] p-6 rounded-2xl shadow-lg border-none"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-foreground tracking-[-0.03em]">Notification</h3>
        </div>
        
        <div className="flex flex-col gap-6 max-h-[60vh] overflow-y-auto">
          {notifications.map((item, index) => (
            <DropdownMenuItem key={index} className="p-0 focus:bg-transparent">
              <div className="flex items-start gap-4 w-full">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-foreground">{item.type}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{item.time}</span>
                      {!item.read && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 pr-4">{item.message}</p>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        
        <DropdownMenuSeparator className="my-6 bg-border" />

        <Button variant="outline" className="w-full h-12">
          View all notifications
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
