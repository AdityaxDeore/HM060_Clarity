import { DecisionForm } from '@/components/journal/decision-form';
import { DecisionList } from '@/components/journal/decision-list';

export default function JournalPage() {
  return (
    <main className="flex-1 flex flex-col p-4 md:p-6 gap-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold">Decision Journal</h1>
          <p className="text-muted-foreground">Understand your choices, improve your life.</p>
        </div>
        <DecisionForm />
      </header>

      <DecisionList />
    </main>
  );
}
