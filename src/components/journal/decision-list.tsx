"use client";

import { useJournal } from '@/context/journal-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

export function DecisionList() {
  const { decisions } = useJournal();

  return (
    <Card className="bg-card/40 backdrop-blur-sm border-border/40">
      <CardHeader>
        <CardTitle className="font-headline">Decision History</CardTitle>
        <CardDescription>A log of your past choices and reflections.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {decisions.map(decision => (
              <div key={decision.id} className="p-4 border rounded-lg">
                <p className="font-semibold">{decision.decision}</p>
                <p className="text-sm text-muted-foreground mt-1">{decision.reason}</p>
                <div className="flex justify-between items-center mt-2 text-xs">
                    <span>Feeling: <span className="font-medium">{decision.feeling}</span></span>
                    <span>{format(decision.date, 'MMM d, yyyy')}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
