"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { FocusRing } from '@/components/dashboard/focus-ring';
import { useMood } from '@/context/mood-context';
import { useHabit } from '@/context/habit-context';

export default function FocusPage() {
  const { moods } = useMood();
  const { habits } = useHabit();

  const { moodScore, habitScore, tips } = useMemo(() => {
    const moodScore = moods.length > 0 ? (moods[0].mood === 'happy' || moods[0].mood === 'excited' ? 1 : (moods[0].mood === 'calm' || moods[0].mood === 'neutral' ? 0.6 : 0.2)) * 50 : 25;
    const habitsCompleted = habits.filter(h => h.completedToday).length;
    const totalHabits = habits.length;
    const habitScore = totalHabits > 0 ? (habitsCompleted / totalHabits) * 50 : 25;

    let tips = [];
    if (moodScore < 30) {
        tips.push({ title: "Boost Your Mood", description: "Consider activities that lift your spirits, like listening to music, talking to a friend, or spending time in nature." });
    }
    if (habitScore < 30 && totalHabits > 0) {
        tips.push({ title: "Strengthen Your Habits", description: "Focus on completing one small habit today. Consistency builds momentum." });
    }
    if(tips.length === 0){
        tips.push({ title: "Keep Up the Great Work!", description: "You're doing great. Continue to be mindful of your mood and consistent with your habits." });
    }

    return { moodScore: Math.round(moodScore), habitScore: Math.round(habitScore), tips };
  }, [moods, habits]);


  return (
    <main className="flex-1 flex flex-col items-center p-4 md:p-6 gap-6">
      <header className="text-center">
        <h1 className="font-headline text-3xl font-bold">Focus Score Breakdown</h1>
        <p className="text-muted-foreground">See what's contributing to your focus today.</p>
      </header>

      <div className="my-8">
        <FocusRing />
      </div>

      <div className="w-full max-w-2xl space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Score Contribution</CardTitle>
                <CardDescription>How each area of your life impacts your focus.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <div className="flex justify-between mb-2">
                        <span className="font-medium">Mood</span>
                        <span className="text-primary font-semibold">+{moodScore} pts</span>
                    </div>
                    <Slider defaultValue={[moodScore]} max={50} disabled />
                </div>
                <div>
                    <div className="flex justify-between mb-2">
                        <span className="font-medium">Habits</span>
                        <span className="text-accent font-semibold">+{habitScore} pts</span>
                    </div>
                    <Slider defaultValue={[habitScore]} max={50} disabled className="[&>div>span]:bg-accent"/>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Improvement Tips</CardTitle>
                <CardDescription>Actionable advice to boost your focus score.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tips.map((tip, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold">{tip.title}</h4>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </div>
              ))}
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
