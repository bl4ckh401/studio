// app/dashboard/chamas/[id]/page.tsx
"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  LayoutDashboard, Users, Landmark, ArrowDown, ArrowUp, 
  Calendar, HandCoins, CircleDollarSign, Target, Settings,
  BarChart, PieChart, LineChart, ChevronRight, Plus, MoreVertical
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function IndividualChamaPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for the chama group
  const chamaData = {
    id: id,
    name: "Saving Group Alpha",
    status: "Active",
    totalValue: 245680,
    membersCount: 10,
    contributions: 15000,
    expenses: 5000,
    loans: 12000,
    fines: 1200,
    goals: [
      { id: 1, name: "New Office Space", target: 50000, current: 24500, deadline: "2024-12-31" },
      { id: 2, name: "Community Project", target: 20000, current: 8000, deadline: "2024-09-30" }
    ],
    recentTransactions: [
      { id: 1, member: "Jane Smith", amount: 500, type: "Contribution", date: "2023-10-15" },
      { id: 2, member: "John Doe", amount: 200, type: "Fine", date: "2023-10-14" },
      { id: 3, member: "Sarah Johnson", amount: 1000, type: "Loan Repayment", date: "2023-10-12" },
      { id: 4, member: "Group", amount: 1200, type: "Expense", date: "2023-10-10" },
    ],
    members: [
      { id: 1, name: "John Doe", role: "Chairperson", joined: "2021-03-15", contributions: 4500 },
      { id: 2, name: "Jane Smith", role: "Treasurer", joined: "2021-04-22", contributions: 3800 },
      { id: 3, name: "Robert Johnson", role: "Secretary", joined: "2021-05-10", contributions: 3200 },
      { id: 4, name: "Sarah Williams", role: "Member", joined: "2021-06-05", contributions: 2800 },
      { id: 5, name: "Michael Brown", role: "Member", joined: "2021-07-18", contributions: 2500 },
    ],
    upcomingEvents: [
      { id: 1, title: "Monthly Meeting", date: "2023-11-05", location: "Community Hall" },
      { id: 2, title: "Contribution Deadline", date: "2023-11-15", location: "Online" },
      { id: 3, title: "Loan Committee Meeting", date: "2023-11-20", location: "Zoom" },
    ],
    financialData: [
      { month: "Jan", contributions: 12000, expenses: 4000 },
      { month: "Feb", contributions: 14000, expenses: 4500 },
      { month: "Mar", contributions: 15000, expenses: 5000 },
      { month: "Apr", contributions: 13000, expenses: 4200 },
      { month: "May", contributions: 16000, expenses: 4800 },
      { month: "Jun", contributions: 17000, expenses: 5200 },
      { month: "Jul", contributions: 18000, expenses: 5500 },
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'members', label: 'Members', icon: <Users className="h-4 w-4" /> },
    { id: 'contributions', label: 'Contributions', icon: <Landmark className="h-4 w-4" /> },
    { id: 'income', label: 'Income', icon: <ArrowUp className="h-4 w-4" /> },
    { id: 'loans', label: 'Loans', icon: <HandCoins className="h-4 w-4" /> },
    { id: 'expenses', label: 'Expenses', icon: <ArrowDown className="h-4 w-4" /> },
    { id: 'fines', label: 'Fines', icon: <CircleDollarSign className="h-4 w-4" /> },
    { id: 'goals', label: 'Goals', icon: <Target className="h-4 w-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F4F4F7] dark:bg-[#1A1C1E]">
      <main className="flex-grow w-full relative z-10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 pt-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{chamaData.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className={`h-2.5 w-2.5 rounded-full ${chamaData.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-muted-foreground">{chamaData.status} Group</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{chamaData.members.length} members</span>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-5 md:grid-cols-9 gap-2 overflow-x-auto">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id} 
                  className="flex items-center gap-2 py-2 text-xs sm:text-sm"
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Tab Content */}
          <div className="bg-white dark:bg-[#2C3542] rounded-2xl p-6 shadow-md">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
                {/* Left Column */}
                <div className="flex flex-col gap-6">
                  {/* Financial Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart className="h-5 w-5" />
                        Financial Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-[#F0F9FF] dark:bg-[#1E293B] p-4 rounded-lg">
                          <div className="text-muted-foreground text-sm">Total Value</div>
                          <div className="text-xl font-bold">{formatCurrency(chamaData.totalValue)}</div>
                        </div>
                        <div className="bg-[#F0FDF4] dark:bg-[#1F2E1D] p-4 rounded-lg">
                          <div className="text-muted-foreground text-sm">Contributions</div>
                          <div className="text-xl font-bold">{formatCurrency(chamaData.contributions)}</div>
                        </div>
                        <div className="bg-[#FEF2F2] dark:bg-[#2D1A1A] p-4 rounded-lg">
                          <div className="text-muted-foreground text-sm">Expenses</div>
                          <div className="text-xl font-bold">{formatCurrency(chamaData.expenses)}</div>
                        </div>
                        <div className="bg-[#FFFBEB] dark:bg-[#2E240D] p-4 rounded-lg">
                          <div className="text-muted-foreground text-sm">Active Loans</div>
                          <div className="text-xl font-bold">{formatCurrency(chamaData.loans)}</div>
                        </div>
                      </div>
                      
                      {/* Contribution vs Expenses Chart */}
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold">Contributions vs Expenses</h3>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 bg-[#3B82F6] rounded-full"></div>
                              <span className="text-sm">Contributions</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 bg-[#EF4444] rounded-full"></div>
                              <span className="text-sm">Expenses</span>
                            </div>
                          </div>
                        </div>
                        <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          <LineChart className="h-10 w-10 text-muted-foreground" />
                          <span className="ml-2 text-muted-foreground">Monthly Contribution vs Expense Chart</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Transactions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Landmark className="h-5 w-5" />
                        Recent Transactions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Member</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {chamaData.recentTransactions.map((tx) => (
                            <TableRow key={tx.id}>
                              <TableCell className="font-medium">{tx.member}</TableCell>
                              <TableCell>{tx.type}</TableCell>
                              <TableCell className={tx.type === 'Contribution' || tx.type === 'Loan Repayment' ? 'text-green-500' : 'text-red-500'}>
                                {formatCurrency(tx.amount)}
                              </TableCell>
                              <TableCell className="text-right">{tx.date}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="justify-center">
                      <Button variant="ghost">View All Transactions</Button>
                    </CardFooter>
                  </Card>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6">
                  {/* Goals Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Group Goals
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {chamaData.goals.map((goal) => (
                        <div key={goal.id}>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{goal.name}</span>
                            <span className="text-muted-foreground">{formatCurrency(goal.current)}/{formatCurrency(goal.target)}</span>
                          </div>
                          <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                          <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                            <span>Target: {goal.deadline}</span>
                            <span>{Math.round((goal.current / goal.target) * 100)}%</span>
                          </div>
                        </div>
                      ))}
                      <Button className="w-full mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Goal
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Upcoming Events */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Upcoming Events
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {chamaData.upcomingEvents.map((event) => (
                        <div key={event.id} className="flex items-start gap-4">
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                            <div className="text-center text-sm font-bold">
                              {new Date(event.date).toLocaleString('default', { month: 'short' })}
                            </div>
                            <div className="text-center text-xl font-bold">
                              {new Date(event.date).getDate()}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-muted-foreground">{event.location}</div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Calendar
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Top Contributors */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Top Contributors
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {chamaData.members.slice(0, 3).map((member, index) => (
                        <div key={member.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-muted-foreground">{member.role}</div>
                            </div>
                          </div>
                          <div className="font-bold">{formatCurrency(member.contributions)}</div>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="w-full">
                        View All Members
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Group Members</h2>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {chamaData.members.map(member => (
                    <Card key={member.id} className="flex flex-col">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{member.name}</CardTitle>
                            <div className="text-sm text-muted-foreground">{member.role}</div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-muted-foreground text-sm">Joined</div>
                            <div>{member.joined}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground text-sm">Contributions</div>
                            <div className="font-bold">{formatCurrency(member.contributions)}</div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          View Profile
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Contributions Tab */}
            {activeTab === 'contributions' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Contributions</h2>
                  <div className="flex gap-2">
                    <Input placeholder="Search contributions..." className="max-w-xs" />
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Record Contribution
                    </Button>
                  </div>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Contribution History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Member</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Payment Method</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {chamaData.recentTransactions.map((tx) => (
                          <TableRow key={tx.id}>
                            <TableCell>{tx.date}</TableCell>
                            <TableCell>{tx.member}</TableCell>
                            <TableCell className="text-green-500">{formatCurrency(tx.amount)}</TableCell>
                            <TableCell>M-Pesa</TableCell>
                            <TableCell className="text-right">
                              <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded-full text-xs">
                                Completed
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Button variant="ghost">Load More</Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {/* Placeholder for other tabs */}
            {activeTab !== 'overview' && activeTab !== 'members' && activeTab !== 'contributions' && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                  {tabs.find(t => t.id === activeTab)?.icon}
                </div>
                <h2 className="text-xl font-bold mb-2">{tabs.find(t => t.id === activeTab)?.label} Dashboard</h2>
                <p className="text-muted-foreground mb-6 text-center">
                  This section is under development. You'll be able to manage all {activeTab.toLowerCase()} here.
                </p>
                <Button>
                  Explore Features
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="w-full p-4 text-center text-xs text-muted-foreground">
        © 2025 Chama Connect. All rights reserved.
      </footer>
    </div>
  );
}
