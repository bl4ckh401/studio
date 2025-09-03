import { useState, useMemo } from "react";
import { useAuth } from "./useAuth";
import { endPoints } from "@/lib/api/endpoints";

interface ReportParams {
  groupId: string;
  startDate?: string;
  endDate?: string;
  year?: number;
  asOfDate?: string;
}

interface TransactionSummary {
  totalContributions: number;
  totalLoans: number;
  totalExpenses: number;
  totalIncome: number;
  totalFines: number;
}

interface TransactionByType {
  type: string;
  count: number;
  total: number;
}

interface TransactionByStatus {
  status: string;
  count: number;
  total: number;
}

interface MonthlyTransaction {
  month: number;
  total: number;
  count: number;
}

interface TrialBalance {
  account: string;
  debit: number;
  credit: number;
  balance: number;
}

interface BalanceSheet {
  assets: {
    name: string;
    amount: number;
  }[];
  liabilities: {
    name: string;
    amount: number;
  }[];
  equity: {
    name: string;
    amount: number;
  }[];
}

interface DashboardSummary {
  groups: {
    active: number;
    inactive: number;
    total: number;
  };
  members: {
    byRole: Array<{
      role: string;
      count: number;
    }>;
    total: number;
  };
  financials: {
    trialBalance: {
      accounts: Array<{
        transactionType: string;
        debit: number;
        credit: number;
      }>;
      totals: {
        totalDebit: number;
        totalCredit: number;
      };
    };
    balanceSheet: {
      assets: {
        cash: number;
        loans: number;
        totalAssets: number;
      };
      liabilities: {
        totalLiabilities: number;
      };
      equity: {
        contributions: number;
        earnings: number;
        totalEquity: number;
      };
      totalLiabilitiesAndEquity: number;
      asOfDate: string;
    };
  };
}

interface MemberContributionReport {
  memberName: string;
  totalContributions: number;
  lastContributionDate: string;
  paymentHistory: Array<{
    date: string;
    amount: number;
    status: string;
  }>;
}

interface LoanAnalysisReport {
  totalLoans: number;
  totalRepayments: number;
  outstandingLoans: number;
  loanDetails: Array<{
    memberName: string;
    loanAmount: number;
    disbursementDate: string;
    repaymentStatus: string;
    nextPaymentDate: string;
  }>;
}

interface ExpenseReport {
  totalExpenses: number;
  expensesByCategory: Array<{
    category: string;
    total: number;
    count: number;
  }>;
  recentExpenses: Array<{
    date: string;
    description: string;
    amount: number;
    category: string;
  }>;
}

interface FinesReport {
  totalFines: number;
  totalPaid: number;
  totalOutstanding: number;
  memberFines: Array<{
    memberName: string;
    totalFines: number;
    paidAmount: number;
    outstandingAmount: number;
    fineDetails: Array<{
      date: string;
      reason: string;
      amount: number;
      status: string;
    }>;
  }>;
}

