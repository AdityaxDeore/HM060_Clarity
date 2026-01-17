"use client";

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { MoodSelector } from '@/components/mood/mood-selector';
import { MoodHistoryChart } from '@/components/mood/mood-history-chart';
import { useMood } from '@/context/mood-context';
import type { Mood } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const moodFormSchema = z.object({
  mood: z.enum(['sad', 'neutral', 'happy', 'excited', 'calm']),
  note: z.string().min(3, "A small note can provide great context!").max(500),
});

type MoodFormValues = z.infer<typeof moodFormSchema>;

export default function MoodPage() {
  const { moods, addMood } = useMood();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const { control, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm<MoodFormValues>({
    resolver: zodResolver(moodFormSchema),
    defaultValues: {
      mood: 'happy',
      note: '',
    },
  });

  const onSubmit = (data: MoodFormValues) => {
    addMood(data);
    toast({
      title: "Mood logged!",
      description: `Your ${data.mood} mood has been saved.`,
    });
    reset();
  };
  
  const moodByDate = moods.reduce((acc, mood) => {
    acc[format(mood.date, 'yyyy-MM-dd')] = mood;
    return acc;
  }, {} as Record<string, Mood>);

  const selectedMood = selectedDate ? moodByDate[format(selectedDate, 'yyyy-MM-dd')] : null;

  return (
    <main className="flex-1 flex flex-col p-4 md:p-6 gap-6">
      <header>
        <h1 className="font-headline text-3xl font-bold">Mood Journal</h1>
        <p className="text-muted-foreground">Track your emotional landscape.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline">How are you feeling today?</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                name="mood"
                control={control}
                render={({ field }) => (
                  <MoodSelector value={field.value} onChange={field.onChange} />
                )}
              />
              <Controller
                name="note"
                control={control}
                render={({ field }) => (
                  <Textarea placeholder="What's on your mind?" {...field} />
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Mood'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="font-headline">Mood Calendar</CardTitle>
                <CardDescription>Select a date to see your mood entry.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-4 items-center justify-center">
                 <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    modifiers={{
                      happy: moods.filter(m => m.mood === 'happy').map(m => m.date),
                      sad: moods.filter(m => m.mood === 'sad').map(m => m.date),
                      neutral: moods.filter(m => m.mood === 'neutral').map(m => m.date),
                      calm: moods.filter(m => m.mood === 'calm').map(m => m.date),
                      excited: moods.filter(m => m.mood === 'excited').map(m => m.date),
                    }}
                    modifiersClassNames={{
                      happy: 'bg-green-200 dark:bg-green-800 rounded-full',
                      sad: 'bg-indigo-200 dark:bg-indigo-800 rounded-full',
                      neutral: 'bg-gray-200 dark:bg-gray-700 rounded-full',
                      calm: 'bg-blue-200 dark:bg-blue-800 rounded-full',
                      excited: 'bg-yellow-200 dark:bg-yellow-800 rounded-full',
                    }}
                />
                {selectedMood && (
                    <div className="p-4 bg-muted rounded-lg flex-1">
                        <h4 className="font-bold">{format(selectedMood.date, 'MMMM d, yyyy')}</h4>
                        <p>Mood: <span className="capitalize font-medium">{selectedMood.mood}</span></p>
                        <p className="mt-2 text-sm">{selectedMood.note}</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
      <div className="w-full">
        <MoodHistoryChart />
      </div>
    </main>
  );
}
