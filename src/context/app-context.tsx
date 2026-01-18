"use client";

import React, { ReactNode } from 'react';
import { UserProvider } from './user-context';
import { MoodProvider } from './mood-context';
import { MoneyProvider } from './money-context';
import { HabitProvider } from './habit-context';
import { JournalProvider } from './journal-context';

export function AppContextProvider({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <MoodProvider>
        <MoneyProvider>
          <HabitProvider>
            <JournalProvider>
              {children}
            </JournalProvider>
          </HabitProvider>
        </MoneyProvider>
      </MoodProvider>
    </UserProvider>
  );
}
