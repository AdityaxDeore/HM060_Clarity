"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Habit } from '@/lib/types';
import { initialHabits } from '@/lib/data';

interface HabitContextType {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'progress' | 'streak' | 'completedToday'>) => void;
  toggleHabit: (habitId: string) => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);

  const addHabit = (habit: Omit<Habit, 'id' | 'progress' | 'streak' | 'completedToday'>) => {
    const newHabit: Habit = {
      ...habit,
      id: new Date().toISOString(),
      progress: 0,
      streak: 0,
      completedToday: false,
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const toggleHabit = (habitId: string) => {
    setHabits(prev =>
      prev.map(habit => {
        if (habit.id === habitId) {
          const completed = !habit.completedToday;
          return {
            ...habit,
            completedToday: completed,
            streak: completed ? habit.streak + 1 : Math.max(0, habit.streak - 1),
            progress: completed ? habit.progress + 1 : Math.max(0, habit.progress - 1),
          };
        }
        return habit;
      })
    );
  };

  return (
    <HabitContext.Provider value={{ habits, addHabit, toggleHabit }}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabit() {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabit must be used within a HabitProvider');
  }
  return context;
}
