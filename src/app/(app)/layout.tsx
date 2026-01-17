"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/hooks/use-onboarding';
import { MainSidebar } from '@/components/main-sidebar';
import { GridBackground } from '@/components/dashboard/grid-background';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOnboarded } = useOnboarding();
  const router = useRouter();

  useEffect(() => {
    if (isOnboarded === false) {
      router.replace('/onboarding');
    }
  }, [isOnboarded, router]);

  if (isOnboarded === undefined || !isOnboarded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <GridBackground />
      <MainSidebar />
      <div className="flex flex-col flex-1">
        {children}
      </div>
    </div>
  );
}
