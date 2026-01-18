"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Utensils, Car, ShoppingBag, Home, Gamepad2, Heart, Coffee, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  { id: 'food', name: 'Food', icon: Utensils, color: 'orange' },
  { id: 'transport', name: 'Transport', icon: Car, color: 'blue' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: 'pink' },
  { id: 'home', name: 'Home', icon: Home, color: 'green' },
  { id: 'entertainment', name: 'Fun', icon: Gamepad2, color: 'purple' },
  { id: 'health', name: 'Health', icon: Heart, color: 'red' },
  { id: 'cafe', name: 'Café', icon: Coffee, color: 'amber' },
  { id: 'utilities', name: 'Bills', icon: Zap, color: 'cyan' },
];

interface MoneyEntryProps {
  onBack: () => void;
}

export function MoneyEntry({ onBack }: MoneyEntryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [amount, setAmount] = useState('0');

  const handleNumberClick = (num: string) => {
    if (amount === '0') {
      setAmount(num);
    } else {
      setAmount(amount + num);
    }
  };

  const handleBackspace = () => {
    if (amount.length > 1) {
      setAmount(amount.slice(0, -1));
    } else {
      setAmount('0');
    }
  };

  const handleSave = () => {
    if (selectedCategory && parseFloat(amount) > 0) {
      // TODO: Save to context/database
      console.log('Saving expense:', { category: selectedCategory, amount: parseFloat(amount) });
      alert(`Saved ₹${amount} in ${categories.find(c => c.id === selectedCategory)?.name}`);
      setAmount('0');
      setSelectedCategory(null);
      onBack();
    }
  };

  if (!selectedCategory) {
    return (
      <main className="flex-1 flex flex-col p-4 md:p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-headline text-2xl font-bold">Add Expense</h1>
            <p className="text-sm text-muted-foreground">Select a category</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto w-full">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  className={`p-6 cursor-pointer hover:border-${category.color}-500 hover:bg-${category.color}-500/5 transition-all`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-16 h-16 rounded-full bg-${category.color}-500/10 flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 text-${category.color}-500`} />
                    </div>
                    <span className="font-semibold text-center">{category.name}</span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </main>
    );
  }

  const category = categories.find(c => c.id === selectedCategory)!;
  const Icon = category.icon;

  return (
    <main className="flex-1 flex flex-col p-4 md:p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setSelectedCategory(null)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-${category.color}-500/10 flex items-center justify-center`}>
            <Icon className={`w-5 h-5 text-${category.color}-500`} />
          </div>
          <div>
            <h1 className="font-headline text-2xl font-bold">{category.name}</h1>
            <p className="text-sm text-muted-foreground">Enter amount</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Amount Display */}
        <div className="text-center mb-8">
          <div className="text-5xl md:text-6xl font-bold text-foreground">
            ₹{amount}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <Button
              key={num}
              variant="outline"
              size="lg"
              className="h-16 text-2xl font-semibold"
              onClick={() => handleNumberClick(num)}
            >
              {num}
            </Button>
          ))}
          <Button
            variant="outline"
            size="lg"
            className="h-16 text-2xl font-semibold"
            onClick={handleBackspace}
          >
            ←
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-16 text-2xl font-semibold"
            onClick={() => handleNumberClick('0')}
          >
            0
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-16 text-2xl font-semibold"
            onClick={() => {
              if (!amount.includes('.')) {
                setAmount(amount + '.');
              }
            }}
          >
            .
          </Button>
        </div>

        {/* Save Button */}
        <Button
          size="lg"
          className="w-full h-14 text-lg font-bold"
          onClick={handleSave}
          disabled={parseFloat(amount) === 0}
        >
          Save Expense
        </Button>
      </div>
    </main>
  );
}
