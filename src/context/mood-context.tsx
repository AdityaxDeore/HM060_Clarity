"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Mood } from '@/lib/types';
import { initialMoods } from '@/lib/data';

interface MoodContextType {
  moods: Mood[];
  addMood: (mood: Omit<Mood, 'id' | 'date'>) => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export function MoodProvider({ children }: { children: ReactNode }) {
  const [moods, setMoods] = useState<Mood[]>(initialMoods);

  const addMood = (mood: Omit<Mood, 'id' | 'date'>) => {
    const newMood: Mood = {
      ...mood,
      id: new Date().toISOString(),
      date: new Date(),
    };
    setMoods(prev => [newMood, ...prev]);
  };

  return (
    <MoodContext.Provider value={{ moods, addMood }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
}
