import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Pencil, Trash2, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { useTransactions } from '@/contexts/TransactionContext';
import { Transaction } from '@/types';
import { EditTransactionModal } from './EditTransactionModal';

export function TransactionList() {
  const { transactions, deleteTransaction } = useTransactions();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  console.log('📋 TransactionList - Transações recebidas:', transactions);

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  console.log('🔍 TransactionList - Após filtro:', filteredTransactions);

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  async function handleDelete(id: string, description: string) {
    if (window.confirm(`Deseja realmente excluir "${description}"?`)) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        alert('Erro ao excluir transação');
      }
    }
  }

  function handleEdit(transaction: Transaction) {
    setEditingTransaction(transaction);
  }

  function handleCloseEdit() {
    setEditingTransaction(null);
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Transações</h2>
          <span className="text-sm text-slate-500">
            {filteredTransactions.length} {filteredTransactions.length === 1 ? 'item' : 'itens'}
          </span>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('income')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'income'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Receitas
          </button>
          <button
            onClick={() => setFilter('expense')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'expense'
                ? 'bg-red-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Despesas
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[500px] overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Nenhuma transação encontrada</p>
            <p className="text-sm text-slate-400 mt-1">
              {filter !== 'all' 
                ? 'Tente outro filtro' 
                : 'Adicione sua primeira transação'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onDelete={handleDelete}
                onEdit={handleEdit}
                formatCurrency={formatCurrency}
              />
            ))}
          </div>
        )}
      </div>

      <EditTransactionModal
        isOpen={Boolean(editingTransaction)}
        transaction={editingTransaction}
        onClose={handleCloseEdit}
      />
    </div>
  );
}

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string, description: string) => void;
  onEdit: (transaction: Transaction) => void;
  formatCurrency: (value: number) => string;
}

function TransactionItem({ transaction, onDelete, onEdit, formatCurrency }: TransactionItemProps) {
  const isIncome = transaction.type === 'income';

  return (
    <div className="p-4 hover:bg-slate-50 transition group">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
          isIncome ? 'bg-emerald-100' : 'bg-red-100'
        }`}>
          {isIncome ? (
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-600" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">
                {transaction.description}
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">
                {transaction.category}
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              <p className={`font-bold text-lg ${
                isIncome ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {format(new Date(transaction.date), "dd 'de' MMM", { locale: ptBR })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => onEdit(transaction)}
            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(transaction.id, transaction.description)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
