"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { GrainGradient, grainGradientPresets } from '@paper-design/shaders-react';
import { AppLogo } from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useUser } from '@/context/user-context';
import { useOnboarding } from '@/hooks/use-onboarding';
import { AnimatePresence, motion } from 'framer-motion';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  age: z.coerce.number().min(13, "You must be at least 13 years old."),
  mainGoal: z.string().min(10, "Please describe your goal in a bit more detail."),
  biggestStruggle: z.string().min(10, "Please describe your struggle in a bit more detail."),
});

type OnboardingFormValues = z.infer<typeof formSchema>;

const steps = [
  { id: 'step1', title: 'About You', fields: ['name', 'age'] },
  { id: 'step2', title: 'Your North Star', fields: ['mainGoal'] },
  { id: 'step3', title: 'Your Current Challenge', fields: ['biggestStruggle'] },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const { isOnboarded, completeOnboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOnboarded) {
      router.replace('/dashboard');
    }
  }, [isOnboarded, router]);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      age: '' as any,
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
