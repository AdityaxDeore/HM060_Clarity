import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NodeButtonProps {
  href: string;
  icon: LucideIcon;
  label: string;
  className?: string;
}

export function NodeButton({ href, icon: Icon, label, className }: NodeButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={cn("relative z-10", className)}
    >
      <Link href={href} className="flex flex-col items-center gap-2 group">
        <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-card rounded-full shadow-lg border-2 border-transparent group-hover:border-primary transition-colors duration-300">
           <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse group-hover:animate-none opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <Icon className="w-8 h-8 md:w-10 md:h-10 text-primary transition-transform duration-300 group-hover:scale-110" />
        </div>
        <span className="font-headline text-lg font-semibold text-foreground">{label}</span>
      </Link>
    </motion.div>
  );
}
