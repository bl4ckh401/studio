import React from 'react';
import { cn } from "@/lib/utils";

interface InfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function InfoCard({ children, className, ...props }: InfoCardProps) {
  return (
    <div className={cn("bg-white dark:bg-[#1A1C1E] rounded-xl shadow", className)} {...props}>
      {children}
    </div>
  );
}
