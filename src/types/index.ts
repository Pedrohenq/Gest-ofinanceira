export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO format
  createdAt: number;
}

export interface CreateTransactionData {
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CategoryTotal {
  category: string;
  total: number;
  color: string;
}
