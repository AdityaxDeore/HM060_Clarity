"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Transaction } from '@/lib/types';
import { initialTransactions } from '@/lib/data';

interface MoneyContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
}

const MoneyContext = createContext<MoneyContextType | undefined>(undefined);

export function MoneyProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: new Date().toISOString(),
      date: new Date(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  return (
    <MoneyContext.Provider value={{ transactions, addTransaction }}>
      {children}
    </MoneyContext.Provider>
  );
}

export function useMoney() {
  const context = useContext(MoneyContext);
  if (context === undefined) {
    throw new Error('useMoney must be used within a MoneyProvider');
  }
  return context;
}
