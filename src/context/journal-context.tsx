"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Decision } from '@/lib/types';
import { initialDecisions } from '@/lib/data';

interface JournalContextType {
  decisions: Decision[];
  addDecision: (decision: Omit<Decision, 'id' | 'date'>) => void;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export function JournalProvider({ children }: { children: ReactNode }) {
  const [decisions, setDecisions] = useState<Decision[]>(initialDecisions);

  const addDecision = (decision: Omit<Decision, 'id' | 'date'>) => {
    const newDecision: Decision = {
      ...decision,
      id: new Date().toISOString(),
      date: new Date(),
    };
    setDecisions(prev => [newDecision, ...prev]);
  };

  return (
    <JournalContext.Provider value={{ decisions, addDecision }}>
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal() {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
}
