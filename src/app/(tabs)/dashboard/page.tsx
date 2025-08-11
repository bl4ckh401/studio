"use client";

import { useState } from 'react';
// import { Calendar } from "@/components/ui/calendar"; // Not used in this layout
// import { Input } from "@/components/ui/input"; // Not used in this layout
// import { Logo } from "@/components/logo"; // Not used in this layout
// import { ThemeToggle } from "@/components/theme-toggle"; // Not used in this layout
import { ChevronRightIcon, SendIcon, CarIcon, GamepadIcon, BanknoteIcon, FlagIcon } from "lucide-react"; // Import necessary Lucide icons
// import Image from 'next/image'; // Not used for current icons/placeholders
import { Button } from '@/components/ui/button'; // Button is used


// Import the new components
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { InfoCard } from "@/components/dashboard/info-card"; // Although not directly used for the main cards, it's a base
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
import PocketPlanCard from "@/components/dashboard/pocket-plan-card";
import { CurrencyCard } from "@/components/dashboard/currency-card";
import { IncomeAnalysisCard } from "@/components/dashboard/income-analysis-card";
import { ExpenseAnalysisCard } from "@/components/dashboard/expense-analysis-card";
import { BalanceCard } from '@/components/dashboard/balance-card';
import { ExpenseCategoryCard } from '@/components/dashboard/expense-category-card';


export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Dummy data for the components
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
        { icon: <div className="h-10 w-10 bg-[#E8EDF2] dark:bg-[#222A35] rounded-lg flex items-center justify-center"><CarIcon className="h-6 w-6 text-[#8C9BA5]" /></div>, title: "New Car", amount: "$5.000,00" }, // Duplicate for layout
    ];


    return (
        <>
            <div className="min-h-screen w-full bg-[#F4F4F7] dark:bg-[#1A1C1E] relative"> {/* Added relative to contain absolute children */}
                <div className="relative w-full h-[337px] bg-[#1C2634] dark:bg-[#2C3542]">
                    {/* Navigation */}
                    <DashboardNav />
                    {/* Pass state handlers */}

                    {/* Title and Breadcrumb */}
                    <div className="absolute top-[113px] left-10 xl:left-20 flex flex-col gap-3">
                        <h1 className="text-white text-2xl font-manrope font-semibold tracking-[-0.03em]">
                            Welcome back, Rainer Yaeger 👏🏻
                        </h1>
                        <div className="flex items-center gap-2 text-[#A2A6AA] font-manrope text-xs">
                            <span>Dashboard</span>
                            <ChevronRightIcon className="h-2 w-2" />
                            <span className="text-white font-semibold">Overview</span>
                        </div>
                    </div>
                    {/* Dashboard Toggle and Date */}
                    <div className="absolute bottom-0 w-full max-w-[1320px] flex justify-between items-center pb-4 border-b border-[rgba(255,255,255,0.3)]">
                        <DashboardTabs />
                    </div>
                </div>
                {/* Main content area for cards */}
                <div className="relative z-10 -mt-[180px] py-28 flex flex-col lg:flex-row items-start gap-6 w-full max-w-[1320px] mx-auto">

                    <div className="flex flex-col gap-6 w-full lg:w-[40%]">
                        <BalanceCard />
                        <RecentActivityCard activities={dummyActivities} />
                    </div>

                    <div className="flex flex-col gap-6 w-full lg:w-[30%]">
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

                    {/* <div className="flex flex-col gap-6 w-full lg:w-[30%]"> 
                        <InfoCard title="My Pocked Plans" seeMoreHref="#">
                            <div className="grid grid-cols-2 gap-4">
                                <PocketPlanCard plans={dummyPocketPlans} />
                            </div>
                        </InfoCard>
                        <CurrencyCard exchangeRates={dummyExchangeRates} />
                    </div> */}
                </div>
            </div>
        </>
    );
}
