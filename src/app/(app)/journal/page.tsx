"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircleDollarSign, Heart, ChevronRight } from 'lucide-react';
import { MoneyEntry } from '@/components/journal/money-entry';
import { EmotionEntry } from '@/components/journal/emotion-entry';

export default function JournalPage() {
  const [mode, setMode] = useState<'select' | 'money' | 'emotion'>('select');

  if (mode === 'money') {
    return <MoneyEntry onBack={() => setMode('select')} />;
  }

  if (mode === 'emotion') {
    return <EmotionEntry onBack={() => setMode('select')} />;
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 gap-6">
      <div className="text-center mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">Daily Journal</h1>
        <p className="text-muted-foreground mt-2">What would you like to track?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Card 
          className="p-8 cursor-pointer hover:border-emerald-500 hover:bg-emerald-500/5 transition-all group"
          onClick={() => setMode('money')}
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CircleDollarSign className="w-10 h-10 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Money</h2>
              <p className="text-muted-foreground">Track your expenses</p>
            </div>
            <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </div>
        </Card>

        <Card 
          className="p-8 cursor-pointer hover:border-purple-500 hover:bg-purple-500/5 transition-all group"
          onClick={() => setMode('emotion')}
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="w-10 h-10 text-purple-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Emotion</h2>
              <p className="text-muted-foreground">Log how you feel</p>
            </div>
            <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
          </div>
        </Card>
      </div>
    </main>
  );
}
