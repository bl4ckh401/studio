"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  Users,
  Landmark,
  ArrowDown,
  ArrowUp,
  Calendar,
  HandCoins,
  CircleDollarSign,
  Target,
  Settings,
  BarChart,
  PieChart,
  LineChart as LucideLineChart,
  ChevronRight,
  Plus,
  MoreVertical,
  Search,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useGroup } from "@/hooks/use-group";
import { useReports } from "@/hooks/use-reports";
import { useTransaction } from "@/hooks/use-transaction";
import { TransactionType } from "@/app/types/api";
import { useGoals } from "@/hooks/use-goals";
import { useCommunication } from "@/hooks/use-communication";
import { useFineRule } from "@/hooks/use-fine-rule";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DocumentList from "@/components/groups/DocumentList";
import PolicyList from "@/components/groups/PolicyList";
import UploadDocumentModal from "@/components/groups/UploadDocumentModal";
import CreatePolicyModal from "@/components/groups/CreatePolicyModal";
import GroupClosureModal from "@/components/groups/GroupClosureModal";
import MakeContribution from "@/components/groups/MakeContribution";
import ContributionsTab from "@/components/groups/ContributionsTab";
import IncomeTab from "@/components/groups/IncomeTab";
import LoansTab from "@/components/groups/LoansTab";
import ExpensesTab from "@/components/groups/ExpensesTab";
import MembersTab from "@/components/groups/MembersTab";
import FinesTab from "@/components/groups/FinesTab";
import GoalsTab from "@/components/groups/GoalsTab";
import { getMemberDisplay } from "@/components/groups/TransactionColumns";
import TransactionApprovalActions from "@/components/groups/TransactionApprovalActions";
import { formatCurrency, formatDateWithTime } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function IndividualChamaPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  // state for real data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadDocumentModalOpen, setIsUploadDocumentModalOpen] =
    useState(false);
  const [isCreatePolicyModalOpen, setIsCreatePolicyModalOpen] = useState(false);
  const [isGroupClosureModalOpen, setIsGroupClosureModalOpen] = useState(false);
  const [chamaData, setChamaData] = useState<any>({
    id,
    name: "",
    status: "",
    totalValue: 0,
    membersCount: 0,
    contributions: 0,
    expenses: 0,
    loans: 0,
    fines: 0,
    goals: [],
    recentTransactions: [],
    members: [],
    upcomingEvents: [],
    financialData: [],
    recentIncome: [],
    loansData: [],
    expensesData: [],
    finesData: [],
  });

  const groupHook = useGroup();
  const reports = useReports();
  // Overview-specific state (from old OverviewTab)
  const [year, setYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState<any>(null);
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [balanceSheet, setBalanceSheet] = useState<any>(null);
  const [finesReport, setFinesReport] = useState<any>(null);
  const [loanReport, setLoanReport] = useState<any>(null);
  const transactionHook = useTransaction();
  const goalsHook = useGoals();
  const commsHook = useCommunication();
  const fineRuleHook = useFineRule();

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        // Group details
        const g = await groupHook.getById(id as string);
        const group = g?.data ?? g ?? null;
        if (!mounted) return;
        if (group) {
          setChamaData((prev: any) => ({ ...prev, ...group }));
        }

        // Recent transactions: contributions
        try {
          const contribs = await transactionHook.getAll(
            id as string,
            0,
            50,
            TransactionType.CONTRIBUTION
          );
          if (mounted)
            setChamaData((prev: any) => ({
              ...prev,
              recentTransactions: Array.isArray(contribs)
                ? contribs
                : contribs?.data || [],
            }));
        } catch (e) {
          // ignore
        }

        // Income records
        try {
          const incomes = await transactionHook.getAll(
            id as string,
            0,
            50,
            TransactionType.INCOME
          );
          if (mounted)
            setChamaData((prev: any) => ({
              ...prev,
              recentIncome: Array.isArray(incomes)
                ? incomes
                : incomes?.data || [],
            }));
        } catch (e) {}

        // Monthly financials for charts
        try {
          const year = new Date().getFullYear();
          const monthly = await reports.getMonthlyTransactions({
            groupId: id as string,
            year,
          });
          // monthly expected shape: [{ month: number, total, expenses }]
          const months = [
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
          ];
          const mapped = (monthly || []).map((m: any) => ({
            month: months[(Number(m.month) || 1) - 1] || `M${m.month}`,
            contributions: m.total || 0,
            expenses: m.expenses || 0,
          }));
          if (mounted) {
            setChamaData((prev: any) => ({ ...prev, financialData: mapped }));
            setMonthlyData(mapped);
          }
        } catch (e) {}

        // Expense report
        try {
          const exp = await reports.getExpenseReport({ groupId: id as string });
          if (mounted)
            setChamaData((prev: any) => ({
              ...prev,
              expensesData: exp?.recentExpenses || [],
            }));
        } catch (e) {}

        // Fines
        try {
          const fines = await reports.getFinesReport({ groupId: id as string });
          if (mounted)
            setChamaData((prev: any) => ({
              ...prev,
              finesData: fines?.memberFines || [],
            }));
        } catch (e) {}

        // Loans
        try {
          const loanAnalysis = await reports.getLoanAnalysisReport({
            groupId: id as string,
          });
          if (mounted)
            setChamaData((prev: any) => ({
              ...prev,
              loansData: loanAnalysis?.loanDetails || [],
            }));
        } catch (e) {}

        // Documents & Policies (basic fetch via useGroup)
        try {
          const policiesRes = await (groupHook as any).getPolicies(
            id as string
          );
          // useGroup.getPolicies sets internal state; also capture for local UI
          if (mounted && policiesRes && policiesRes.data) {
            setChamaData((prev: any) => ({
              ...prev,
              policies: policiesRes.data,
            }));
          }
        } catch (e) {}
        // Overview summary, balance sheet, fines and loan report
        try {
          const [summaryData, monthlyRaw, balanceData, finesData, loanData] =
            await Promise.all([
              reports.getTransactionSummary({
                groupId: id as string,
                year: new Date().getFullYear(),
              }),
              // also call monthly here if not already
              reports.getMonthlyTransactions({
                groupId: id as string,
                year: new Date().getFullYear(),
              }),
              reports.getBalanceSheet({ groupId: id as string }),
              reports.getFinesReport({
                groupId: id as string,
                year: new Date().getFullYear(),
              }),
              reports.getLoanAnalysisReport({
                groupId: id as string,
                year: new Date().getFullYear(),
              }),
            ]);
          if (mounted) {
            setSummary(summaryData);
            const mappedMonthly = (monthlyRaw || []).map((m: any) => ({
              month: Number(m.month)
                ? [
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
                  ][Number(m.month) - 1]
                : `M${m.month}`,
              contributions: m.total || 0,
              expenses: m.expenses || 0,
            }));
            setMonthlyData(mappedMonthly || monthlyData);
            setBalanceSheet(balanceData);
            setFinesReport(finesData);
            setLoanReport(loanData);
          }
        } catch (e) {
          // ignore overview subfetch failures
        }
        // Goals
        try {
          const gres = await goalsHook.getGroupGoals(id as string);
          if (mounted)
            setChamaData((prev: any) => ({
              ...prev,
              goals: gres || gres?.data || [],
            }));
        } catch (e) {}

        // Communications (prefetch messages for the Communications tab)
        try {
          await commsHook.getMessages(id as string);
          if (mounted)
            setChamaData((prev: any) => ({
              ...prev,
              messages: commsHook.messages || [],
            }));
        } catch (e) {}

        // Fine rules (for Settings / Fines)
        try {
          const fr = await fineRuleHook.getGroupFineRules(id as string);
          if (mounted)
            setChamaData((prev: any) => ({
              ...prev,
              fineRules: fineRuleHook.fineRules || fr || [],
            }));
        } catch (e) {}
        try {
          // There's no dedicated getDocuments in the hook; use the endpoint via fetch as a simple client-side call
          const token = (await (groupHook as any).getById)
            ? await await fetch("/api/auth/token")
                .then((r) => r.text())
                .catch(() => "")
            : "";
          try {
            const tokenStored =
              typeof window !== "undefined"
                ? localStorage.getItem("token")
                : null;
            const docsResp = await fetch(
              `${
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:3080"
              }/api/v1/groups/${id}/documents`,
              {
                headers: tokenStored
                  ? { Authorization: `Bearer ${tokenStored}` }
                  : undefined,
              }
            );
            if (docsResp.ok) {
              const docsJson = await docsResp.json();
              if (mounted)
                setChamaData((prev: any) => ({
                  ...prev,
                  documents: docsJson.data || [],
                }));
            }
          } catch (e) {
            // ignore
          }
        } catch (e) {}
      } catch (err: any) {
        if (mounted) setError(err?.message || "Failed to load chama data");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    { id: "members", label: "Members", icon: <Users className="h-4 w-4" /> },
    {
      id: "contributions",
      label: "Contributions",
      icon: <Landmark className="h-4 w-4" />,
    },
    { id: "income", label: "Income", icon: <ArrowUp className="h-4 w-4" /> },
    { id: "loans", label: "Loans", icon: <HandCoins className="h-4 w-4" /> },
    {
      id: "expenses",
      label: "Expenses",
      icon: <ArrowDown className="h-4 w-4" />,
    },
    {
      id: "fines",
      label: "Fines",
      icon: <CircleDollarSign className="h-4 w-4" />,
    },
    { id: "goals", label: "Goals", icon: <Target className="h-4 w-4" /> },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  // Safely render member-like values which may be strings or objects
  const displayName = (val: any) => {
    if (val == null) return "Unknown";
    if (typeof val === "string") return val;
    if (typeof val === "number") return String(val);
    if (typeof val === "object") {
      // common shapes: { name, fullName, firstName }
      return val.name ?? val.fullName ?? val.firstName ?? JSON.stringify(val);
    }
    return String(val);
  };

  const handleUploadDocument = async (data: {
    title: string;
    content: string;
    type?: string;
  }) => {
    try {
      await (groupHook as any).uploadDocument(id as string, data as any);
      // refresh documents
      const tokenStored =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const docsResp = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3080"
        }/api/v1/groups/${id}/documents`,
        {
          headers: tokenStored
            ? { Authorization: `Bearer ${tokenStored}` }
            : undefined,
        }
      );
      if (docsResp.ok) {
        const docsJson = await docsResp.json();
        setChamaData((prev: any) => ({
          ...prev,
          documents: docsJson.data || [],
        }));
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleCreatePolicy = async (data: {
    name: string;
    type: string;
    content: any;
  }) => {
    try {
      await (groupHook as any).createPolicy(id as string, {
        name: data.name,
        type: data.type as any,
        content: data.content,
      });
      // refresh policies via hook
      await (groupHook as any).getPolicies(id as string);
      setChamaData((prev: any) => ({
        ...prev,
        policies: (groupHook as any).policies || [],
      }));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleInitiateClosure = async (data: {
    closureDate: string;
    reason: string;
  }) => {
    try {
      await (groupHook as any).initiateGroupClosure(id as string, data as any);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F4F4F7] dark:bg-[#1A1C1E]">
      <div className="w-full bg-[#1C2634] dark:bg-[#2C3542] pb-32 -mt-16 relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 grid-pattern pointer-events-none z-0"></div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--secondary)]/5 pointer-events-none z-0"></div>

        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 pt-24 lg:px-10 xl:px-20 relative z-10">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-5 md:grid-cols-9 gap-2 overflow-x-auto overflow-y-hidden">
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
        </div>
      </div>
      <main className="flex-grow w-full relative z-10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 pt-6 lg:-mt-28">
          {loading && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Loading group data...
            </div>
          )}
          {error && (
            <div className="p-6 text-center text-sm text-destructive">
              Error loading group: {error}
            </div>
          )}

          {/* Tab Content */}
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && (
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
                          <div className="text-muted-foreground text-sm">
                            Total Amount
                          </div>
                          <div className="text-xl font-bold">
                            {formatCurrency(
                              summary?.totalAmount ?? chamaData.totalValue ?? 0
                            )}
                          </div>
                        </div>
                        <div className="bg-[#F0FDF4] dark:bg-[#1F2E1D] p-4 rounded-lg">
                          <div className="text-muted-foreground text-sm">
                            Contributions
                          </div>
                          <div className="text-xl font-bold">
                            {formatCurrency(
                              summary?.contributionAmount ??
                                chamaData.contributions ??
                                0
                            )}
                          </div>
                        </div>
                        <div className="bg-[#FEF2F2] dark:bg-[#2D1A1A] p-4 rounded-lg">
                          <div className="text-muted-foreground text-sm">
                            Expenses
                          </div>
                          <div className="text-xl font-bold">
                            {formatCurrency(
                              summary?.expenseAmount ?? chamaData.expenses ?? 0
                            )}
                          </div>
                        </div>
                        <div className="bg-[#FFFBEB] dark:bg-[#2E240D] p-4 rounded-lg">
                          <div className="text-muted-foreground text-sm">
                            Loans
                          </div>
                          <div className="text-xl font-bold">
                            {formatCurrency(
                              summary?.loanAmount ?? chamaData.loans ?? 0
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contribution vs Expenses Chart */}
                      <div className="mt-6">
                        <h3 className="font-semibold mb-4">
                          Contributions vs Expenses
                        </h3>
                        <div className="h-64">
                          {Array.isArray(monthlyData) &&
                          monthlyData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={monthlyData}
                                margin={{
                                  top: 5,
                                  right: 20,
                                  left: -10,
                                  bottom: 5,
                                }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "hsl(var(--background))",
                                    border: "1px solid hsl(var(--border))",
                                  }}
                                />
                                <Legend />
                                <Line
                                  type="monotone"
                                  dataKey="contributions"
                                  stroke="#3B82F6"
                                  strokeWidth={2}
                                  name="Contributions"
                                />
                                <Line
                                  type="monotone"
                                  dataKey="expenses"
                                  stroke="#EF4444"
                                  strokeWidth={2}
                                  name="Expenses"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                              No financial data available
                            </div>
                          )}
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
                              {Array.isArray(chamaData.recentTransactions) &&
                            chamaData.recentTransactions.map((tx: any) => (
                              <TableRow key={tx.id}>
                                <TableCell className="font-medium" dataLabel="Member">
                                  {getMemberDisplay(tx, chamaData)}
                                </TableCell>
                                <TableCell dataLabel="Type">
                                  {displayName(
                                    tx.transactionType ??
                                      tx.type ??
                                      tx.transaction
                                  )}
                                </TableCell>
                                <TableCell
                                  dataLabel="Amount"
                                  className={
                                    tx.transactionType ===
                                      TransactionType.CONTRIBUTION ||
                                    tx.transactionType ===
                                      TransactionType.REPAYMENT ||
                                    tx.transactionType ===
                                      TransactionType.INCOME
                                      ? "text-green-500"
                                      : "text-red-500"
                                  }
                                >
                                  {formatCurrency(
                                    Number(tx.amount ?? tx.value ?? 0)
                                  )}
                                </TableCell>
                                <TableCell className="text-right" dataLabel="Date">
                                  {formatDateWithTime(
                                    tx.date || tx.createdAt || tx.timestamp
                                  )}
                                </TableCell>
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
                      {chamaData.goals.map((goal: any) => (
                        <div key={goal.id}>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{goal.title}</span>
                            <span className="text-muted-foreground">
                              {formatCurrency(goal.currentAmount || 0)}/
                              {formatCurrency(goal.targetAmount || 0)}
                            </span>
                          </div>
                          <Progress
                            value={
                              (goal.currentAmount / goal.targetAmount) * 100
                            }
                            className="h-2"
                          />
                          <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                            <span>
                              Target: {formatDateWithTime(goal.deadline)}
                            </span>
                            <span>
                              {Math.round((goal.current / goal.target) * 100) ||
                                0}
                              %
                            </span>
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
                      {chamaData.upcomingEvents.map((event: any) => (
                        <div key={event.id} className="flex items-start gap-4">
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                            <div className="text-center text-sm font-bold">
                              {new Date(event.date).toLocaleString("default", {
                                month: "short",
                              })}
                            </div>
                            <div className="text-center text-xl font-bold">
                              {new Date(event.date).getDate()}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {event.location}
                            </div>
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
                  {/* <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Top Contributors
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {chamaData.members.slice(0, 3).map((member, index) => (
                        <div key={member?.id ?? index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{(member && member.name) ? String(member.name).charAt(0) : "?"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member?.name ?? 'Unknown'}</div>
                              <div className="text-sm text-muted-foreground">{member?.role ?? 'Member'}</div>
                            </div>
                          </div>
                          <div className="font-bold">{formatCurrency(Number(member?.contributions ?? 0))}</div>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="w-full">
                        View All Members
                      </Button>
                    </CardFooter>
                  </Card> */}
                </div>
              </div>
            )}

            {/* Members Tab (moved to component) */}
            {activeTab === "members" && (
              <div>
                <MembersTab group={chamaData} />
              </div>
            )}

            {/* Contributions Tab */}
            {activeTab === "contributions" && (
              <div>
                <ContributionsTab group={chamaData} />
              </div>
            )}

            {/* Income Tab (moved to component) */}
            {activeTab === "income" && (
              <div>
                <IncomeTab group={chamaData} />
              </div>
            )}

            {/* Loans Tab (moved to component) */}
            {activeTab === "loans" && (
              <div>
                <LoansTab group={chamaData} />
              </div>
            )}

            {/* Expenses Tab (moved to component) */}
            {activeTab === "expenses" && (
              <div>
                <ExpensesTab group={chamaData} />
              </div>
            )}

            {/* Fines Tab (moved to component) */}
            {activeTab === "fines" && (
              <div>
                <FinesTab group={chamaData} />
              </div>
            )}

            {activeTab === "goals" && (
              <div>
                <GoalsTab group={chamaData} />
              </div>
            )}

            {/* Placeholder for other tabs */}
            {activeTab !== "overview" &&
              activeTab !== "members" &&
              activeTab !== "contributions" &&
              activeTab !== "income" &&
              activeTab !== "loans" &&
              activeTab !== "expenses" &&
              activeTab !== "goals" &&
              activeTab !== "fines" && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                    {tabs.find((t) => t.id === activeTab)?.icon}
                  </div>
                  <h2 className="text-xl font-bold mb-2">
                    {tabs.find((t) => t.id === activeTab)?.label} Dashboard
                  </h2>
                  <p className="text-muted-foreground mb-6 text-center">
                    This section is under development. You'll be able to manage
                    all{" "}
                    {typeof activeTab === "string"
                      ? activeTab.toLowerCase()
                      : String(activeTab)}{" "}
                    here.
                  </p>
                  <Button>
                    Explore Features
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
          </>
        </div>
      </main>
      <footer className="w-full p-4 text-center text-xs text-muted-foreground">
        © 2025 Chama Connect. All rights reserved.
      </footer>
    </div>
  );
}
