"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Smile, Meh, Frown, Heart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const emotions = [
  { id: 'happy', label: 'Happy', icon: Smile, color: 'text-yellow-500', emoji: '😊' },
  { id: 'neutral', label: 'Neutral', icon: Meh, color: 'text-gray-500', emoji: '😐' },
  { id: 'sad', label: 'Sad', icon: Frown, color: 'text-blue-500', emoji: '😢' },
  { id: 'excited', label: 'Excited', icon: Zap, color: 'text-orange-500', emoji: '🤩' },
  { id: 'loved', label: 'Loved', icon: Heart, color: 'text-pink-500', emoji: '🥰' },
];

interface EmotionEntryProps {
  onBack: () => void;
}

export function EmotionEntry({ onBack }: EmotionEntryProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  const handleSave = () => {
    if (selectedEmotion) {
      // TODO: Save to context/database
      console.log('Saving emotion:', selectedEmotion);
      alert(`Logged: ${emotions.find(e => e.id === selectedEmotion)?.label}`);
      onBack();
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-headline text-2xl font-bold">How are you feeling?</h1>
            <p className="text-sm text-muted-foreground">Select your mood</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {emotions.map((emotion) => {
            const Icon = emotion.icon;
            const isSelected = selectedEmotion === emotion.id;
            
            return (
              <motion.div
                key={emotion.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={() => setSelectedEmotion(emotion.id)}
                  className={`w-full p-6 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-border hover:border-purple-300'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-5xl">{emotion.emoji}</span>
                    <span className={`font-semibold ${isSelected ? 'text-purple-500' : ''}`}>
                      {emotion.label}
                    </span>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        <Button
          size="lg"
          className="w-full h-14 text-lg font-bold"
          onClick={handleSave}
          disabled={!selectedEmotion}
        >
          Save Mood
        </Button>
      </div>
    </main>
  );
}
