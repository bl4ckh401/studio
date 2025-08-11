import React from "react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img src="https://i.imgur.com/hLozfo8.png" alt="Chama Logo" className="h-12 w-auto" />
    </div>
  );
}
