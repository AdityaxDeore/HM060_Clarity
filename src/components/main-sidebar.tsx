'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  ListChecks,
  BookOpen,
  Lightbulb,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { AppLogo } from './app-logo';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/finance', icon: Wallet, label: 'Finance' },
  { href: '/habits', icon: ListChecks, label: 'Habits' },
  { href: '/journal', icon: BookOpen, label: 'Journal' },
  { href: '/insights', icon: Lightbulb, label: 'Insights' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function MainSidebar() {
  const { userProfile, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/signin');
  };

  const navContent = (
    <>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <motion.div
              key={item.label}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto h-2 w-2 rounded-full bg-primary-foreground"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <div className="border-t border-border p-4 space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={`https://avatar.vercel.sh/${userProfile?.email}`}
              alt={userProfile?.displayName}
            />
            <AvatarFallback>
              {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">
              {userProfile?.displayName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {userProfile?.email}
            </p>
          </div>
        </div>
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full justify-start"
          size="sm"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 border-r border-border bg-card h-screen">
        <div className="flex h-16 items-center border-b border-border px-6">
          <AppLogo />
        </div>
        {navContent}
      </aside>

      {/* Mobile Navigation */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden fixed top-4 left-4 z-40">
          <Button size="icon" variant="outline">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 flex flex-col">
          <div className="flex h-16 items-center border-b border-border px-6">
            <AppLogo />
          </div>
          {navContent}
        </SheetContent>
      </Sheet>
    </>
  );
}
