import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/app-logo';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute top-8 left-8">
        <AppLogo />
      </div>
      <div className="w-full max-w-md text-center">
        <div className="relative mb-8">
          <div className="absolute -inset-2">
            <div className="w-full h-full max-w-full mx-auto rotate-180 bg-[conic-gradient(from_90deg_at_50%_50%,#3F51B5_0%,#673AB7_50%,#3F51B5_100%)] opacity-20 blur-3xl"></div>
          </div>
          <h1 className="relative font-headline text-5xl md:text-6xl font-bold text-foreground">
            Welcome to <span className="text-primary">NeuroFlow</span>
          </h1>
        </div>
        <p className="mt-4 mb-8 text-lg text-muted-foreground text-balance">
          Your cognitive operating system for a more intentional life.
        </p>
        <Button asChild size="lg" className="font-bold text-lg">
          <Link href="/onboarding">Begin Your Journey</Link>
        </Button>
      </div>
      <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} NeuroFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}