export function useReports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const getTransactionSummary = async (params: ReportParams) => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const res = await fetch(
        endPoints.reports.transactionSummary(
          params.groupId,
          params.startDate,
          params.endDate
        ),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch transaction summary");
      }
      const response = await res.json();
      return response.data as TransactionSummary;
    } catch (error) {
      console.error("Get Transaction Summary Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch transaction summary"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getTransactionsByType = async (params: ReportParams) => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const res = await fetch(
        endPoints.reports.transactionsByType(
          params.groupId,
          params.startDate,
          params.endDate
        ),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch transactions by type");
      }
      const response = await res.json();
      return response.data as TransactionByType[];
    } catch (error) {
      console.error("Get Transactions By Type Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch transactions by type"
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getTransactionsByStatus = async (params: ReportParams) => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const res = await fetch(
        endPoints.reports.transactionsByStatus(
          params.groupId,
          params.startDate,
          params.endDate
        ),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch transactions by status");
      }
      const response = await res.json();
      return response.data as TransactionByStatus[];
    } catch (error) {
      console.error("Get Transactions By Status Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch transactions by status"
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyTransactions = async (params: ReportParams) => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const res = await fetch(
        endPoints.reports.monthlyTransactions(params.groupId, params.year),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch monthly transactions");
      }
      const response = await res.json();
      return response.data as MonthlyTransaction[];
    } catch (error) {
      console.error("Get Monthly Transactions Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch monthly transactions"
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getTrialBalance = async (params: ReportParams) => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const res = await fetch(
        endPoints.reports.trialBalance(
          params.groupId,
          params.startDate,
          params.endDate
        ),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch trial balance");
      }
      const response = await res.json();
      return response.data as TrialBalance[];
    } catch (error) {
      console.error("Get Trial Balance Error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch trial balance"
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getBalanceSheet = async (params: ReportParams) => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const res = await fetch(
        endPoints.reports.balanceSheet(params.groupId, params.asOfDate),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch balance sheet");
      }
      const response = await res.json();
      return response.data as BalanceSheet;
    } catch (error) {
      console.error("Get Balance Sheet Error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch balance sheet"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getDashboardSummary = async (startDate?: string, endDate?: string) => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const res = await fetch(
        endPoints.reports.dashboardSummary(startDate, endDate),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch dashboard summary");
      }
      const response = await res.json();
      return response.data as DashboardSummary;
    } catch (error) {
      console.error("Get Dashboard Summary Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch dashboard summary"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getMemberContributionsReport = async (params: ReportParams) => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const res = await fetch(
        endPoints.reports.memberContributions(
          params.groupId,
          params.startDate,
          params.endDate
        ),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch member contributions report");
      }
      const response = await res.json();
      return response.data as MemberContributionReport[];
    } catch (error) {
      console.error("Get Member Contributions Report Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch member contributions report"
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getLoanAnalysisReport = async (params: ReportParams) => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const res = await fetch(
        endPoints.reports.loanAnalysis(
          params.groupId,
          params.startDate,
          params.endDate
        ),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch loan analysis report");
      }
      const response = await res.json();
      return response.data as LoanAnalysisReport;
    } catch (error) {
      console.error("Get Loan Analysis Report Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch loan analysis report"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getExpenseReport = async (params: ReportParams) => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      if (!token) {
        const msg = "No authentication token available for fetching expense report";
        console.error(msg);
        setError(msg);
        return null;
      }
      // Build and normalize URL (defend against duplicated /api/v1 in env values)
      let url = endPoints.reports.expenses(
        params.groupId,
        params.startDate,
        params.endDate
      );

      // Normalize common misconfiguration: remove duplicate "/api/v1/api/v1"
      url = url.replace(/\/api\/v1\/api\/v1/g, "/api/v1");

      console.debug("Fetching expense report URL:", url);

      const doFetch = async (fetchUrl: string) =>
        await fetch(fetchUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

      let res = await doFetch(url);

      // If server returns 404 try a couple of safe fallbacks without touching backend
      if (res.status === 404) {
        // Candidate 1: remove a duplicated '/api/v1/' segment if present
        const candidate1 = url.replace(/\/api\/v1\//, "/api/");
        if (candidate1 !== url) {
          console.debug("Expense report: retrying with candidate1:", candidate1);
          try {
            res = await doFetch(candidate1);
          } catch (e) {
            // ignore and try next
          }
        }

        // Candidate 2: build from NEXT_PUBLIC_API_URL without the embedded /api/v1
        if (res.status === 404) {
          const base = process.env.NEXT_PUBLIC_API_URL || "";
          if (base) {
            const q = new URLSearchParams();
            q.set("groupId", params.groupId);
            if (params.startDate) q.set("startDate", params.startDate);
            if (params.endDate) q.set("endDate", params.endDate);
            const candidate2 = `${base.replace(/\/$/, "")}/reports/transactions/expenses?${q.toString()}`;
            console.debug("Expense report: retrying with candidate2:", candidate2);
            try {
              res = await doFetch(candidate2);
            } catch (e) {
              // final fallback will surface original 404
            }
          }
        }
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        const msg = `Failed to fetch expense report: ${res.status} ${res.statusText} ${text}`;
        throw new Error(msg);
      }

      const response = await res.json();
      return response.data as ExpenseReport;
    } catch (error) {
      console.error("Get Expense Report Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch expense report"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getFinesReport = async (params: ReportParams) => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const res = await fetch(
        endPoints.reports.fines(
          params.groupId,
          params.startDate,
          params.endDate
        ),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch fines report");
      }
      const response = await res.json();
      return response.data as FinesReport;
    } catch (error) {
      console.error("Get Fines Report Error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch fines report"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return useMemo(
    () => ({
      getTransactionSummary,
      getTransactionsByType,
      getTransactionsByStatus,
      getMonthlyTransactions,
      getTrialBalance,
      getBalanceSheet,
      getDashboardSummary,
      getMemberContributionsReport,
      getLoanAnalysisReport,
      getExpenseReport,
      getFinesReport,
      loading,
      error,
    }),
    [
      getTransactionSummary,
      getTransactionsByType,
      getTransactionsByStatus,
      getMonthlyTransactions,
      getTrialBalance,
      getBalanceSheet,
      getDashboardSummary,
      getMemberContributionsReport,
      getLoanAnalysisReport,
      getExpenseReport,
      getFinesReport,
      loading,
      error,
    ]
  );
}
