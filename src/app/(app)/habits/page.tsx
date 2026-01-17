import { AddHabit } from '@/components/habits/add-habit';
import { HabitList } from '@/components/habits/habit-list';

export default function HabitsPage() {
  return (
    <main className="flex-1 flex flex-col p-4 md:p-6 gap-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold">Habit Architect</h1>
          <p className="text-muted-foreground">Build the person you want to be, one habit at a time.</p>
        </div>
        <AddHabit />
      </header>
      
      <HabitList />
    </main>
  );
}
