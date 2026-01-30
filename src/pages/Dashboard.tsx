import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactions } from '@/contexts/TransactionContext';
import { LogOut, Plus, TrendingUp, TrendingDown, Wallet, User } from 'lucide-react';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { TransactionList } from '@/components/TransactionList';
import { ExpenseByCategory, MonthlyFlow } from '@/components/Charts';

export function Dashboard() {
  const { currentUser, logout } = useAuth();
  const { summary, loading, transactions } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log('🎯 Dashboard - Estado atual:', {
    loading,
    transactionsCount: transactions.length,
    summary,
    currentUser: currentUser?.uid
  });

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      alert('Erro ao sair');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">GestãoFinanceira</h1>
                <p className="text-xs text-slate-500">Seu controle financeiro</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg">
                <User className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-700 font-medium">
                  {currentUser?.email?.split('@')[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Balance */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl p-6 shadow-xl shadow-slate-300/50 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 text-sm font-medium">Saldo Total</span>
              <Wallet className="w-5 h-5 text-slate-300" />
            </div>
            <p className="text-3xl font-bold mb-1">
              {loading ? '...' : formatCurrency(summary.balance)}
            </p>
            <p className="text-xs text-slate-400">Receitas - Despesas</p>
          </div>

          {/* Income */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border-2 border-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm font-medium">Receitas</span>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-600">
              {loading ? '...' : formatCurrency(summary.totalIncome)}
            </p>
          </div>

          {/* Expenses */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border-2 border-red-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm font-medium">Despesas</span>
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {loading ? '...' : formatCurrency(summary.totalExpense)}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ExpenseByCategory />
          <MonthlyFlow />
        </div>

        {/* Transactions List */}
        <TransactionList />

        {/* FAB - Floating Action Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full shadow-2xl shadow-emerald-300/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-50"
        >
          <Plus className="w-6 h-6" />
        </button>
      </main>

      {/* Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
