import React from 'react';
import Link from 'next/link';
import { InfoIcon, ChevronRightIcon } from "lucide-react";

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  seeMoreHref?: string;
}

export function InfoCard({ title, children, seeMoreHref }: InfoCardProps) {
  return (
    <div className="bg-white dark:bg-[#1A1C1E] rounded-xl p-6 shadow">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-1.5">
          <h2 className="font-manrope text-lg font-semibold text-[#1A1C1E] dark:text-white tracking-[-0.02em]">{title}</h2>
          <InfoIcon className="h-4.5 w-4.5 text-[#6C7278] dark:text-[#A2A6AA]" />
        </div>
        {seeMoreHref && (
          <Link href={seeMoreHref} className="flex items-center gap-1.5 text-[#ACB5BB] dark:text-[#A2A6AA] font-manrope text-sm font-medium tracking-[-0.02em]">
            See more
            <ChevronRightIcon className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}