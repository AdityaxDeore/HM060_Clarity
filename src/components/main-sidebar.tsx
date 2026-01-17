"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BrainCircuit,
  LayoutDashboard,
  Smile,
  CircleDollarSign,
  Repeat,
  BookText,
  Sparkles,
  CalendarCheck,
  PanelLeft,
  Settings,
  User,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@/context/user-context";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { AppLogo } from "./app-logo";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/mood", icon: Smile, label: "Mood" },
  { href: "/money", icon: CircleDollarSign, label: "Money" },
  { href: "/habits", icon: Repeat, label: "Habits" },
  { href: "/journal", icon: BookText, label: "Journal" },
  { href: "/insights", icon: Sparkles, label: "Insights" },
  { href: "/review", icon: CalendarCheck, label: "Daily Review" },
];

export function MainSidebar() {
  const { user } = useUser();
  const pathname = usePathname();
  
  const navContent = (
    <>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start px-4 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname.startsWith(item.href) && "bg-muted text-primary"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.name}`} />
              <AvatarFallback>{user?.name?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{user?.name ?? 'User'}</span>
              <span className="text-xs text-muted-foreground">{user?.mainGoal ? `Goal: ${user.mainGoal.substring(0,20)}...`: ''}</span>
            </div>
          </div>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden border-r bg-muted/40 md:flex md:flex-col w-64">
        <div className="flex h-16 items-center border-b px-6">
          <AppLogo />
        </div>
        {navContent}
      </aside>
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0">
             <div className="flex h-16 items-center border-b px-6">
               <AppLogo />
            </div>
            {navContent}
          </SheetContent>
        </Sheet>
        <div className="flex-1">
          <h1 className="font-headline text-xl font-semibold">
            {navItems.find(item => pathname.startsWith(item.href))?.label}
          </h1>
        </div>
      </header>
    </>
  );
}
