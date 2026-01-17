"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useJournal } from '@/context/journal-context';
import { getDecisionJournalInsights } from '@/ai/flows/decision-journal-insights';
import type { Insight } from '@/lib/types';
import { Sparkles, Lightbulb } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function InsightsPage() {
  const { decisions } = useJournal();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setError(null);
    setInsights([]);

    try {
      const input = {
        entries: decisions.map(({ decision, reason, feeling }) => ({ decision, reason, feeling })),
      };
      const result = await getDecisionJournalInsights(input);
      setInsights(result.insights);
    } catch (e) {
      setError("Failed to generate insights. Please try again later.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col p-4 md:p-6 gap-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold">AI Insights Engine</h1>
          <p className="text-muted-foreground">Discover hidden patterns in your decision-making.</p>
        </div>
        <Button onClick={handleGenerateInsights} disabled={isLoading || decisions.length < 2}>
          {isLoading ? 'Analyzing...' : 'Generate Insights'}
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </header>

      {error && <p className="text-destructive">{error}</p>}
      
      {insights.length === 0 && !isLoading && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Ready for your insights?</h3>
            <p className="mt-1 text-sm text-muted-foreground">Click "Generate Insights" to let our AI analyze your journal.</p>
            {decisions.length < 2 && <p className="mt-1 text-sm text-muted-foreground">You need at least 2 decision entries to generate insights.</p>}
          </div>
        </div>
      )}

      {isLoading && (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-card/40 backdrop-blur-sm border-border/40">
                <CardHeader>
                  <Skeleton className="h-5 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                   <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
         </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight, index) => (
          <Card key={index} className="flex flex-col bg-card/40 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="text-primary"/>
                Pattern: {insight.pattern}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold mb-1">Explanation</h4>
                <p className="text-sm text-muted-foreground mb-4">{insight.explanation}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Suggestion</h4>
                <p className="text-sm text-muted-foreground">{insight.suggestion}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
