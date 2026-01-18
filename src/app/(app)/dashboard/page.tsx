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
    <main className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden min-h-screen">
        <div className="text-center mb-6">
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
            Today's You, {user?.name ? user.name.split(' ')[0] : 'Explorer'}
          </h1>
          <p className="text-base text-muted-foreground mt-1">Here is your cognitive map for today.</p>
        </div>

      <div className="relative w-full max-w-2xl h-[400px] md:h-[450px] flex items-center justify-center mx-auto">
        {/* Connection Lines */}
        <div className="absolute w-full h-full">
            <svg width="100%" height="100%" viewBox="0 0 500 500" className="opacity-10 dark:opacity-20">
                <path d="M 250,250 L 125,125" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5"/>
                <path d="M 250,250 L 375,125" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5"/>
                <path d="M 250,250 L 125,375" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5"/>
                <path d="M 250,250 L 375,375" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5"/>
            </svg>
        </div>

        <Link href="/focus" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <FocusRing />
        </Link>
        
        <NodeButton href="/mood" icon={Smile} label="Mood" className="absolute top-[20%] left-[20%] -translate-x-1/2 -translate-y-1/2" />
        <NodeButton href="/money" icon={CircleDollarSign} label="Money" className="absolute top-[20%] left-[80%] -translate-x-1/2 -translate-y-1/2" />
        <NodeButton href="/habits" icon={Repeat} label="Habits" className="absolute top-[80%] left-[20%] -translate-x-1/2 -translate-y-1/2" />
        <NodeButton href="/journal" icon={BookText} label="Thoughts" className="absolute top-[80%] left-[80%] -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="mt-6 text-center">
        <Button asChild size="lg" className="font-bold">
          <Link href="/review">
            Review My Day <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
