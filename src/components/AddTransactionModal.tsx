import { useState, FormEvent } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { useTransactions } from '@/contexts/TransactionContext';
import { TransactionType } from '@/types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EXPENSE_CATEGORIES = [
  'Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 
  'Lazer', 'Compras', 'Contas', 'Outros'
];

const INCOME_CATEGORIES = [
  'Salário', 'Freelance', 'Investimentos', 'Vendas', 'Bônus', 'Outros'
];

export function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addTransaction } = useTransactions();

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    
    if (!amount || !category || !description) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError('O valor deve ser maior que zero');
      return;
    }

    try {
      setLoading(true);
      console.log('Iniciando adição de transação...');
      
      await addTransaction({
        type,
        amount: parseFloat(amount),
        category,
        description,
        date
      });
      
      console.log('Transação adicionada, resetando formulário...');
      
      // Reset form
      setAmount('');
      setCategory('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setError('');
      onClose();
    } catch (error: any) {
      console.error('Erro capturado no componente:', error);
      setError(error.message || 'Erro ao adicionar transação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Nova Transação</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Type Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`p-4 rounded-xl border-2 transition ${
                type === 'income'
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <TrendingUp className={`w-6 h-6 mx-auto mb-2 ${
                type === 'income' ? 'text-emerald-600' : 'text-slate-400'
              }`} />
              <span className={`font-semibold ${
                type === 'income' ? 'text-emerald-700' : 'text-slate-600'
              }`}>
                Receita
              </span>
            </button>

            <button
              type="button"
              onClick={() => setType('expense')}
              className={`p-4 rounded-xl border-2 transition ${
                type === 'expense'
                  ? 'border-red-500 bg-red-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <TrendingDown className={`w-6 h-6 mx-auto mb-2 ${
                type === 'expense' ? 'text-red-600' : 'text-slate-400'
              }`} />
              <span className={`font-semibold ${
                type === 'expense' ? 'text-red-700' : 'text-slate-600'
              }`}>
                Despesa
              </span>
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Valor
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-lg font-semibold"
                placeholder="0,00"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descrição
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              placeholder="Ex: Compras no supermercado"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Data
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition shadow-lg ${
              type === 'income'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-200'
                : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-red-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? 'Adicionando...' : 'Adicionar Transação'}
          </button>
        </form>
      </div>
    </div>
  );
}
