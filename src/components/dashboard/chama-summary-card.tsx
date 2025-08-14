// components/dashboard/chama-summary-card.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function ChamaSummaryCard() {
  return (
    <Card className="bg-white dark:bg-[#2C3542] rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Chama Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="bg-[#F0F9FF] dark:bg-[#1E293B] p-4 rounded-lg flex flex-col items-center">
          <Users className="h-6 w-6 text-blue-500 mb-2" />
          <span className="text-sm text-muted-foreground">Total Groups</span>
          <span className="text-xl font-bold">12</span>
        </div>
        
        <div className="bg-[#F0FDF4] dark:bg-[#1F2E1D] p-4 rounded-lg flex flex-col items-center">
          <DollarSign className="h-6 w-6 text-green-500 mb-2" />
          <span className="text-sm text-muted-foreground">Total Value</span>
          <span className="text-xl font-bold">$245,680</span>
        </div>
        
        <div className="bg-[#FFFBEB] dark:bg-[#2E240D] p-4 rounded-lg flex flex-col items-center">
          <TrendingUp className="h-6 w-6 text-yellow-500 mb-2" />
          <span className="text-sm text-muted-foreground">Avg. Growth</span>
          <span className="text-xl font-bold">+12.4%</span>
        </div>
        
        <div className="bg-[#FEF2F2] dark:bg-[#2D1A1A] p-4 rounded-lg flex flex-col items-center">
          <PieChart className="h-6 w-6 text-red-500 mb-2" />
          <span className="text-sm text-muted-foreground">Active Loans</span>
          <span className="text-xl font-bold">$38,450</span>
        </div>
        
        <Button className="col-span-2 mt-2 bg-primary hover:bg-primary/90 h-12">
          Generate Annual Report
        </Button>
      </CardContent>
    </Card>
  );
}