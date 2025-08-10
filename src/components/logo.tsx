import type React from "react";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Chama Connect Logo"
    >
      <g clipPath="url(#clip0_103_2)">
        <path
          d="M36.3316 27.562C34.3644 32.2533 29.6221 35.3333 24 35.3333C17.7327 35.3333 12.6667 30.2673 12.6667 24C12.6667 17.7327 17.7327 12.6667 24 12.6667C29.6221 12.6667 34.3644 15.7467 36.3316 20.438"
          stroke="hsl(var(--primary))"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M29.3333 24H18.6667"
          stroke="hsl(var(--primary))"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_103_2">
          <rect width="48" height="48" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
