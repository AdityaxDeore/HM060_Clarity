"use client";

import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useMoney } from '@/context/money-context';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

const COLORS = ['#673AB7', '#3F51B5', '#7C4DFF', '#536DFE', '#303F9F', '#1A237E'];

export function FinancialOverview() {
  const { transactions } = useMoney();

  const { income, expenses, balance, expenseByCategory } = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expenses;

    const expenseByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = 0;
        }
        acc[t.category] += t.amount;
        return acc;
      }, {} as Record<string, number>);

    return {
      income,
      expenses,
      balance,
      expenseByCategory: Object.entries(expenseByCategory).map(([name, value]) => ({ name, value })),
    };
  }, [transactions]);

  return (
    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
      <Card className="bg-card/40 backdrop-blur-sm border-border/40">
        <CardHeader>
          <CardTitle>Income</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600">${income.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card className="bg-card/40 backdrop-blur-sm border-border/40">
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-red-600">${expenses.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card className="bg-card/40 backdrop-blur-sm border-border/40">
        <CardHeader>
          <CardTitle>Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-4xl font-bold ${balance >= 0 ? 'text-foreground' : 'text-red-500'}`}>
            ${balance.toFixed(2)}
          </div>
        </CardContent>
      </Card>
      <Card className="md:col-span-2 lg:col-span-1 bg-card/40 backdrop-blur-sm border-border/40">
        <CardHeader>
          <CardTitle className="font-headline">Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  className="text-xs"
                >
                  {expenseByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className="md:col-span-2 lg:col-span-2 bg-card/40 backdrop-blur-sm border-border/40">
        <CardHeader>
            <CardTitle className="font-headline">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
            <ScrollArea className="h-64">
                <div className="space-y-4">
                    {transactions.slice(0, 10).map(t => (
                        <div key={t.id} className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">{t.description}</p>
                                <p className="text-sm text-muted-foreground">{t.category} &bull; {format(t.date, 'MMM d')}</p>
                            </div>
                            <div className={`font-semibold ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
