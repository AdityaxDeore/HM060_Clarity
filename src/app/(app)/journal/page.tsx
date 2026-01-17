'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, addDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, BookOpen } from 'lucide-react';
import type { JournalEntry } from '@/lib/types';

export default function JournalPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', valence: 0, energy: 0 });

  useEffect(() => {
    if (!user) return;
    fetchEntries();
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'journals'), where('uid', '==', user.uid), orderBy('date', 'desc'));
      const docs = await getDocs(q);
      setEntries(docs.docs.map((doc) => ({ id: doc.id, ...doc.data() } as JournalEntry)));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.title) return;
    try {
      await addDoc(collection(db, 'journals'), {
        uid: user.uid,
        title: formData.title,
        content: formData.content,
        mood: { valence: formData.valence, energy: formData.energy },
        sentiment: formData.valence,
        tags: [],
        date: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      setFormData({ title: '', content: '', valence: 0, energy: 0 });
      setShowForm(false);
      fetchEntries();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8 overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Journal</h1>
          <p className="text-muted-foreground">Capture thoughts with emotional awareness</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2"><Plus className="h-4 w-4" />New Entry</Button>
      </motion.div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Title</Label><Input placeholder="Entry title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
            <div><Label>Content</Label><Textarea placeholder="What's on your mind?" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={6} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Mood (Valence: {formData.valence})</Label><input type="range" min="-1" max="1" step="0.1" value={formData.valence} onChange={(e) => setFormData({ ...formData, valence: parseFloat(e.target.value) })} className="w-full" /></div>
              <div><Label>Energy: {formData.energy}</Label><input type="range" min="-1" max="1" step="0.1" value={formData.energy} onChange={(e) => setFormData({ ...formData, energy: parseFloat(e.target.value) })} className="w-full" /></div>
            </div>
            <div className="flex gap-2"><Button type="submit">Save</Button><Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button></div>
          </form>
        </Card>
      )}

      {loading ? <div>Loading...</div> : entries.length === 0 ? <Card className="p-12 text-center"><p className="text-muted-foreground">No entries yet</p></Card> : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry.id} className="p-6">
              <h3 className="text-xl font-semibold mb-2">{entry.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{new Date(entry.date).toLocaleDateString()}</p>
              <p className="text-foreground whitespace-pre-wrap">{entry.content}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
