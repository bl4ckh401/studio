"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
// Assuming you have a calendar component - import it if needed
// import { Calendar } from "@/components/ui/calendar";

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState('overview');
  // const [date, setDate] = useState<Date | undefined>(new Date()); // Keep if using a Calendar component

  return (
    <div className="absolute bottom-16 px-[60px] w-full max-w-[1320px] flex justify-between items-center pb-4">
      {/* Dashboard Toggle */}
      <div className="flex flex-row items-start p-0 w-auto h-[54px] border-b border-[rgba(255,255,255,0.3)]">
        <Button
          variant="ghost"
          className={`rounded-none border-b-2 h-full px-6 py-[15px] text-center font-manrope text-base font-medium tracking-[-0.02em] ${activeTab === 'overview' ? 'border-[#31B099] text-white' : 'border-transparent text-[#A2A6AA]'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </Button>
        <Button
          variant="ghost"
          className={`rounded-none border-b-2 h-full px-6 py-[15px] text-center font-manrope text-base font-medium tracking-[-0.02em] ${activeTab === 'chamas' ? 'border-[#31B099] text-white' : 'border-transparent text-[#A2A6AA]'}`}
          onClick={() => setActiveTab('chamas')}
        >
          Chamas
        </Button>
        <Button
          variant="ghost"
          className={`rounded-none border-b-2 h-full px-6 py-[15px] text-center font-manrope text-base font-medium tracking-[-0.02em] ${activeTab === 'settings' ? 'border-[#31B099] text-white' : 'border-transparent text-[#A2A6AA]'}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </Button>
      </div>

      {/* Date */}
      <div className="flex items-center px-4 py-3 bg-[rgba(255,255,255,0.07)] rounded-full gap-4 text-white font-satoshi text-sm h-[48px] w-auto">
        <CalendarIcon className="h-6 w-6 text-white" />
        <span>Oct 22, 2022</span> {/* Replace with actual date display logic */}
      </div>
    </div>
  );
}
