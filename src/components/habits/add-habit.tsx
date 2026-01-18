"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { icons } from 'lucide-react';
import { useHabit } from '@/context/habit-context';

const formSchema = z.object({
  name: z.string().min(2, "Habit name is too short."),
  goal: z.coerce.number().min(1).max(7),
  icon: z.string().min(1, "Please select an icon."),
});

type HabitFormValues = z.infer<typeof formSchema>;

export function AddHabit() {
  const [open, setOpen] = useState(false);
  const { addHabit } = useHabit();
  const form = useForm<HabitFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', goal: 7, icon: '' },
  });

  const onSubmit = (data: HabitFormValues) => {
    addHabit(data);
    form.reset();
    setOpen(false);
  };

  const LucideIcon = ({ name }: { name: string }) => {
    const Icon = icons[name as keyof typeof icons];
    return Icon ? <Icon className="w-4 h-4" /> : null;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Habit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Habit</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habit Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Read for 15 minutes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weekly Goal</FormLabel>
                  <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={String(field.value)}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Times per week" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[...Array(7)].map((_, i) => (
                        <SelectItem key={i} value={String(i + 1)}>{i + 1} time(s) a week</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select an icon" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(icons).slice(0, 50).map(iconName => ( // limit for perf
                        <SelectItem key={iconName} value={iconName}>
                          <div className="flex items-center gap-2">
                            <LucideIcon name={iconName} /> {iconName}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Add Habit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
