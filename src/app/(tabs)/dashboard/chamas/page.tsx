
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Eye, MoreVertical, PlusIcon, Trash2, UserPlus, Users, DollarSign, Landmark } from "lucide-react";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IncomeAnalysisCard } from "@/components/dashboard/income-analysis-card";
import { ExpenseAnalysisCard } from "@/components/dashboard/expense-analysis-card";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";

interface Group {
  id: number;
  name: string;
  status: "Active" | "Inactive";
  members: number;
  totalContributions: number;
  totalLoans: number;
}

function ChamaCard({ group }: { group: Group }) {
  return (
    <Card className="flex flex-col bg-card text-card-foreground shadow-md rounded-2xl">
      <CardHeader className="flex flex-row items-start justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-lg font-bold">{group.name}</CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserPlus className="mr-2 h-4 w-4" />
              Leave Group
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-grow px-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Contributions</p>
              <p className="font-semibold">${group.totalContributions.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Loans</p>
              <p className="font-semibold">${group.totalLoans.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Members</p>
              <p className="font-semibold">{group.members}</p>
            </div>
          </div>
           <div className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${group.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="font-semibold">{group.status}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6">
        <Button asChild className="w-full">
          <Link href={`/dashboard/chamas/${group.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function ChamasGroupsOverviewPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dummyActivities = [
      { icon: <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">AC</div>, title: "Chama Alpha Deposit", subtitle: "Contribution", amount: "+$50.00", date: "10/05/22 - 10:15" },
      { icon: <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">BF</div>, title: "Investment Circle Payout", subtitle: "Dividend", amount: "+$120.50", date: "10/04/22 - 18:00" },
      { icon: <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">TI</div>, title: "Tech Innovators Loan", subtitle: "Loan Repayment", amount: "-$75.00", date: "10/03/22 - 12:45" },
      { icon: <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">CB</div>, title: "Community Builders Fee", subtitle: "Admin Fee", amount: "-$5.00", date: "10/02/22 - 09:00" },
      { icon: <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">SA</div>, title: "Saving Group Alpha", subtitle: "Late Fee", amount: "-$10.00", date: "10/01/22 - 14:30" },
  ];

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setGroups([
          { id: 1, name: "Saving Group Alpha", status: "Active", members: 10, totalContributions: 15000, totalLoans: 5000 },
          { id: 2, name: "Investment Circle Beta", status: "Inactive", members: 5, totalContributions: 7500, totalLoans: 1200 },
          { id: 3, name: "Chama Friends Forever", status: "Active", members: 15, totalContributions: 25000, totalLoans: 8000 },
          { id: 4, name: "Tech Innovators", status: "Active", members: 8, totalContributions: 32000, totalLoans: 15000 },
          { id: 5, name: "Community Builders", status: "Active", members: 25, totalContributions: 12000, totalLoans: 3000 },
          { id: 6, name: "Digital Nomads Fund", status: "Inactive", members: 3, totalContributions: 5000, totalLoans: 0 },
        ]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="flex-grow w-full bg-[#F4F4F7] dark:bg-[#1A1C1E]">
      <main className="flex-grow w-full relative z-10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 -mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 auto-rows-min">

            {/* Main Content: Chamas List */}
            <div className="flex flex-col gap-6 min-w-0">
              <div className="mb-8 pt-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Groups Overview</h1>
                <p className="text-muted-foreground">Manage all your investment groups in one place.</p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <Input placeholder="Search groups..." className="w-full sm:max-w-xs bg-card" />
                <Button className="flex items-center gap-2 w-full sm:w-auto">
                  <PlusIcon className="h-4 w-4" />
                  Create Group
                </Button>
              </div>

              {loading && <div className="text-center text-muted-foreground">Loading groups...</div>}
              {error && <div className="text-center text-destructive">Error: {error}</div>}
              
              {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {groups.map((group) => (
                    <ChamaCard key={group.id} group={group} />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar: Analytics */}
            <div className="flex flex-col gap-6 min-w-0 lg:pt-32">
                <IncomeAnalysisCard
                    title="Total Contributions"
                    metric="$82,500"
                    percentageChange="+5.2%"
                    timePeriod="This Month"
                    changeType="increase"
                    changeAmount="$4,100"
                />
                <ExpenseAnalysisCard
                    title="Total Loans"
                    metric="$32,200"
                    percentageChange="+12.5%"
                    timePeriod="This Month"
                    changeType="increase"
                />
                 <RecentActivityCard activities={dummyActivities} />
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
