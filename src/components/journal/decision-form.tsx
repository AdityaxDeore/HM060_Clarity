"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useJournal } from '@/context/journal-context';

const formSchema = z.object({
  decision: z.string().min(5, "Be a bit more specific about your decision."),
  reason: z.string().min(10, "Explain your reasoning."),
  feeling: z.string().min(2, "How did you feel?"),
});

type DecisionFormValues = z.infer<typeof formSchema>;

export function DecisionForm() {
  const [open, setOpen] = useState(false);
  const { addDecision } = useJournal();
  const form = useForm<DecisionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { decision: '', reason: '', feeling: '' },
  });

  const onSubmit = (data: DecisionFormValues) => {
    addDecision(data);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Log New Decision</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log a New Decision</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="decision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>The Decision</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Decided to learn Next.js" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reasoning</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Why did you make this decision?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="feeling"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feeling at the Time</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Excited, anxious, confident" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Save Decision</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
