"use client";

import { useState, useEffect } from "react";
import {
  CarIcon,
  GamepadIcon,
  BanknoteIcon,
  PlusIcon,
  Users,
  DollarSign,
  Search,
} from "lucide-react";

import { BalanceCard } from "@/components/dashboard/balance-card";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
import PocketPlanCard from "@/components/dashboard/pocket-plan-card";
import { CurrencyCard } from "@/components/dashboard/currency-card";
import { IncomeAnalysisCard } from "@/components/dashboard/income-analysis-card";
import { ExpenseAnalysisCard } from "@/components/dashboard/expense-analysis-card";
import { ExpenseCategoryCard } from "@/components/dashboard/expense-category-card";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { GroupComparisonChart } from "@/components/dashboard/group-comparison-chart";
import { useReports } from "@/hooks/use-reports";
import { useGroup } from "@/hooks/use-group";
import { useTransaction } from "@/hooks/use-transaction";
import { useGoals } from "@/hooks/use-goals";
import { formatCurrency } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChamaCard } from "@/components/dashboard/chama-card";
import { ChamaSummaryCard } from "@/components/dashboard/chama-summary-card";
import { TopPerformersCard } from "@/components/dashboard/top-performers-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import CreateChamaModal from "@/components/groups/CreateChamaModal";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "overview";

  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reports = useReports();
  const groupHook = useGroup();
  const transactionHook = useTransaction();
  const goalsHook = useGoals();
  const { getDashboardSummary } = reports;
  const [summary, setSummary] = useState<any | null>(null);
  const [expenseCategories, setExpenseCategories] = useState<any[]>([]);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const [allGoals, setAllGoals] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [monthlyIncomeData, setMonthlyIncomeData] = useState<any[]>([]);
  const [monthlyExpenseData, setMonthlyExpenseData] = useState<any[]>([]);
  const [groupsMetrics, setGroupsMetrics] = useState<any[]>([]);
  const [primaryGroupId, setPrimaryGroupId] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState<boolean>(true);
  const [recentLoading, setRecentLoading] = useState<boolean>(true);
  const [groupsLoading, setGroupsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate API loading delay
    const fetchGroups = async () => {
      try {
        setTimeout(async () => {
          try {
            // Fetch user's groups
            setGroupsLoading(true);
            const userGroups = await groupHook.getAll();
            const selectedGroups =
              userGroups && userGroups.length ? userGroups : [];
            setGroups(selectedGroups as any[]);
            const primary = selectedGroups?.[0]?.id || null;
            setPrimaryGroupId(primary);

            // Fetch dashboard summary across all groups and aggregate
            setSummaryLoading(true);
            try {
              const summaryPromises = (selectedGroups || []).map((g: any) =>
                reports.getDashboardSummary()
              );
              // Note: dashboard summary endpoint does not take groupId in current endpoints; use overall summary if provided
              const summaryResults = await Promise.all(summaryPromises);
              // Try to merge numeric totals where present, otherwise fall back to first non-null
              const merged: any = {};
              const financialsAgg: any = {
                trialBalance: { totals: { totalDebit: 0, totalCredit: 0 } },
                balanceSheet: {
                  assets: { cash: 0, loans: 0, totalAssets: 0 },
                  liabilities: { totalLiabilities: 0 },
                  equity: { contributions: 0, earnings: 0, totalEquity: 0 },
                  totalLiabilitiesAndEquity: 0,
                },
              };
              const groupsAgg = { active: 0, inactive: 0, total: 0 };
              const membersAgg = { total: 0, byRole: [] as any[] };

              (summaryResults || []).forEach((s: any) => {
                if (!s) return;
                // financial totals
                try {
                  financialsAgg.trialBalance.totals.totalDebit +=
                    s.financials?.trialBalance?.totals?.totalDebit || 0;
                  financialsAgg.trialBalance.totals.totalCredit +=
                    s.financials?.trialBalance?.totals?.totalCredit || 0;
                  financialsAgg.balanceSheet.assets.cash +=
                    s.financials?.balanceSheet?.assets?.cash || 0;
                  financialsAgg.balanceSheet.assets.loans +=
                    s.financials?.balanceSheet?.assets?.loans || 0;
                  financialsAgg.balanceSheet.assets.totalAssets +=
                    s.financials?.balanceSheet?.assets?.totalAssets || 0;
                  financialsAgg.balanceSheet.liabilities.totalLiabilities +=
                    s.financials?.balanceSheet?.liabilities?.totalLiabilities ||
                    0;
                  financialsAgg.balanceSheet.equity.contributions +=
                    s.financials?.balanceSheet?.equity?.contributions || 0;
                  financialsAgg.balanceSheet.equity.earnings +=
                    s.financials?.balanceSheet?.equity?.earnings || 0;
                  financialsAgg.balanceSheet.equity.totalEquity +=
                    s.financials?.balanceSheet?.equity?.totalEquity || 0;
                  financialsAgg.balanceSheet.totalLiabilitiesAndEquity +=
                    s.financials?.balanceSheet?.totalLiabilitiesAndEquity || 0;
                } catch (err) {}

                // groups
                groupsAgg.active += s.groups?.active || 0;
                groupsAgg.inactive += s.groups?.inactive || 0;
                groupsAgg.total += s.groups?.total || 0;

                // members
                membersAgg.total += s.members?.total || 0;
                if (Array.isArray(s.members?.byRole)) {
                  s.members.byRole.forEach((r: any) => {
                    const existing = membersAgg.byRole.find(
                      (x: any) => x.role === r.role
                    );
                    if (existing) existing.count += r.count;
                    else
                      membersAgg.byRole.push({ role: r.role, count: r.count });
                  });
                }
              });

              merged.groups = groupsAgg;
              merged.members = membersAgg;
              merged.financials = {
                trialBalance: { totals: financialsAgg.trialBalance.totals },
                balanceSheet: financialsAgg.balanceSheet,
              };

              setSummary(Object.keys(merged).length ? merged : null);
            } catch (e) {
              // ignore
              setSummary(null);
            } finally {
              setSummaryLoading(false);
            }

            // Fetch recent transactions and monthly breakdown across all selected groups
            if (selectedGroups && selectedGroups.length) {
              setRecentLoading(true);
              try {
                // fetch recent txs for each group in parallel
                const txPromises = selectedGroups.map((g: any) =>
                  transactionHook.getAll(g.id, 0, 10, "")
                );
                const txResults = await Promise.all(txPromises);
                const allTxs = (txResults || []).flat().filter(Boolean);
                // sort by date desc and take top 6
                const sorted = allTxs.sort(
                  (a: any, b: any) =>
                    new Date(b.createdAt || b.date).getTime() -
                    new Date(a.createdAt || a.date).getTime()
                );
                const top = sorted.slice(0, 6);
                const mapped = (top || []).map((t: any) => ({
                  icon: (
                    <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">
                      TX
                    </div>
                  ),
                  title:
                    t.description ||
                    t.title ||
                    t.transactionType ||
                    "Transaction",
                  subtitle: t.status || t.type || "",
                  amount: t.amount
                    ? t.amount > 0
                      ? `+$${t.amount}`
                      : `-$${Math.abs(t.amount)}`
                    : "$0",
                  date: t.createdAt || t.date || "",
                }));
                setRecentActivities(mapped);
              } catch (e) {
                setRecentActivities([]);
              } finally {
                setRecentLoading(false);
              }

              // Fetch monthly breakdown for charts across groups and aggregate per month
              try {
                const year = new Date().getFullYear();
                const monthlyPromises = selectedGroups.map((g: any) =>
                  reports.getMonthlyTransactions({ groupId: g.id, year })
                );
                const monthlyResults = await Promise.all(monthlyPromises);
                // aggregate totals per month
                const monthMap: Record<number, number> = {};
                (monthlyResults || []).forEach((arr: any[] = []) => {
                  (arr || []).forEach((m: any) => {
                    const month = Number(m.month) || 0;
                    monthMap[month] = (monthMap[month] || 0) + (m.total || 0);
                  });
                });
                const income = Object.keys(monthMap)
                  .map((k) => ({
                    name:
                      [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ][Number(k) - 1] || `M${k}`,
                    income: monthMap[Number(k)] || 0,
                  }))
                  .sort(
                    (a: any, b: any) =>
                      [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ].indexOf(a.name) -
                      [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ].indexOf(b.name)
                  );
                const expense = income.map((m: any) => ({
                  name: m.name,
                  expenses: m.income,
                }));
                setMonthlyIncomeData(income);
                setMonthlyExpenseData(expense);
              } catch (e) {
                setMonthlyIncomeData([]);
                setMonthlyExpenseData([]);
              }
            }

            // Fetch expense report per group and compute distribution of expenses across groups
            try {
              if (selectedGroups && selectedGroups.length) {
                // For each group, request its expense report but never allow a single failure to throw
                const expPromises = selectedGroups.map(async (g: any) => {
                  try {
                    const res = await reports.getExpenseReport({
                      groupId: g.id,
                    });
                    return { group: g, report: res };
                  } catch (e) {
                    // return a zeroed report for this group so aggregation can continue
                    return {
                      group: g,
                      report: { totalExpenses: 0, expensesByCategory: [] },
                    };
                  }
                });

                const expResults = await Promise.all(expPromises);

                // Build distribution: total expense value per group
                const distribution = (expResults || []).map((item: any) => {
                  const group = item.group;
                  const report = item.report || {};
                  // prefer totalExpenses if provided, otherwise sum categories
                  let total = 0;
                  if (typeof report.totalExpenses === "number") {
                    total = report.totalExpenses;
                  } else if (Array.isArray(report.expensesByCategory)) {
                    total = report.expensesByCategory.reduce(
                      (s: number, c: any) => s + (c.total || 0),
                      0
                    );
                  }
                  return {
                    name: group.name || `Group ${group.id}`,
                    value: total,
                    color: undefined,
                  };
                });

                setExpenseCategories(distribution);
              } else {
                setExpenseCategories([]);
              }
            } catch (err) {
              // keep UI stable even if aggregation fails
              console.error("Expense distribution aggregation error:", err);
              setExpenseCategories([]);
            }

            // Fetch group metrics for comparison chart
            try {
              const metricsPromises = (selectedGroups || []).map(
                async (g: any) => {
                  try {
                    const res = await (groupHook as any).getMetrics(g.id);
                    return {
                      id: g.id,
                      name: g.name,
                      contributions:
                        res?.data?.contributions || res?.contributions || 0,
                      expenses: res?.data?.expenses || res?.expenses || 0,
                      loans: res?.data?.loans || res?.loans || 0,
                    };
                  } catch (err) {
                    return {
                      id: g.id,
                      name: g.name,
                      contributions: 0,
                      expenses: 0,
                      loans: 0,
                    };
                  }
                }
              );
              const gm = await Promise.all(metricsPromises);
              setGroupsMetrics(gm);

              // Enrich original selectedGroups with metrics so ChamaCard receives correct data
              const enrichedGroups = (selectedGroups || []).map((g: any) => {
                const m = gm.find((x: any) => x.id === g.id) || {};
                return {
                  ...g,
                  contributions:
                    Number(m.contributions) || Number(g.contributions) || 0,
                  expenses: Number(m.expenses) || Number(g.expenses) || 0,
                  loans: Number(m.loans) || (g.loans ? Number(g.loans) : 0),
                  members: (() => {
                    const mem = g.members;
                    if (typeof mem === "number") return mem;
                    if (Array.isArray(mem)) return mem.length;
                    if (mem && typeof mem.count === "number") return mem.count;
                    return (g.memberCount as number) || 0;
                  })(),
                };
              });
              setGroups(enrichedGroups as any[]);
              // Compute top performers (simple growth proxy: contributions - expenses)
              try {
                const performers = (gm || [])
                  .map((g: any) => ({
                    name: g.name,
                    growth: Math.round(
                      ((g.contributions - g.expenses) / (g.expenses || 1)) * 100
                    ),
                  }))
                  .sort((a: any, b: any) => b.growth - a.growth)
                  .slice(0, 5);
                setTopPerformers(performers);
              } catch (err) {
                setTopPerformers([]);
              }
            } catch (e) {
              setGroupsMetrics([]);
            }

            // Fetch goals for all groups and aggregate
            try {
              const goalsPromises = (selectedGroups || []).map((g: any) =>
                goalsHook.getGroupGoals(g.id).catch(() => [])
              );
              const goalsResults = await Promise.all(goalsPromises);
              const aggregated = (goalsResults || []).flat();
              setAllGoals(aggregated || []);
            } catch (err) {
              setAllGoals([]);
            }
          } catch (err) {
            setError((err as any)?.message || "Failed to load dashboard");
          } finally {
            setGroupsLoading(false);
            setLoading(false);
          }
        }, 200);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const dummyActivities = [
    {
      icon: (
        <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">
          ICN
        </div>
      ),
      title: "Figma Pro",
      subtitle: "Subscriptions",
      amount: "-$23.21",
      date: "10/02/22 - 15.34",
    },
    {
      icon: (
        <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">
          ICN
        </div>
      ),
      title: "Adobe Collection",
      subtitle: "Subscriptions",
      amount: "-$50.21",
      date: "10/02/22 - 15.34",
    },
    {
      icon: (
        <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">
          ICN
        </div>
      ),
      title: "Fiver Inter",
      subtitle: "Receive",
      amount: "+$100.00",
      date: "10/02/22 - 15.34",
    },
    {
      icon: (
        <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">
          ICN
        </div>
      ),
      title: "Upwork Inter",
      subtitle: "Receive",
      amount: "+$200.00",
      date: "10/02/22 - 15.34",
    },
    {
      icon: (
        <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">
          ICN
        </div>
      ),
      title: "Starbucks",
      subtitle: "Transfer",
      amount: "-$50.00",
      date: "10/02/22 - 15.34",
    },
  ];

  const dummyExchangeRates = [
    {
      flagIcon: (
        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">
          🇮🇩
        </div>
      ),
      currencyName: "Rupiah",
      exchangeRate: "15425,15",
      currencyCode: "IDR",
    },
    {
      flagIcon: (
        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">
          🇪🇺
        </div>
      ),
      currencyName: "Euro",
      exchangeRate: "0,95",
      currencyCode: "EUR",
    },
    {
      flagIcon: (
        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">
          🇨🇳
        </div>
      ),
      currencyName: "Chinese Yuan",
      exchangeRate: "7,06",
      currencyCode: "CNY",
    },
  ];

  const dummyPocketPlans = [
    {
      icon: (
        <div className="h-10 w-10 bg-[#E8EDF2] dark:bg-[#222A35] rounded-lg flex items-center justify-center">
          <CarIcon className="h-6 w-6 text-[#8C9BA5]" />
        </div>
      ),
      title: "New Car",
      amount: "$5.000,00",
    },
    {
      icon: (
        <div className="h-10 w-10 bg-[#E8EDF2] dark:bg-[#222A35] rounded-lg flex items-center justify-center">
          <GamepadIcon className="h-6 w-6 text-[#8C9BA5]" />
        </div>
      ),
      title: "New Console",
      amount: "$5.000,00",
    },
    {
      icon: (
        <div className="h-10 w-10 bg-[#E8EDF2] dark:bg-[#222A35] rounded-lg flex items-center justify-center">
          <BanknoteIcon className="h-6 w-6 text-[#8C9BA5]" />
        </div>
      ),
      title: "Savings",
      amount: "$5.000,00",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F4F4F7] dark:bg-[#1A1C1E]">
      <div className="w-full bg-[#1C2634] dark:bg-[#2C3542] pb-32 -mt-16 relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 grid-pattern pointer-events-none z-0"></div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--secondary)]/5 pointer-events-none z-0"></div>

        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 pt-24 lg:px-10 xl:px-20 relative z-10">
          <DashboardTabs />
        </div>
      </div>
      <main className="flex-grow w-full relative z-10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 -mt-20">
          {tab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr_1fr] gap-6 auto-rows-min">
              {/* Column 1 */}
              <div className="flex flex-col gap-6 min-w-0">
                {/* Balance: show skeleton while summary is loading */}
                {summaryLoading ? (
                  <div className="bg-white dark:bg-[#2C3542] rounded-2xl p-6">
                    <Skeleton className="h-8 w-1/3 mb-4" />
                    <Skeleton className="h-6 w-2/3" />
                  </div>
                ) : (
                  <BalanceCard
                    totalBalance={
                      summary?.financials?.balanceSheet?.equity?.contributions
                        ? `${formatCurrency(
                            summary.financials.balanceSheet.equity.contributions
                          )}`
                        : undefined
                    }
                  />
                )}

                {/* Recent activity: show skeleton list while loading, otherwise real activities */}
                {recentLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="p-4 bg-white dark:bg-[#2C3542] rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-40 mb-2" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                        <div>
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <RecentActivityCard activities={recentActivities} />
                )}
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-6 min-w-0">
                <IncomeAnalysisCard
                  title="Income Analysis"
                  metric={formatCurrency(
                    Number(
                      summary?.financials?.trialBalance?.totals?.totalCredit
                    ) || 0
                  )}
                  percentageChange="+3.1%"
                  timePeriod="This Month"
                  changeType="increase"
                  changeAmount="$2.172"
                  data={monthlyIncomeData}
                  loading={recentLoading}
                />
                <ExpenseAnalysisCard
                  title="Expense Analysis"
                  metric={formatCurrency(
                    Number(
                      summary?.financials?.trialBalance?.totals?.totalDebit
                    ) || 0
                  )}
                  percentageChange="-2.1%"
                  timePeriod="This Month"
                  changeType="decrease"
                  data={monthlyExpenseData}
                  loading={recentLoading}
                />
                <ExpenseCategoryCard
                  data={
                    expenseCategories.length
                      ? expenseCategories
                      : summary?.financials?.balanceSheet?.assets?.categories ||
                        []
                  }
                  loading={summaryLoading}
                />
                <div className="mt-4">
                  {groupsLoading ? (
                    <div className="p-6 bg-white dark:bg-[#2C3542] rounded-2xl">
                      <Skeleton className="h-6 w-1/2 mb-4" />
                      <Skeleton className="h-40 w-full" />
                    </div>
                  ) : (
                    <GroupComparisonChart groups={groupsMetrics} />
                  )}
                </div>
              </div>

              {/* Column 3 */}
              <div className="flex flex-col gap-6 min-w-0">
                {/* Goals aggregated across all groups (replaces PocketPlanCard) */}
                <div className="bg-white dark:bg-[#2C3542] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#1A1C1E] dark:text-white">
                      My Goals
                    </h3>
                    <div className="text-sm text-secondary-300">See more</div>
                  </div>
                  {/* goals list or skeleton */}
                  <div>
                    {groupsLoading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between"
                          >
                            <div className="w-3/4">
                              <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                              <div className="h-3 w-28 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // render aggregated goals
                      <div className="space-y-3">
                        {/** We'll populate `allGoals` variable in effect and render here. */}
                        {(() => {
                          const allGoals = groups.flatMap(
                            (g: any) => g.goals || []
                          );
                          if (!allGoals || allGoals.length === 0) {
                            return (
                              <div className="text-sm text-muted-foreground">
                                No active goals
                              </div>
                            );
                          }
                          return allGoals.slice(0, 3).map((goal: any) => (
                            <div
                              key={goal.id}
                              className="flex items-center justify-between"
                            >
                              <div className="flex flex-col">
                                <div className="font-medium">{goal.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {formatCurrency(
                                    goal.currentAmount || goal.current || 0
                                  )}{" "}
                                  /{" "}
                                  {formatCurrency(
                                    goal.targetAmount || goal.target || 0
                                  )}
                                </div>
                              </div>
                              <div className="text-sm font-semibold">
                                {goal.status || "IN_PROGRESS"}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    )}
                  </div>
                </div>

                {/* <CurrencyCard exchangeRates={dummyExchangeRates} /> */}
              </div>
            </div>
          )}

          {tab === "chamas" && (
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
                        <div
                          key={i}
                          className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex flex-col items-center"
                        >
                          <Skeleton className="h-6 w-6 mb-2 rounded-full" />
                          <Skeleton className="h-4 w-3/4 mb-1" />
                          <Skeleton className="h-5 w-1/2" />
                        </div>
                      ))}
                      <Skeleton className="col-span-2 mt-2 h-12" />
                    </CardContent>
                  </Card>
                ) : (
                  <ChamaSummaryCard groups={groups} />
                )}

                <Card className="bg-white dark:bg-[#2C3542] rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-14 flex flex-col gap-1"
                    >
                      <PlusIcon className="h-5 w-5" />
                      <span>New Group</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-14 flex flex-col gap-1"
                    >
                      <Users className="h-5 w-5" />
                      <span>Invite Members</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-14 flex flex-col gap-1"
                    >
                      <DollarSign className="h-5 w-5" />
                      <span>Record Payment</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-14 flex flex-col gap-1"
                    >
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
                  <div className="ml-4">
                    <CreateChamaModal triggerLabel={"Create Chama"} onCreated={() => { /* optional refresh callback */ }} />
                  </div>
                </div>

                {error && (
                  <div className="text-center text-destructive py-8">
                    Error: {error}
                  </div>
                )}

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
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
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
                  <TopPerformersCard
                    groups={topPerformers}
                    loading={groupsLoading}
                  />
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
