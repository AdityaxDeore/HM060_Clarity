"use client";

import Link from 'next/link';
import { useUser } from '@/context/user-context';
import { Button } from '@/components/ui/button';
import { FocusRing } from '@/components/dashboard/focus-ring';
import { NodeButton } from '@/components/dashboard/node-button';
import { Smile, CircleDollarSign, Repeat, BookText, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground">
          Today's You, {user?.name ? user.name.split(' ')[0] : 'Explorer'}
        </h1>
        <p className="text-lg text-muted-foreground mt-2">Here is your cognitive map for today.</p>
      </div>

      <div className="relative w-full max-w-3xl aspect-square flex items-center justify-center">
        {/* Connection Lines */}
        <div className="absolute w-full h-full">
            <svg width="100%" height="100%" viewBox="0 0 500 500" className="opacity-10 dark:opacity-20">
                <path d="M 250,250 L 100,100" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5"/>
                <path d="M 250,250 L 400,100" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5"/>
                <path d="M 250,250 L 100,400" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5"/>
                <path d="M 250,250 L 400,400" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5"/>
            </svg>
        </div>

        <Link href="/focus">
          <FocusRing />
        </Link>
        
        <NodeButton href="/mood" icon={Smile} label="Mood" className="absolute top-0 left-1/4 -translate-x-1/2" />
        <NodeButton href="/money" icon={CircleDollarSign} label="Money" className="absolute top-0 right-1/4 translate-x-1/2" />
        <NodeButton href="/habits" icon={Repeat} label="Habits" className="absolute bottom-0 left-1/4 -translate-x-1/2" />
        <NodeButton href="/journal" icon={BookText} label="Thoughts" className="absolute bottom-0 right-1/4 translate-x-1/2" />
      </div>

      <div className="mt-12 text-center">
        <Button asChild size="lg" className="font-bold">
          <Link href="/review">
            Review My Day <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
