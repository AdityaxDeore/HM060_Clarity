import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NodeButtonProps {
  href: string;
  icon: LucideIcon;
  label: string;
  className?: string;
  color?: 'purple' | 'emerald' | 'orange' | 'cyan';
}

const colorClasses = {
  purple: {
    border: 'group-hover:border-purple-500',
    bg: 'bg-purple-500/10',
    text: 'text-purple-500'
  },
  emerald: {
    border: 'group-hover:border-emerald-500',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-500'
  },
  orange: {
    border: 'group-hover:border-orange-500',
    bg: 'bg-orange-500/10',
    text: 'text-orange-500'
  },
  cyan: {
    border: 'group-hover:border-cyan-500',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-500'
  }
};

export function NodeButton({ href, icon: Icon, label, className, color = 'purple' }: NodeButtonProps) {
  const colors = colorClasses[color];
  
  return (
    <div className={cn("relative z-10", className)}>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="origin-center"
      >
      <Link href={href} className="flex flex-col items-center gap-2 group">
        <div className={cn("relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-card rounded-full shadow-lg border-2 border-transparent transition-colors duration-300", colors.border)}>
           <div className={cn("absolute inset-0 rounded-full animate-pulse group-hover:animate-none opacity-50 group-hover:opacity-100 transition-opacity", colors.bg)}></div>
          <Icon className={cn("w-8 h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110", colors.text)} />
        </div>
        <span className="font-headline text-lg font-semibold text-foreground">{label}</span>
      </Link>
      </motion.div>
    </div>
  );
}
