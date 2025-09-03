// components/dashboard/top-performers-card.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Medal, ArrowUp, TrendingUp } from "lucide-react";

export function TopPerformersCard({ groups = [], loading = false }: { groups?: { name: string; growth: number }[]; loading?: boolean }) {
  return (
    <Card className="bg-white dark:bg-[#2C3542] rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Medal className="h-5 w-5 text-yellow-500" />
          Top Performing Groups
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 dark:bg-gray-700 w-8 h-8 rounded-full animate-pulse" />
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          ))
        ) : (
          groups.map((group, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 dark:bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center">
                  <span className="font-medium">{index + 1}</span>
                </div>
                <span className="font-medium">{group.name}</span>
              </div>
              <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-green-600 dark:text-green-400 font-medium">+{group.growth}%</span>
              </div>
            </div>
          ))
        )}

        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-blue-500" />
          <div>
            <p className="font-medium">All groups growing</p>
            <p className="text-sm text-muted-foreground">Average 16.1% growth this quarter</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}