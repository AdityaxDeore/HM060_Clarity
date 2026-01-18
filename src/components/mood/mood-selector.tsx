"use client";

import { Smile, Meh, Frown, Sun, Snowflake } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Mood } from '@/lib/types';

const moodOptions = [
  { mood: 'excited', icon: Sun, color: 'text-yellow-500', label: 'Excited' },
  { mood: 'happy', icon: Smile, color: 'text-green-500', label: 'Happy' },
  { mood: 'neutral', icon: Meh, color: 'text-gray-500', label: 'Neutral' },
  { mood: 'calm', icon: Snowflake, color: 'text-blue-500', label: 'Calm' },
  { mood: 'sad', icon: Frown, color: 'text-indigo-500', label: 'Sad' },
] as const;

interface MoodSelectorProps {
  value: Mood['mood'];
  onChange: (mood: Mood['mood']) => void;
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="flex justify-around items-center p-4 bg-muted rounded-lg">
      {moodOptions.map(option => (
        <button
          key={option.mood}
          type="button"
          onClick={() => onChange(option.mood)}
          className={cn(
            "flex flex-col items-center gap-2 p-2 rounded-lg transition-all duration-200 transform hover:scale-110",
            value === option.mood ? 'bg-background shadow-md' : 'opacity-60 hover:opacity-100'
          )}
        >
          <option.icon className={cn("w-10 h-10", option.color)} />
          <span className="text-xs font-medium">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
