"use client";

import { icons, Flame, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useHabit } from '@/context/habit-context';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function HabitList() {
  const { habits, toggleHabit } = useHabit();

  const LucideIcon = ({ name }: { name: string }) => {
    const Icon = icons[name as keyof typeof icons];
    return Icon ? <Icon className="w-8 h-8 text-primary" /> : null;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {habits.map(habit => (
        <Card
          key={habit.id}
          className={cn(
            "p-4 transition-all",
            habit.completedToday ? 'bg-primary/10 border-primary' : ''
          )}
        >
          <CardContent className="p-0 flex items-center gap-4">
            <motion.div whileTap={{ scale: 1.2 }}>
              <Checkbox
                id={`habit-${habit.id}`}
                checked={habit.completedToday}
                onCheckedChange={() => toggleHabit(habit.id)}
                className="w-6 h-6"
              />
            </motion.div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <LucideIcon name={habit.icon} />
                <label
                  htmlFor={`habit-${habit.id}`}
                  className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {habit.name}
                </label>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>{habit.streak} day streak</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span>{habit.progress}/{habit.goal} this week</span>
                </div>
              </div>
              <div>
                <Progress value={(habit.progress / habit.goal) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
