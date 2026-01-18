import { BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <BrainCircuit className="h-7 w-7 text-primary" />
      <span className="font-headline text-2xl font-bold text-foreground">
        NeuroFlow
      </span>
    </div>
  );
}
