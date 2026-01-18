export type User = {
  name: string;
  age: number;
  mainGoal: string;
  biggestStruggle: string;
};

export type Mood = {
  id: string;
  date: Date;
  mood: 'sad' | 'neutral' | 'happy' | 'excited' | 'calm';
  note: string;
};

export type Transaction = {
  id: string;
  date: Date;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
};

export type Habit = {
  id: string;
  name: string;
  icon: string;
  goal: number; // e.g., 7 times a week
  progress: number;
  streak: number;
  completedToday: boolean;
};

export type Decision = {
  id: string;
  date: Date;
  decision: string;
  reason: string;
  feeling: string;
  outcome?: string;
};

export type Insight = {
  pattern: string;
  explanation: string;
  suggestion: string;
};
