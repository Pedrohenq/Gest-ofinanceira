import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import { Transaction, CreateTransactionData, FinancialSummary } from '@/types';

interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  summary: FinancialSummary;
  addTransaction: (data: CreateTransactionData) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  filterByMonth: (month: number, year: number) => Transaction[];
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions deve ser usado dentro de TransactionProvider');
  }
  return context;
}

export function TransactionProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // REAL-TIME UPDATES com onSnapshot
  useEffect(() => {
    if (!currentUser) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    console.log('🔍 Iniciando listener para usuário:', currentUser.uid);

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log('📦 Snapshot recebido! Total de documentos:', snapshot.size);
        
        const transactionsData: Transaction[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          console.log('📄 Documento encontrado:', doc.id, data);
          
          transactionsData.push({
            id: doc.id,
            ...data
          } as Transaction);
        });
        
        // Ordenar por data no cliente
        transactionsData.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });
        
        console.log('✅ Transações carregadas:', transactionsData.length);
        setTransactions(transactionsData);
        setLoading(false);
      },
      (error) => {
        console.error('❌ Erro no snapshot:', error);
        setLoading(false);
      }
    );

    return () => {
      console.log('🔌 Desconectando listener');
      unsubscribe();
    };
  }, [currentUser]);

  // Calcular resumo financeiro
  const summary: FinancialSummary = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.totalIncome += transaction.amount;
      } else {
        acc.totalExpense += transaction.amount;
      }
      acc.balance = acc.totalIncome - acc.totalExpense;
      return acc;
    },
    { totalIncome: 0, totalExpense: 0, balance: 0 }
  );

  async function addTransaction(data: CreateTransactionData) {
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const docData = {
        userId: currentUser.uid,
        type: data.type,
        amount: Number(data.amount),
        category: data.category,
        description: data.description,
        date: data.date,
        createdAt: Timestamp.now().toMillis()
      };

      console.log('Tentando adicionar transação:', docData);

      const docRef = await addDoc(collection(db, 'transactions'), docData);
      
      console.log('Transação adicionada com sucesso! ID:', docRef.id);
    } catch (error: any) {
      console.error('Erro detalhado ao adicionar transação:', error);
      console.error('Código do erro:', error.code);
      console.error('Mensagem:', error.message);
      
      if (error.code === 'permission-denied') {
        throw new Error('Permissão negada. Verifique as regras do Firestore.');
      } else if (error.code === 'unavailable') {
        throw new Error('Firestore indisponível. Verifique sua conexão.');
      } else {
        throw new Error(`Erro ao adicionar transação: ${error.message}`);
      }
    }
  }

  async function deleteTransaction(id: string) {
    await deleteDoc(doc(db, 'transactions', id));
  }

  function filterByMonth(month: number, year: number): Transaction[] {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === month &&
        transactionDate.getFullYear() === year
      );
    });
  }

  const value = {
    transactions,
    loading,
    summary,
    addTransaction,
    deleteTransaction,
    filterByMonth
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
