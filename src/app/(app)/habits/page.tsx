'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, CheckCircle2, Circle, Flame } from 'lucide-react';
import type { Habit, HabitLog } from '@/lib/types';

const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'];

export default function HabitsPage() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<(Habit & { id: string; streak?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily' as 'daily' | 'weekly' | 'monthly',
    frequencyCount: '1',
    color: colors[0],
  });

  useEffect(() => {
    if (!user) return;
    fetchHabits();
  }, [user]);

  const fetchHabits = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, 'habits'),
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const docs = await getDocs(q);
      const habitsData = await Promise.all(
        docs.docs.map(async (doc) => {
          const data = doc.data() as Habit;
          
          // Calculate streak
          const logsQuery = query(
            collection(db, 'habitLogs'),
            where('habitId', '==', doc.id),
            orderBy('date', 'desc')
          );
          const logDocs = await getDocs(logsQuery);
          let streak = 0;
          let expectedDate = new Date();
          
          for (const logDoc of logDocs.docs) {
            const log = logDoc.data() as HabitLog;
            if (!log.completed) break;
            const logDate = new Date(log.date);
            if (logDate.toDateString() === expectedDate.toDateString()) {
              streak++;
              expectedDate.setDate(expectedDate.getDate() - 1);
            } else {
              break;
            }
          }
          
          return { id: doc.id, ...data, streak };
        })
      );
      setHabits(habitsData);
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.name) return;

    try {
      await addDoc(collection(db, 'habits'), {
        uid: user.uid,
        name: formData.name,
        description: formData.description,
        icon: '🎯',
        color: formData.color,
        frequency: formData.frequency,
        frequencyCount: parseInt(formData.frequencyCount),
        difficulty: 3, // Start at medium difficulty
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      setFormData({
        name: '',
        description: '',
        frequency: 'daily',
        frequencyCount: '1',
        color: colors[0],
      });
      setShowForm(false);
      fetchHabits();
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const handleToggleHabit = async (habitId: string) => {
    if (!user) return;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const logsQuery = query(
        collection(db, 'habitLogs'),
        where('habitId', '==', habitId),
        where('date', '==', today.getTime())
      );
      const logs = await getDocs(logsQuery);
      
      if (logs.empty) {
        // Create new log
        await addDoc(collection(db, 'habitLogs'), {
          uid: user.uid,
          habitId,
          date: today.getTime(),
          completed: true,
          createdAt: Date.now(),
        });
      } else {
        // Toggle existing log
        const logDoc = logs.docs[0];
        await updateDoc(doc(db, 'habitLogs', logDoc.id), {
          completed: !(logDoc.data() as HabitLog).completed,
        });
      }
      fetchHabits();
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  const checkCompletedToday = async (habitId: string) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const logsQuery = query(
        collection(db, 'habitLogs'),
        where('habitId', '==', habitId),
        where('date', '==', today.getTime())
      );
      const logs = await getDocs(logsQuery);
      return logs.empty ? false : (logs.docs[0].data() as HabitLog).completed;
    } catch {
      return false;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8 overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Habits</h1>
          <p className="text-muted-foreground">Build consistent patterns with streak tracking</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Habit
        </Button>
      </motion.div>

      {/* Add Habit Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Habit Name</Label>
                <Input
                  placeholder="e.g., Morning Meditation"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Why is this habit important to you?"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select value={formData.frequency} onValueChange={(value) =>
                    setFormData({ ...formData, frequency: value as 'daily' | 'weekly' | 'monthly' })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Times per {formData.frequency}</Label>
                  <Input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.frequencyCount}
                    onChange={(e) =>
                      setFormData({ ...formData, frequencyCount: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 ${color} rounded-full transition-transform ${
                        formData.color === color ? 'ring-2 ring-offset-2 ring-offset-background' : ''
                      }`}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Create</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Habits List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {habits.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No habits yet. Create one to get started!</p>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {habits.map((habit) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className={`p-6 border-l-4 ${habit.color.replace('500', '600')} border-l-current`}>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {habit.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {habit.frequencyCount}x {habit.frequency}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleHabit(habit.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Circle className="h-5 w-5" />
                        </Button>
                      </div>

                      {habit.description && (
                        <p className="text-sm text-muted-foreground">
                          {habit.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <Flame className="h-4 w-4 text-orange-500" />
                          <span className="text-sm font-medium text-foreground">
                            {habit.streak || 0} day streak
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Difficulty: {habit.difficulty}/5
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
