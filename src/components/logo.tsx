import React from "react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width="27"
        height="27"
        viewBox="0 0 27 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="13.5" cy="13.5" r="13.5" fill="url(#logo-gradient)" />
        <defs>
          <linearGradient
            id="logo-gradient"
            x1="4.6875"
            y1="4.6875"
            x2="24.525"
            y2="21.375"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#2AAC95" />
            <stop offset="1" stopColor="#76D1F7" />
          </linearGradient>
        </defs>
      </svg>

      <span className="text-xl font-bold text-white">Chama Connect</span>
    </div>
  );
}
