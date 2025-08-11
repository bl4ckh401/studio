import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo"; // Assuming you have a Logo component
import { ThemeToggle } from "@/components/theme-toggle"; // Assuming you have a ThemeToggle component
import { SearchIcon, BellIcon, MessageSquare } from "lucide-react";
import Image from 'next/image';

export function DashboardNav() {
  return (
    <nav className="w-full h-[89px] bg-[#1C2536] dark:bg-[#1A1C1E] flex items-center justify-between px-[60px]">
      <div className="flex items-center gap-[64px]"> {/* Adjusted gap based on style */}
        <Logo />
        <div className="flex gap-[10px]"> {/* Adjusted gap */}
          {/* Navigation links */}
          <Button variant="ghost" className="px-[34px] py-[14px] bg-[rgba(255,255,255,0.1)] rounded-[14px] text-white font-satoshi text-sm font-medium">Dashboard</Button> {/* Adjusted padding and added background/border-radius for active */}
          <Button variant="ghost" className="px-[34px] py-[14px] rounded-[14px] text-[#A2A6AA] font-satoshi text-sm font-medium">Wallets</Button> {/* Adjusted padding and added border-radius */}
          <Button variant="ghost" className="px-[34px] py-[14px] rounded-[14px] text-[#A2A6AA] font-satoshi text-sm font-medium">Settings</Button> {/* Adjusted padding and added border-radius */}
          <Button variant="ghost" className="px-[34px] py-[14px] rounded-[14px] text-[#A2A6AA] font-satoshi text-sm font-medium">Help & Center</Button> {/* Adjusted padding and added border-radius */}
        </div>
      </div>
      <div className="flex items-center gap-[14px]"> {/* Adjusted gap */}
        <div className="flex items-center px-[18px] py-0 bg-[rgba(255,255,255,0.07)] rounded-full gap-[16px] h-[48px] w-[210px]"> {/* Adjusted padding, background, rounded, gap, height, width */}
          <SearchIcon className="h-[24px] w-[24px] text-[#A2A6AA]" /> {/* Adjusted icon size */}
          <Input placeholder="Search anything here" className="bg-transparent border-none text-white placeholder:text-[rgba(255,255,255,0.5)] focus-visible:ring-0 focus-visible:ring-offset-0 text-[14px] font-satoshi font-medium h-auto py-0" /> {/* Adjusted placeholder color, font, height, padding */}
        </div>
        <Button variant="ghost" className="p-[12px] bg-[rgba(255,255,255,0.07)] rounded-full h-[48px] w-[48px] flex items-center justify-center"> {/* Adjusted padding, background, rounded, height, width, added flex properties */}
          <BellIcon className="h-[24px] w-[24px] text-white" /> {/* Adjusted icon size */}
        </Button>
         <Button variant="ghost" className="p-[12px] bg-[rgba(255,255,255,0.07)] rounded-full h-[48px] w-[48px] flex items-center justify-center">
          <MessageSquare className="h-[24px] w-[24px] text-white" />
        </Button>
        {/* Profile Picture */}
         <div className="w-[48px] h-[48px] rounded-full overflow-hidden border-[7px] border-[#2C3542]"> {/* Adjusted border */}
            <Image
              src="https://images.unsplash.com/photo-1535713875002-d1d0cfc37cda?auto=format&fit=crop&q=80&w=2980&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Placeholder Unsplash image
              alt="Profile Picture"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
      </div>
    </nav>
  );
}
