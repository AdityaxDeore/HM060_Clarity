import { Mood, Transaction, Habit, Decision } from './types';

export const initialMoods: Mood[] = [
  { id: '1', date: new Date(new Date().setDate(new Date().getDate() - 4)), mood: 'happy', note: 'Productive day at work.' },
  { id: '2', date: new Date(new Date().setDate(new Date().getDate() - 3)), mood: 'neutral', note: 'Just a regular day.' },
  { id: '3', date: new Date(new Date().setDate(new Date().getDate() - 2)), mood: 'sad', note: 'Feeling a bit down.' },
  { id: '4', date: new Date(new Date().setDate(new Date().getDate() - 1)), mood: 'calm', note: 'Relaxing evening.' },
];

export const initialTransactions: Transaction[] = [
  { id: '1', date: new Date(), type: 'income', category: 'Salary', amount: 3000, description: 'Monthly salary' },
  { id: '2', date: new Date(), type: 'expense', category: 'Food', amount: 75, description: 'Groceries' },
  { id: '3', date: new Date(), type: 'expense', category: 'Transport', amount: 50, description: 'Gas' },
  { id: '4', date: new Date(), type: 'expense', category: 'Entertainment', amount: 30, description: 'Cinema' },
];

export const initialHabits: Habit[] = [
  { id: '1', name: 'Read 10 pages', icon: 'BookOpen', goal: 7, progress: 4, streak: 12, completedToday: false },
  { id: '2', name: 'Meditate 15 mins', icon: 'Heart', goal: 7, progress: 5, streak: 5, completedToday: true },
  { id: '3', name: 'Exercise', icon: 'Dumbbell', goal: 4, progress: 2, streak: 3, completedToday: false },
  { id: '4', name: 'Drink 8 glasses of water', icon: 'GlassWater', goal: 7, progress: 6, streak: 20, completedToday: true },
];

export const initialDecisions: Decision[] = [
  { id: '1', date: new Date(), decision: 'Start a new side project', reason: 'To learn a new skill and potentially earn extra income.', feeling: 'Excited' },
  { id: '2', date: new Date(new Date().setDate(new Date().getDate() - 1)), decision: 'Decided to decline a social invitation', reason: 'Needed time to rest and recharge.', feeling: 'Relieved' },
];
