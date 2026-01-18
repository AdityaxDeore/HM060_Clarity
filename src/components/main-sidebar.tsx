"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  PanelLeftClose,
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
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Prefetch all routes on mount for instant navigation
  useEffect(() => {
    navItems.forEach(item => {
      router.prefetch(item.href);
    });
  }, [router]);
  
  const navContent = (
    <>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start px-4 text-sm font-medium">
          {navItems.map((item) => (
            <TooltipProvider key={item.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    prefetch={true}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/5",
                      pathname.startsWith(item.href) && "bg-primary/10 text-primary font-medium shadow-sm",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {!isCollapsed && item.label}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
      </div>
      {!isCollapsed && (
        <div className="mt-auto p-4 border-t border-border/40 backdrop-blur-sm">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors">
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}&backgroundColor=e0e0e0&textColor=ffffff`} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">{user?.name?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{user?.name ?? 'User'}</span>
                <span className="text-xs text-muted-foreground truncate max-w-[140px]">{user?.mainGoal ? `${user.mainGoal.substring(0,20)}...`: 'Set your goal'}</span>
              </div>
            </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <aside className={cn(
        "hidden border-r bg-gradient-to-b from-background via-muted/20 to-background md:flex md:flex-col transition-all duration-300 backdrop-blur-sm",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <div className="flex h-16 items-center border-b border-border/40 px-6 justify-between backdrop-blur-sm">
          {!isCollapsed && <AppLogo />}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "hover:bg-primary/10 transition-colors",
              isCollapsed && "mx-auto"
            )}
          >
            {isCollapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </Button>
        </div>
        {navContent}
      </aside>
      <header className="flex h-14 items-center gap-4 border-b bg-gradient-to-r from-background via-muted/20 to-background backdrop-blur-sm px-6 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="hover:bg-primary/10">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0 bg-gradient-to-b from-background via-muted/20 to-background">
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
