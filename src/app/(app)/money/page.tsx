"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TransactionForm } from '@/components/money/transaction-form';
import { FinancialOverview } from '@/components/money/financial-overview';
import { useMoney } from '@/context/money-context';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Calendar as CalendarIcon, DollarSign } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, eachDayOfInterval, isSameDay } from 'date-fns';

const COLORS = ['#f97316', '#3b82f6', '#ec4899', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4', '#ef4444'];

export default function MoneyPage() {
  const [openIncome, setOpenIncome] = useState(false);
  const [openExpense, setOpenExpense] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { addTransaction, transactions } = useMoney();
  const { toast } = useToast();

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const yearStart = startOfYear(now);
    const yearEnd = endOfYear(now);

    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= monthStart && date <= monthEnd && t.type === 'expense';
    });

    const yearTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= yearStart && date <= yearEnd && t.type === 'expense';
    });

    const monthTotal = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
    const yearTotal = yearTransactions.reduce((sum, t) => sum + t.amount, 0);
    const daysInMonth = now.getDate();
    const avgDaily = daysInMonth > 0 ? monthTotal / daysInMonth : 0;

    // Category breakdown - sorted by value
    const categoryData: Record<string, number> = {};
    monthTransactions.forEach(t => {
      categoryData[t.category] = (categoryData[t.category] || 0) + t.amount;
    });

    const categoryChart = Object.entries(categoryData)
      .map(([name, value]) => ({
        name,
        value: Math.round(value)
      }))
      .sort((a, b) => b.value - a.value);

    // Get all days in current month for complete chart
    const daysInCurrentMonth = eachDayOfInterval({ start: monthStart, end: now });
    const dailyData: Record<string, number> = {};
    
    // Initialize all days with 0
    daysInCurrentMonth.forEach(day => {
      const key = format(day, 'MMM dd');
      dailyData[key] = 0;
    });
    
    // Fill in actual transaction data
    monthTransactions.forEach(t => {
      const day = format(new Date(t.date), 'MMM dd');
      dailyData[day] = (dailyData[day] || 0) + t.amount;
    });

    const dailyChart = Object.entries(dailyData)
      .map(([date, amount]) => ({
        date,
        amount: Math.round(amount)
      }))
      .slice(-14); // Last 14 days

    // Calculate trends
    const lastWeekTotal = monthTransactions
      .filter(t => {
        const date = new Date(t.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return date >= weekAgo;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const previousWeekTotal = monthTransactions
      .filter(t => {
        const date = new Date(t.date);
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return date >= twoWeeksAgo && date < weekAgo;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const weeklyChange = previousWeekTotal > 0 
      ? ((lastWeekTotal - previousWeekTotal) / previousWeekTotal) * 100 
      : 0;

    return {
      avgDaily: Math.round(avgDaily),
      monthTotal: Math.round(monthTotal),
      yearTotal: Math.round(yearTotal),
      categoryChart,
      dailyChart,
      lastWeekTotal: Math.round(lastWeekTotal),
      weeklyChange: Math.round(weeklyChange * 10) / 10, // Round to 1 decimal
      topCategory: categoryChart[0]?.name || 'None',
      topCategoryAmount: categoryChart[0]?.value || 0
    };
  }, [transactions]);

  // Get transactions for selected date
  const dayTransactions = useMemo(() => {
    if (!selectedDate) return [];
    return transactions.filter(t => 
      isSameDay(new Date(t.date), selectedDate)
    );
  }, [transactions, selectedDate]);

  const dayTotal = dayTransactions.reduce((sum, t) => 
    t.type === 'expense' ? sum + t.amount : sum, 0
  );
  
  const handleAddTransaction = (data: any) => {
    addTransaction(data);
    toast({
      title: "Transaction added!",
      description: `Your ${data.type} of ₹${data.amount} has been recorded.`,
    });
  };

  return (
    <main className="flex-1 flex flex-col p-4 md:p-6 gap-6 overflow-y-auto">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold">Financial Hub</h1>
          <p className="text-muted-foreground">Track and analyze your expenses.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={openExpense} onOpenChange={setOpenExpense}>
            <DialogTrigger asChild>
              <Button>Add Expense</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Expense</DialogTitle>
              </DialogHeader>
              <TransactionForm type="expense" onSubmit={handleAddTransaction} onFinished={() => setOpenExpense(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avg Daily</span>
            <TrendingUp className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold">₹{stats.avgDaily}</p>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Monthly Total</span>
            <CalendarIcon className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold">₹{stats.monthTotal}</p>
          <p className="text-xs text-muted-foreground mt-1">{format(new Date(), 'MMMM yyyy')}</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Last Week</span>
            {stats.weeklyChange >= 0 ? (
              <TrendingUp className="w-5 h-5 text-red-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-green-500" />
            )}
          </div>
          <p className="text-3xl font-bold">₹{stats.lastWeekTotal}</p>
          <p className={`text-xs mt-1 ${stats.weeklyChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
            {stats.weeklyChange >= 0 ? '+' : ''}{stats.weeklyChange}% vs prev week
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Top Category</span>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold truncate">{stats.topCategory}</p>
          <p className="text-xs text-muted-foreground mt-1">₹{stats.topCategoryAmount} this month</p>
        </Card>
      </div>

      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="charts">Analytics</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6">
          {/* Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6 border-l-4 border-blue-500">
              <h3 className="font-semibold text-lg mb-2">💡 Spending Insight</h3>
              <p className="text-muted-foreground">
                {stats.monthTotal > 0 ? (
                  <>You're spending an average of <span className="font-bold text-orange-500">₹{stats.avgDaily}</span> per day this month.</>
                ) : (
                  'No expenses tracked yet. Start adding expenses to see insights!'
                )}
              </p>
            </Card>

            <Card className="p-6 border-l-4 border-purple-500">
              <h3 className="font-semibold text-lg mb-2">📊 Category Focus</h3>
              <p className="text-muted-foreground">
                {stats.topCategory !== 'None' ? (
                  <>Your highest spending is on <span className="font-bold text-purple-500">{stats.topCategory}</span> (₹{stats.topCategoryAmount}).</>
                ) : (
                  'Track expenses to see your spending patterns by category.'
                )}
              </p>
            </Card>
          </div>

          {/* Daily Spending Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Last 14 Days Spending</h2>
              <div className="text-sm text-muted-foreground">
                Total: ₹{stats.dailyChart.reduce((sum, d) => sum + d.amount, 0)}
              </div>
            </div>
            {stats.dailyChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={stats.dailyChart}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#888" 
                    tick={{ fill: '#888', fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="#888" 
                    tick={{ fill: '#888', fontSize: 12 }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid #333', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                    }}
                    formatter={(value) => [`₹${value}`, 'Spent']}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Bar 
                    dataKey="amount" 
                    fill="url(#barGradient)" 
                    radius={[8, 8, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex flex-col items-center justify-center text-muted-foreground">
                <DollarSign className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg">No spending data yet</p>
                <p className="text-sm mt-2">Add your first expense to see the chart</p>
              </div>
            )}
          </Card>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
              {stats.categoryChart.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={stats.categoryChart}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={110}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.categoryChart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `₹${value}`}
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333', 
                        borderRadius: '8px' 
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[350px] flex flex-col items-center justify-center text-muted-foreground">
                  <DollarSign className="w-16 h-16 mb-4 opacity-20" />
                  <p>No category data yet</p>
                </div>
              )}
            </Card>

            {/* Category List */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
              {stats.categoryChart.length > 0 ? (
                <div className="space-y-3">
                  {stats.categoryChart.map((category, index) => {
                    const percentage = stats.monthTotal > 0 
                      ? (category.value / stats.monthTotal) * 100 
                      : 0;
                    return (
                      <div key={category.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">₹{category.value}</p>
                            <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
                  <p>Add expenses to see breakdown</p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          {/* Previous Overview Section */}
          <FinancialOverview />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Calendar */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Expense Calendar</h2>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </Card>

            {/* Selected Day Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : 'Select a date'}
              </h2>
              {selectedDate && (
                <>
                  <div className="mb-4 p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <p className="text-sm text-muted-foreground">Total Expenses</p>
                    <p className="text-3xl font-bold text-orange-500">₹{Math.round(dayTotal)}</p>
                  </div>
                  
                  {dayTransactions.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Transactions</p>
                      {dayTransactions.map((transaction, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{transaction.category}</p>
                            {transaction.description && (
                              <p className="text-sm text-muted-foreground">{transaction.description}</p>
                            )}
                          </div>
                          <p className="font-bold text-orange-500">₹{transaction.amount}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No transactions on this day</p>
                  )}
                </>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
