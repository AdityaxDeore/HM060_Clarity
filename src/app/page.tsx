"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GrainGradient, grainGradientPresets } from '@paper-design/shaders-react';
import { Button } from '@/components/ui/button';

interface GrainHeroSectionProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  onCtaClick: () => void;
  isLoading?: boolean;
}

function GrainHeroSection({
  title,
  subtitle,
  ctaLabel,
  onCtaClick,
  isLoading,
}: GrainHeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div data-darkreader-ignore>
        <GrainGradient
          {...grainGradientPresets[0]}
          style={{ position: "fixed", inset: 0, zIndex: -10 }}
        />
      </div>
      
      <div className="text-center px-6 sm:px-8 max-w-4xl mx-auto">
        <h1 
          role="heading" 
          className="text-4xl sm:text-6xl font-bold text-white mb-6"
        >
          {title}
        </h1>
        
        <p className="max-w-2xl text-lg sm:text-xl text-gray-200 mx-auto mb-8">
          {subtitle}
        </p>
        
        <Button 
          onClick={onCtaClick}
          size="lg"
          className="text-lg px-8 py-3 bg-white text-black hover:bg-gray-100"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent mr-2" />
              Loading...
            </>
          ) : (
            ctaLabel
          )}
        </Button>
      </div>
    </section>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = () => {
    setIsLoading(true);
    router.push('/auth/signin');
  };

  return (
    <GrainHeroSection
      title="Welcome to NeuroFlow"
      subtitle="Your cognitive operating system for a more intentional life."
      ctaLabel="Begin Your Journey"
      onCtaClick={handleNavigation}
      isLoading={isLoading}
    />
  );
}

