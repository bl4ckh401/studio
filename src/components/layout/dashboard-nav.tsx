import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchIcon, BellIcon, MessageSquare } from "lucide-react";
import Image from 'next/image';
import { NotificationPopup } from '@/components/dashboard/notification-popup';

export function DashboardNav() {
  return (
    <nav className="w-full h-[89px] bg-[#1C2536] dark:bg-[#1A1C1E] flex items-center justify-between px-4 sm:px-6 lg:px-10 xl:px-20">
      <div className="flex items-center gap-4 md:gap-8 lg:gap-16">
        <Logo />
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" className="px-4 py-2 bg-[rgba(255,255,255,0.1)] rounded-lg text-white font-satoshi text-sm font-medium">Dashboard</Button>
          <Button variant="ghost" className="px-4 py-2 rounded-lg text-[#A2A6AA] font-satoshi text-sm font-medium">Wallets</Button>
          <Button variant="ghost" className="px-4 py-2 rounded-lg text-[#A2A6AA] font-satoshi text-sm font-medium">Settings</Button>
          <Button variant="ghost" className="px-4 py-2 rounded-lg text-[#A2A6AA] font-satoshi text-sm font-medium">Help & Center</Button>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:flex items-center px-4 py-2 bg-[rgba(255,255,255,0.07)] rounded-full gap-2 h-12 w-auto max-w-xs">
          <SearchIcon className="h-6 w-6 text-[#A2A6AA]" />
          <Input placeholder="Search anything here" className="bg-transparent border-none text-white placeholder:text-[rgba(255,255,255,0.5)] focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-auto py-0" />
        </div>
        <NotificationPopup />
         <Button variant="ghost" className="p-2 bg-[rgba(255,255,255,0.07)] rounded-full h-12 w-12 flex items-center justify-center">
          <MessageSquare className="h-6 w-6 text-white" />
        </Button>
         <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#2C3542]">
            <Image
              src="https://images.unsplash.com/photo-1535713875002-d1d0cfc37cda?auto=format&fit=crop&q=80&w=2980&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Profile Picture"
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          </div>
          <ThemeToggle />
      </div>
    </nav>
  );
}
