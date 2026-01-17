"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useMood } from '@/context/mood-context';
import { useHabit } from '@/context/habit-context';
import { useMoney } from '@/context/money-context';
import { useJournal } from '@/context/journal-context';
import { generateDailySummaryAndSuggestions } from '@/ai/flows/daily-review-summary-suggestions';
import { Loader2, RefreshCw } from 'lucide-react';

export default function DailyReviewPage() {
  const { moods } = useMood();
  const { habits } = useHabit();
  const { transactions } = useMoney();
  const { decisions } = useJournal();
  
  const [summary, setSummary] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const generateReview = async () => {
    setIsLoading(true);
    setError(null);

    const moodData = moods.length > 0 ? `Today's mood was ${moods[0].mood}. Note: ${moods[0].note}` : 'No mood logged today.';
    const habitData = `Completed habits: ${habits.filter(h => h.completedToday).map(h => h.name).join(', ') || 'None'}.`;
    const spendingData = `Total expenses: $${transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}.`;
    const decisionData = decisions.length > 0 ? `Made a decision about: ${decisions[0].decision}.` : 'No major decisions logged today.';
    
    try {
      const result = await generateDailySummaryAndSuggestions({
        mood: moodData,
        habits: habitData,
        spending: spendingData,
        decisions: decisionData,
      });
      setSummary(result.summary);
      setSuggestions(result.suggestions);
    } catch (e) {
      setError("Failed to generate daily review. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateReview();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex-1 flex flex-col p-4 md:p-6 gap-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold">Your Daily Review</h1>
          <p className="text-muted-foreground">An AI-powered summary of your day.</p>
        </div>
        <Button onClick={generateReview} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Regenerate
        </Button>
      </header>

      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Reflecting on your day...</p>
          </div>
        </div>
      )}

      {error && <p className="text-destructive">{error}</p>}
      
      {!isLoading && !error && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Today's Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{summary || "Click 'Regenerate' to get your daily summary."}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Personalized Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{suggestions || "Suggestions will appear here."}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
