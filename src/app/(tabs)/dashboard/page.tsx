
"use client";

import { useState, useEffect } from 'react';
import { CarIcon, GamepadIcon, BanknoteIcon, PlusIcon, Users, DollarSign, Search } from "lucide-react";

import { BalanceCard } from '@/components/dashboard/balance-card';
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
import PocketPlanCard from "@/components/dashboard/pocket-plan-card";
import { CurrencyCard } from "@/components/dashboard/currency-card";
import { IncomeAnalysisCard } from "@/components/dashboard/income-analysis-card";
import { ExpenseAnalysisCard } from "@/components/dashboard/expense-analysis-card";
import { ExpenseCategoryCard } from '@/components/dashboard/expense-category-card';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChamaCard } from "@/components/dashboard/chama-card";
import { ChamaSummaryCard } from "@/components/dashboard/chama-summary-card";
import { TopPerformersCard } from "@/components/dashboard/top-performers-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from '@/components/ui/input';
import { useSearchParams } from 'next/navigation';

export default function DashboardPage() {
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab') || 'overview';
    
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

    const dummyActivities = [
        { icon: <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">ICN</div>, title: "Figma Pro", subtitle: "Subscriptions", amount: "-$23.21", date: "10/02/22 - 15.34" },
        { icon: <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">ICN</div>, title: "Adobe Collection", subtitle: "Subscriptions", amount: "-$50.21", date: "10/02/22 - 15.34" },
        { icon: <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">ICN</div>, title: "Fiver Inter", subtitle: "Receive", amount: "+$100.00", date: "10/02/22 - 15.34" },
        { icon: <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">ICN</div>, title: "Upwork Inter", subtitle: "Receive", amount: "+$200.00", date: "10/02/22 - 15.34" },
        { icon: <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">ICN</div>, title: "Starbucks", subtitle: "Transfer", amount: "-$50.00", date: "10/02/22 - 15.34" },
    ];

    const dummyExchangeRates = [
        { flagIcon: <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">🇮🇩</div>, currencyName: "Rupiah", exchangeRate: "15425,15", currencyCode: "IDR" },
        { flagIcon: <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">🇪🇺</div>, currencyName: "Euro", exchangeRate: "0,95", currencyCode: "EUR" },
        { flagIcon: <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">🇨🇳</div>, currencyName: "Chinese Yuan", exchangeRate: "7,06", currencyCode: "CNY" },
    ];

    const dummyPocketPlans = [
        { icon: <div className="h-10 w-10 bg-[#E8EDF2] dark:bg-[#222A35] rounded-lg flex items-center justify-center"><CarIcon className="h-6 w-6 text-[#8C9BA5]" /></div>, title: "New Car", amount: "$5.000,00" },
        { icon: <div className="h-10 w-10 bg-[#E8EDF2] dark:bg-[#222A35] rounded-lg flex items-center justify-center"><GamepadIcon className="h-6 w-6 text-[#8C9BA5]" /></div>, title: "New Console", amount: "$5.000,00" },
        { icon: <div className="h-10 w-10 bg-[#E8EDF2] dark:bg-[#222A35] rounded-lg flex items-center justify-center"><BanknoteIcon className="h-6 w-6 text-[#8C9BA5]" /></div>, title: "Savings", amount: "$5.000,00" },
    ];

    return (
        <div className="flex flex-col min-h-screen w-full bg-[#F4F4F7] dark:bg-[#1A1C1E]">
            <main className="flex-grow w-full relative z-10">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 -mt-20">
                    {tab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr_1fr] gap-6 auto-rows-min">
                            {/* Column 1 */}
                            <div className="flex flex-col gap-6 min-w-0">
                                <BalanceCard />
                                <RecentActivityCard activities={dummyActivities} />
                            </div>

                            {/* Column 2 */}
                            <div className="flex flex-col gap-6 min-w-0">
                                <IncomeAnalysisCard
                                    title="Income Analysis"
                                    metric="$8,527,224"
                                    percentageChange="+3.1%"
                                    timePeriod="This Month"
                                    changeType="increase"
                                    changeAmount="$2.172"
                                />
                                <ExpenseAnalysisCard
                                    title="Expense Analysis"
                                    metric="$2,056,123"
                                    percentageChange="-2.1%"
                                    timePeriod="This Month"
                                    changeType="decrease"
                                />
                                <ExpenseCategoryCard />
                            </div>

                            {/* Column 3 */}
                            <div className="flex flex-col gap-6 min-w-0">
                                <PocketPlanCard plans={dummyPocketPlans} />
                                <CurrencyCard exchangeRates={dummyExchangeRates} />
                            </div>
                        </div>
                    )}

                    {tab === 'chamas' && (
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
                               <div className="flex justify-between items-center">
                                <div className="relative w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                    placeholder="Search for a chama..."
                                    className="pl-10 w-full bg-white dark:bg-[#2C3542] h-12 rounded-full border-border"
                                    />
                                </div>
                                <Button className="ml-4 h-12 rounded-full">
                                    <PlusIcon className="mr-2 h-5 w-5" />
                                    Create Chama
                                </Button>
                               </div>
                              
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
                    )}
                </div>
            </main>
            <footer className="w-full p-4 text-center text-xs text-muted-foreground">
                © 2025 Chama Connect. All rights reserved.
            </footer>
        </div>
    );
}
