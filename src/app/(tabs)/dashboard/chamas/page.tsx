// app/dashboard/chamas/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, PlusIcon, Users } from "lucide-react";
import { GroupComparisonChart } from "@/components/dashboard/group-comparison-chart";
import { ChamaCard } from "@/components/dashboard/chama-card";
import { ChamaSummaryCard } from "@/components/dashboard/chama-summary-card";
import { TopPerformersCard } from "@/components/dashboard/top-performers-card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';

export default function ChamasGroupsOverviewPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API loading delay
    const fetchGroups = async () => {
      try {
        setTimeout(() => {
          setGroups([
            { id: 1, name: "Saving Group Alpha", status: "Active", members: 10, contributions: 15000, expenses: 5000 },
            { id: 2, name: "Investment Circle Beta", status: "Inactive", members: 5, contributions: 7500, expenses: 1200 },
            { id: 3, name: "Chama Friends Forever", status: "Active", members: 15, contributions: 25000, expenses: 8000 },
            { id: 4, name: "Tech Innovators", status: "Active", members: 8, contributions: 32000, expenses: 15000 },
            { id: 5, name: "Community Builders", status: "Active", members: 25, contributions: 12000, expenses: 3000 },
            { id: 6, name: "Digital Nomads Fund", status: "Inactive", members: 3, contributions: 5000, expenses: 0 },
          ]);
          setLoading(false);
        }, 1500);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F4F4F7] dark:bg-[#1A1C1E]">
      <main className="flex-grow w-full relative z-10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 -mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr_1fr] gap-6 auto-rows-min">

            {/* Column 1 */}
            <div className="flex flex-col gap-6 min-w-0">
              {loading ? (
                <Card className="bg-white dark:bg-[#2C3542] rounded-2xl">
                  <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex flex-col items-center">
                        <Skeleton className="h-6 w-6 mb-2 rounded-full" />
                        <Skeleton className="h-4 w-3/4 mb-1" />
                        <Skeleton className="h-5 w-1/2" />
                      </div>
                    ))}
                    <Skeleton className="col-span-2 mt-2 h-12" />
                  </CardContent>
                </Card>
              ) : (
                <ChamaSummaryCard />
              )}
              
              <Card className="bg-white dark:bg-[#2C3542] rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-14 flex flex-col gap-1">
                    <PlusIcon className="h-5 w-5" />
                    <span>New Group</span>
                  </Button>
                  <Button variant="outline" className="h-14 flex flex-col gap-1">
                    <Users className="h-5 w-5" />
                    <span>Invite Members</span>
                  </Button>
                  <Button variant="outline" className="h-14 flex flex-col gap-1">
                    <DollarSign className="h-5 w-5" />
                    <span>Record Payment</span>
                  </Button>
                  <Button variant="outline" className="h-14 flex flex-col gap-1">
                    <span className="text-lg">📊</span>
                    <span>Generate Report</span>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-6 min-w-0">
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="bg-white dark:bg-[#2C3542] rounded-2xl h-80">
                      <CardHeader className="flex flex-row items-start justify-between p-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-lg" />
                          <Skeleton className="h-5 w-32" />
                        </div>
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {[...Array(4)].map((_, j) => (
                            <div key={j} className="flex items-center gap-2">
                              <Skeleton className="h-4 w-4 rounded-full" />
                              <div>
                                <Skeleton className="h-3 w-16 mb-1" />
                                <Skeleton className="h-4 w-20" />
                              </div>
                            </div>
                          ))}
                        </div>
                        <Skeleton className="h-24 w-full mt-4" />
                      </CardContent>
                      <CardContent className="px-4 pb-4">
                        <Skeleton className="h-12 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {error && <div className="text-center text-destructive py-8">Error: {error}</div>}
              
              {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {groups.map((group) => (
                    <ChamaCard key={group.id} group={group} />
                  ))}
                </div>
              )}
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-6 min-w-0">
              {loading ? (
                <Card className="bg-white dark:bg-[#2C3542] rounded-2xl h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                    ))}
                    <Skeleton className="h-16 w-full rounded-lg mt-6" />
                  </CardContent>
                </Card>
              ) : (
                <TopPerformersCard />
              )}
            </div>

          </div>
        </div>
      </main>
      <footer className="w-full p-4 text-center text-xs text-muted-foreground">
        © 2025 Chama Connect. All rights reserved.
      </footer>
    </div>
  );
}