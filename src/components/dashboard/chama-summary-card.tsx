// components/dashboard/chama-summary-card.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useReports } from "@/hooks/use-reports";
import { formatCurrency } from "@/lib/utils";

export function ChamaSummaryCard({ groups }: { groups?: any[] }) {
  const { getDashboardSummary } = useReports();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;

    if (groups && groups.length) {
      // compute summary locally to avoid extra network calls
      const totalGroups = groups.length;
      const contributions = groups.reduce((s: number, g: any) => s + (Number(g.contributions) || 0), 0);
      const expenses = groups.reduce((s: number, g: any) => s + (Number(g.expenses) || 0), 0);
      const loans = groups.reduce((s: number, g: any) => s + (Number(g.loans) || 0), 0);
      const avgGrowth = groups.length
        ? Math.round(
            groups.reduce((acc: number, g: any) => {
              const contrib = Number(g.contributions) || 0;
              const exp = Number(g.expenses) || 0;
              const growth = ((contrib - exp) / (exp || 1)) * 100;
              return acc + growth;
            }, 0) / groups.length
          )
        : 0;

      if (!mounted) return;
      setSummary({
        groups: { total: totalGroups, active: totalGroups },
        financials: { balanceSheet: { assets: { totalAssets: contributions }, liabilities: { totalLiabilities: loans } } },
        avgGrowth,
      });
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    // fallback to network fetch once
    (async () => {
      setLoading(true);
      try {
        const res = await getDashboardSummary();
        if (!mounted) return;
        setSummary((prev: any) => {
          if (JSON.stringify(prev) === JSON.stringify(res || null)) return prev;
          return res || null;
        });
      } catch (err) {
        if (!mounted) return;
        setSummary(null);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [groups]);

  const totalGroups =
    (summary?.groups?.total as number) ||
    (summary?.groups?.active as number) ||
    0;
  const totalValue =
    (summary?.financials?.balanceSheet?.assets?.totalAssets as number) || 0;
  const avgGrowth = summary?.avgGrowth || 0;
  const activeLoans =
    (summary?.financials?.balanceSheet?.assets
      ?.loans as number) || 0;

  return (
    <Card className="bg-white dark:bg-[#2C3542] rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Chama Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="bg-[#F0F9FF] dark:bg-[#1E293B] p-4 rounded-lg flex flex-col items-center">
          <Users className="h-6 w-6 text-blue-500 mb-2" />
          <span className="text-sm text-muted-foreground">Total Groups</span>
          <div className="mt-2 h-6 flex items-center">
            {loading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <span className="text-xl font-bold">{totalGroups}</span>
            )}
          </div>
        </div>

        <div className="bg-[#F0FDF4] dark:bg-[#1F2E1D] p-4 rounded-lg flex flex-col items-center">
          <DollarSign className="h-6 w-6 text-green-500 mb-2" />
          <span className="text-sm text-muted-foreground">Total Value</span>
          <div className="mt-2 h-6 flex items-center">
            {loading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <span className="text-xl font-bold">
                {formatCurrency(totalValue)}
              </span>
            )}
          </div>
        </div>

        <div className="bg-[#FFFBEB] dark:bg-[#2E240D] p-4 rounded-lg flex flex-col items-center">
          <TrendingUp className="h-6 w-6 text-yellow-500 mb-2" />
          <span className="text-sm text-muted-foreground">Avg. Growth</span>
          <div className="mt-2 h-6 flex items-center">
            {loading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <span className="text-xl font-bold">
                {typeof avgGrowth === "number"
                  ? `${avgGrowth >= 0 ? "+" : ""}${avgGrowth}%`
                  : "+" + String(avgGrowth)}
              </span>
            )}
          </div>
        </div>

        <div className="bg-[#FEF2F2] dark:bg-[#2D1A1A] p-4 rounded-lg flex flex-col items-center">
          <PieChart className="h-6 w-6 text-red-500 mb-2" />
          <span className="text-sm text-muted-foreground">Active Loans</span>
          <div className="mt-2 h-6 flex items-center">
            {loading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <span className="text-xl font-bold">
                {formatCurrency(activeLoans)}
              </span>
            )}
          </div>
        </div>

        <Button className="col-span-2 mt-2 bg-primary hover:bg-primary/90 h-12">
          Generate Annual Report
        </Button>
      </CardContent>
    </Card>
  );
}
