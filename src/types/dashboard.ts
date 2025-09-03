export type Member = {
  id?: string;
  name?: string;
  role?: string;
  joined?: string;
  contributions?: number;
  user?: { id?: string; email?: string } | null;
}

export type Transaction = {
  id?: string;
  member?: any;
  type?: string;
  amount?: number;
  date?: string;
}

export type Loan = {
  id?: string;
  member?: any;
  amount?: number;
  interestRate?: number;
  disbursedDate?: string;
  dueDate?: string;
  status?: string;
}

export type Expense = {
  id?: string;
  date?: string;
  item?: any;
  category?: any;
  amount?: number;
}

export type Fine = {
  id?: string;
  date?: string;
  member?: any;
  reason?: any;
  amount?: number;
  status?: string;
}

export type ChamaData = {
  id?: string | null;
  name?: string;
  status?: string;
  totalValue?: number;
  membersCount?: number;
  contributions?: number;
  expenses?: number;
  loans?: number;
  fines?: number;
  goals?: any[];
  recentTransactions?: Transaction[];
  members?: Member[];
  upcomingEvents?: any[];
  financialData?: any[];
  recentIncome?: any[];
  loansData?: Loan[];
  expensesData?: Expense[];
  finesData?: Fine[];
}

export default {};
