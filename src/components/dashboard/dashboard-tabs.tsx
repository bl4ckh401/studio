
"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

export function DashboardTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', tab);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-center pb-4 border-b border-[rgba(255,255,255,0.1)] gap-4">
      <div className="flex flex-row items-start p-0 h-[54px]">
        <Button
          variant="ghost"
          className={`rounded-none border-b-2 h-full px-4 sm:px-6 py-[15px] text-center font-manrope text-base font-medium tracking-[-0.02em] ${activeTab === 'overview' ? 'border-[#31B099] text-white' : 'border-transparent text-[#A2A6AA]'}`}
          onClick={() => handleTabChange('overview')}
        >
          Overview
        </Button>
        <Button
          variant="ghost"
          className={`rounded-none border-b-2 h-full px-4 sm:px-6 py-[15px] text-center font-manrope text-base font-medium tracking-[-0.02em] ${activeTab === 'chamas' ? 'border-[#31B099] text-white' : 'border-transparent text-[#A2A6AA]'}`}
          onClick={() => handleTabChange('chamas')}
        >
          Chamas
        </Button>
      </div>

      <div className="flex items-center px-4 py-3 bg-[rgba(255,255,255,0.07)] rounded-full gap-2 text-white font-satoshi text-sm h-12 w-auto">
        <CalendarIcon className="h-6 w-6 text-white" />
        <span>{new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>
    </div>
  );
}
