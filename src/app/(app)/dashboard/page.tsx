'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Brain, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import type { CognitiveMetrics, Transaction, MoodLog } from '@/lib/types';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<CognitiveMetrics | null>(null);
  const [moodTrend, setMoodTrend] = useState<any[]>([]);
  const [spendingData, setSpendingData] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        // For now, create demo data
        // In production, this would fetch from Cloud Functions computing real metrics
        setMetrics({
          uid: user.uid,
          date: Date.now(),
          cognitiveLoadScore: 62,
          lifeCoherenceScore: 74,
          habitFragilityRisk: 28,
          burnoutWarning: false,
          keyInsight: 'Your mood has been stable despite increased spending patterns.',
          updatedAt: Date.now(),
        });

        // Fetch recent mood logs
        const moodQuery = query(
          collection(db, 'moodLogs'),
          where('uid', '==', user.uid),
          orderBy('date', 'desc'),
          limit(7)
        );
        const moodDocs = await getDocs(moodQuery);
        const moodData = moodDocs.docs
          .map((doc) => {
            const data = doc.data() as MoodLog;
            return {
              date: new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              valence: Math.round((data.valence + 1) * 50), // Convert -1..1 to 0..100
              energy: Math.round((data.energy + 1) * 50),
            };
          })
          .reverse();
        setMoodTrend(moodData);

        // Fetch spending by category
        const transactionQuery = query(
          collection(db, 'finances'),
          where('uid', '==', user.uid),
          where('type', '==', 'expense'),
          orderBy('date', 'desc'),
          limit(50)
        );
        const transDocs = await getDocs(transactionQuery);
        const categorySpending: Record<string, number> = {};
        transDocs.docs.forEach((doc) => {
          const data = doc.data() as Transaction;
          categorySpending[data.category] = (categorySpending[data.category] || 0) + data.amount;
        });
        const spending = Object.entries(categorySpending).map(([name, value]) => ({
          name,
          value,
        }));
        setSpendingData(spending);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const COLORS = ['#3F51B5', '#673AB7', '#9C27B0', '#E91E63', '#2196F3'];

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8 overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Your cognitive operating system</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-muted rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Key Metrics */}
          <motion.div
            variants={container}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <motion.div variants={item}>
              <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Cognitive Load
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {metrics?.cognitiveLoadScore}
                    </p>
                  </div>
                  <Brain className="h-10 w-10 text-blue-500 opacity-60" />
                </div>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Life Coherence
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {metrics?.lifeCoherenceScore}
                    </p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-purple-500 opacity-60" />
                </div>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="p-6 bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Habit Fragility
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {metrics?.habitFragilityRisk}%
                    </p>
                  </div>
                  <AlertCircle className="h-10 w-10 text-red-500 opacity-60" />
                </div>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Burnout Risk
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {metrics?.burnoutWarning ? 'Critical' : 'Healthy'}
                    </p>
                  </div>
                  <Sparkles className="h-10 w-10 text-amber-500 opacity-60" />
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Key Insight */}
          <motion.div variants={item}>
            <Card className="p-6 border-l-4 border-primary">
              <p className="text-sm text-muted-foreground mb-2">Key Insight</p>
              <p className="text-foreground text-lg">
                {metrics?.keyInsight}
              </p>
            </Card>
          </motion.div>

          {/* Charts */}
          <motion.div
            variants={container}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Mood Trend */}
            <motion.div variants={item}>
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-foreground">
                  7-Day Mood Trend
                </h2>
                {moodTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={moodTrend}>
                      <defs>
                        <linearGradient id="colorValence" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1f1f1f', border: 'none', borderRadius: '8px' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="valence"
                        stroke="#8b5cf6"
                        fillOpacity={1}
                        fill="url(#colorValence)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-300 flex items-center justify-center text-muted-foreground">
                    No mood data yet
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Spending by Category */}
            <motion.div variants={item}>
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-foreground">
                  Spending Breakdown
                </h2>
                {spendingData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={spendingData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {spendingData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-300 flex items-center justify-center text-muted-foreground">
                    No spending data yet
                  </div>
                )}
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

