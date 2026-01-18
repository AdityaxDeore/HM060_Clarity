"use client";

import { useMemo } from 'react';
import { useMood } from '@/context/mood-context';
import { useHabit } from '@/context/habit-context';

export function FocusRing() {
  const { moods } = useMood();
  const { habits } = useHabit();

  const focusScore = useMemo(() => {
    // Simplified calculation for demo purposes
    const moodScore = moods.length > 0 ? (moods[0].mood === 'happy' || moods[0].mood === 'excited' ? 1 : 0.5) * 50 : 25;
    const habitsCompleted = habits.filter(h => h.completedToday).length;
    const totalHabits = habits.length;
    const habitScore = totalHabits > 0 ? (habitsCompleted / totalHabits) * 50 : 25;
    return Math.round(moodScore + habitScore);
  }, [moods, habits]);

  const circumference = 2 * Math.PI * 70; // 70 is the radius

  return (
    <div className="relative flex items-center justify-center w-48 h-48 md:w-56 md:h-56">
      <svg className="absolute w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="70"
          stroke="hsl(var(--muted))"
          strokeWidth="12"
          fill="transparent"
          className="text-gray-700"
        />
        <circle
          cx="50%"
          cy="50%"
          r="70"
          stroke="url(#gradient)"
          strokeWidth="12"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (focusScore / 100) * circumference}
          className="transition-all duration-1000 ease-in-out"
        />
        <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--accent))" />
                <stop offset="100%" stopColor="hsl(var(--primary))" />
            </linearGradient>
        </defs>
      </svg>
      <div className="z-10 text-center">
        <span className="font-headline text-5xl md:text-6xl font-bold text-foreground">
          {focusScore}
        </span>
        <p className="text-sm font-medium text-muted-foreground">Focus Score</p>
      </div>
    </div>
  );
}
