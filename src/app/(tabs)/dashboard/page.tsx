
"use client";

import { useState } from 'react';
import { CarIcon, GamepadIcon, BanknoteIcon } from "lucide-react";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { InfoCard } from "@/components/dashboard/info-card";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
import PocketPlanCard from "@/components/dashboard/pocket-plan-card";
import { CurrencyCard } from "@/components/dashboard/currency-card";
import { IncomeAnalysisCard } from "@/components/dashboard/income-analysis-card";
import { ExpenseAnalysisCard } from "@/components/dashboard/expense-analysis-card";
import { BalanceCard } from '@/components/dashboard/balance-card';
import { ExpenseCategoryCard } from '@/components/dashboard/expense-category-card';
import { ChevronRightIcon } from "lucide-react";
import ChamasListCard from '@/components/dashboard/chamas-list-card';


export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [date, setDate] = useState<Date | undefined>(new Date());

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
        // { icon: <div className="h-10 w-10 bg-[#E8EDF2] dark:bg-[#222A35] rounded-lg flex items-center justify-center"><CarIcon className="h-6 w-6 text-[#8C9BA5]" /></div>, title: "New Car", amount: "$5.000,00" }, // Duplicate for layout
    ];


    return (
        <div className="flex flex-col min-h-screen w-full bg-[#F4F4F7] dark:bg-[#1A1C1E]">

            <main className="flex-grow w-full relative z-10">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 -mt-20">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr_1fr] gap-6 auto-rows-min">

                        {/* Column 1 */}
                        <div className="flex flex-col gap-6 min-w-0">
                            <BalanceCard />
                            {/* <ChamasListCard /> */}
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
                </div>
            </main>

            <footer className="w-full p-4 text-center text-xs text-muted-foreground">
                © 2025 Chama Connect. All rights reserved.
            </footer>
        </div>
    );
}
