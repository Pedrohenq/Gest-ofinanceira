import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useTransactions } from '@/contexts/TransactionContext';
import { TrendingDown, BarChart3 } from 'lucide-react';

const COLORS = [
  '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
];

export function ExpenseByCategory() {
  const { transactions } = useTransactions();

  // Agrupar despesas por categoria
  const expensesByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, transaction) => {
      const existing = acc.find((item) => item.category === transaction.category);
      if (existing) {
        existing.value += transaction.amount;
      } else {
        acc.push({
          category: transaction.category,
          value: transaction.amount
        });
      }
      return acc;
    }, [] as { category: string; value: number }[])
    .sort((a, b) => b.value - a.value);

  if (expensesByCategory.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-bold text-slate-900">Despesas por Categoria</h2>
        </div>
        <div className="py-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingDown className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">Nenhuma despesa registrada</p>
          <p className="text-sm text-slate-400 mt-1">Adicione despesas para visualizar o gráfico</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingDown className="w-5 h-5 text-slate-600" />
        <h2 className="text-lg font-bold text-slate-900">Despesas por Categoria</h2>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={expensesByCategory}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props: any) => `${props.category} ${((props.percent || 0) * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {expensesByCategory.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: any) => formatCurrency(Number(value) || 0)} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {expensesByCategory.slice(0, 6).map((item, index) => (
          <div key={item.category} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm text-slate-600 truncate">{item.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MonthlyFlow() {
  const { transactions } = useTransactions();

  // Agrupar por mês
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, income: 0, expense: 0 };
    }
    
    if (transaction.type === 'income') {
      acc[monthKey].income += transaction.amount;
    } else {
      acc[monthKey].expense += transaction.amount;
    }
    
    return acc;
  }, {} as Record<string, { month: string; income: number; expense: number }>);

  const chartData = Object.values(monthlyData)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6); // Últimos 6 meses

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-bold text-slate-900">Fluxo Mensal</h2>
        </div>
        <div className="py-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">Nenhum dado disponível</p>
          <p className="text-sm text-slate-400 mt-1">Adicione transações para visualizar o fluxo</p>
        </div>
      </div>
    );
  }

  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-slate-600" />
        <h2 className="text-lg font-bold text-slate-900">Fluxo Mensal</h2>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="month"
            tickFormatter={formatMonth}
            stroke="#64748b"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            tickFormatter={formatCurrency}
            stroke="#64748b"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            formatter={(value: any) => formatCurrency(Number(value) || 0)}
            labelFormatter={(label: any) => formatMonth(String(label))}
          />
          <Bar dataKey="income" fill="#10b981" name="Receitas" radius={[8, 8, 0, 0]} />
          <Bar dataKey="expense" fill="#ef4444" name="Despesas" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
