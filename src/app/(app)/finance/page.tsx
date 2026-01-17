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
  serverTimestamp,
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
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import type { Transaction } from '@/lib/types';

const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Shopping', 'Other'];
const emotionTags = ['Stressed', 'Happy', 'Impulsive', 'Planned', 'Necessary', 'Guilty'];

export default function FinancePage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    category: '',
    amount: '',
    description: '',
    emotionTag: '',
  });

  useEffect(() => {
    if (!user) return;
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, 'finances'),
        where('uid', '==', user.uid),
        orderBy('date', 'desc')
      );
      const docs = await getDocs(q);
      setTransactions(docs.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Transaction)));
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.category || !formData.amount) return;

    try {
      await addDoc(collection(db, 'finances'), {
        uid: user.uid,
        type: formData.type,
        category: formData.category,
        amount: parseFloat(formData.amount),
        description: formData.description,
        emotionTag: formData.emotionTag,
        date: Date.now(),
        createdAt: Date.now(),
      });
      setFormData({
        type: 'expense',
        category: '',
        amount: '',
        description: '',
        emotionTag: '',
      });
      setShowForm(false);
      fetchTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyData = transactions
    .filter((t) => t.date > Date.now() - 30 * 24 * 60 * 60 * 1000)
    .reduce((acc, t) => {
      const date = new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const existing = acc.find((d: any) => d.date === date);
      if (existing) {
        if (t.type === 'income') existing.income += t.amount;
        else existing.expense += t.amount;
      } else {
        acc.push({
          date,
          income: t.type === 'income' ? t.amount : 0,
          expense: t.type === 'expense' ? t.amount : 0,
        });
      }
      return acc;
    }, [] as any[])
    .reverse();

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8 overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Finance</h1>
          <p className="text-muted-foreground">Track income and expenses with emotional awareness</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </motion.div>

      {/* Add Transaction Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={formData.type} onValueChange={(value) =>
                    setFormData({ ...formData, type: value as 'income' | 'expense' })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Emotion Tag</Label>
                  <Select value={formData.emotionTag} onValueChange={(value) =>
                    setFormData({ ...formData, emotionTag: value })
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select emotion" />
                    </SelectTrigger>
                    <SelectContent>
                      {emotionTags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="What was this for?"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Add</Button>
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Income</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${totalIncome.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-500 opacity-60" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-3xl font-bold text-red-600">
                    ${totalExpense.toFixed(2)}
                  </p>
                </div>
                <TrendingDown className="h-10 w-10 text-red-500 opacity-60" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Net Balance</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ${(totalIncome - totalExpense).toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Chart */}
          {monthlyData.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                30-Day Trend
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f1f1f', border: 'none', borderRadius: '8px' }}
                  />
                  <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Recent Transactions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              Recent Transactions
            </h2>
            {transactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No transactions yet. Add one to get started!
              </p>
            ) : (
              <div className="space-y-2">
                {transactions.slice(0, 10).map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{t.category}</p>
                      <p className="text-sm text-muted-foreground">{t.description}</p>
                      {t.emotionTag && (
                        <span className="text-xs text-muted-foreground mt-1">
                          {t.emotionTag}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-lg font-semibold ${
                        t.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
