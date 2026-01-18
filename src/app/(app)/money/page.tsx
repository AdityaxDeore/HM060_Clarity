"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { TransactionForm } from '@/components/money/transaction-form';
import { FinancialOverview } from '@/components/money/financial-overview';
import { useMoney } from '@/context/money-context';
import { useMood } from '@/context/mood-context';
import { useToast } from '@/hooks/use-toast';

export default function MoneyPage() {
  const [openIncome, setOpenIncome] = useState(false);
  const [openExpense, setOpenExpense] = useState(false);
  const [showSpendingAlert, setShowSpendingAlert] = useState(false);
  const { addTransaction } = useMoney();
  const { moods } = useMood();
  const { toast } = useToast();

  useEffect(() => {
    const latestMood = moods.length > 0 ? moods[0] : null;
    if (latestMood && latestMood.mood === 'sad') {
      setShowSpendingAlert(true);
    }
  }, [moods]);
  
  const handleAddTransaction = (data: any) => {
    addTransaction(data);
    toast({
      title: "Transaction added!",
      description: `Your ${data.type} of $${data.amount} has been recorded.`,
    });
  };

  return (
    <main className="flex-1 flex flex-col p-4 md:p-6 gap-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold">Financial Hub</h1>
          <p className="text-muted-foreground">Track your income and expenses.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={openIncome} onOpenChange={setOpenIncome}>
            <DialogTrigger asChild>
              <Button>Add Income</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Income</DialogTitle>
              </DialogHeader>
              <TransactionForm type="income" onSubmit={handleAddTransaction} onFinished={() => setOpenIncome(false)} />
            </DialogContent>
          </Dialog>
          <Dialog open={openExpense} onOpenChange={setOpenExpense}>
            <DialogTrigger asChild>
              <Button variant="secondary">Add Expense</Button>
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

      <FinancialOverview />
      
      <AlertDialog open={showSpendingAlert} onOpenChange={setShowSpendingAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emotional Spending Alert</AlertDialogTitle>
            <AlertDialogDescription>
              We noticed you're feeling a bit down today. Be mindful of your spending, as emotions can sometimes influence financial decisions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Got it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
