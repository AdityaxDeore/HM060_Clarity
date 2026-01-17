"use client";

import { useMemo } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useMood } from '@/context/mood-context';
import type { Mood } from '@/lib/types';
import { format } from 'date-fns';

const moodToValue = {
  sad: 1,
  calm: 2,
  neutral: 3,
  happy: 4,
  excited: 5,
};

const valueToLabel = ["", "Sad", "Calm", "Neutral", "Happy", "Excited"];

export function MoodHistoryChart() {
  const { moods } = useMood();

  const chartData = useMemo(() => {
    return moods
      .slice(0, 30) // Limit to last 30 entries for performance
      .map(mood => ({
        date: format(mood.date, 'MMM d'),
        value: moodToValue[mood.mood],
        note: mood.note
      }))
      .reverse();
  }, [moods]);

  return (
    <Card className="bg-card/40 backdrop-blur-sm border-border/40">
      <CardHeader>
        <CardTitle className="font-headline">Mood Fluctuation</CardTitle>
        <CardDescription>Your mood trend over the last entries.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--foreground))" />
              <YAxis
                stroke="hsl(var(--foreground))"
                domain={[0, 6]}
                ticks={[1, 2, 3, 4, 5]}
                tickFormatter={(value) => valueToLabel[value]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value, name, props) => [`${valueToLabel[value as number]}: ${props.payload.note}`, '']}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 8, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
