'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
<<<<<<< Updated upstream
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { GrainGradient, grainGradientPresets } from '@paper-design/shaders-react';
=======
import { useAuth } from '@/context/auth-context';
import { motion } from 'framer-motion';
>>>>>>> Stashed changes
import { AppLogo } from '@/components/app-logo';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Skip onboarding for now, redirect to dashboard
      router.push('/dashboard');
    }
  }, [user, router]);

<<<<<<< Updated upstream
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      age: '' as any,
=======
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative flex flex-col items-center gap-4"
      >
        <AppLogo />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-sm"
        >
          Setting up your experience...
        </motion.p>
      </motion.div>
    </div>
  );
}
>>>>>>> Stashed changes
      mainGoal: '',
      biggestStruggle: '',
    },
  });

  const onSubmit = (data: OnboardingFormValues) => {
    setUser(data);
    completeOnboarding();
    router.push('/dashboard');
  };

  const nextStep = async () => {
    const fields = steps[currentStep].fields;
    const output = await form.trigger(fields as any, { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(step => step + 1);
    } else {
      await form.handleSubmit(onSubmit)();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  };

  if (isOnboarded === undefined || isOnboarded) {
    return (
      <div className="flex h-screen items-center justify-center relative">
        <div data-darkreader-ignore>
          <GrainGradient
            {...grainGradientPresets[0]}
            style={{ position: "fixed", inset: 0, zIndex: -10 }}
          />
        </div>
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative">
      <div data-darkreader-ignore>
        <GrainGradient
          {...grainGradientPresets[0]}
          style={{ position: "fixed", inset: 0, zIndex: -10 }}
        />
      </div>
      <div className="absolute top-8">
        <AppLogo />
      </div>
      <Card className="w-full max-w-lg shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="mb-4" />
          <CardTitle className="font-headline text-2xl">{steps[currentStep].title}</CardTitle>
          <CardDescription>Let's personalize your NeuroFlow experience.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 0 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>What's your name?</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Alex" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>How old are you?</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g., 28" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {currentStep === 1 && (
                    <FormField
                      control={form.control}
                      name="mainGoal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What's your primary goal right now?</FormLabel>
                          <FormControl>
                            <Textarea placeholder="e.g., I want to build a consistent morning routine to feel more energized." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {currentStep === 2 && (
                    <FormField
                      control={form.control}
                      name="biggestStruggle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What's your biggest struggle affecting this goal?</FormLabel>
                          <FormControl>
                            <Textarea placeholder="e.g., I struggle with procrastination and getting distracted by my phone." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </form>
          </Form>
        </CardContent>
        <div className="p-6 pt-0 flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
            Back
          </Button>
          <Button onClick={nextStep}>
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
