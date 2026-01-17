'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { AlertCircle, TrendingUp, Lightbulb, Target } from 'lucide-react';

const insights = [
  { type: 'correlation', title: 'Spending & Mood Link', description: 'Your spending increases by 40% on days with low mood scores', severity: 'warning', icon: AlertCircle },
  { type: 'pattern', title: 'Habit Consistency', description: 'You complete 85% more habits on weekdays than weekends', severity: 'info', icon: Target },
  { type: 'prediction', title: 'Energy Trend', description: 'Your energy levels peak at 2 PM. Schedule important tasks accordingly', severity: 'info', icon: TrendingUp },
];

export default function InsightsPage() {
  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8 overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-foreground">Insights</h1>
        <p className="text-muted-foreground">Silent intelligence discovering patterns</p>
      </motion.div>

<<<<<<< Updated upstream
      {error && <p className="text-destructive">{error}</p>}
      
      {insights.length === 0 && !isLoading && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Ready for your insights?</h3>
            <p className="mt-1 text-sm text-muted-foreground">Click "Generate Insights" to let our AI analyze your journal.</p>
            {decisions.length < 2 && <p className="mt-1 text-sm text-muted-foreground">You need at least 2 decision entries to generate insights.</p>}
          </div>
        </div>
      )}

      {isLoading && (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-card/40 backdrop-blur-sm border-border/40">
                <CardHeader>
                  <Skeleton className="h-5 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                   <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
         </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight, index) => (
          <Card key={index} className="flex flex-col bg-card/40 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="text-primary"/>
                Pattern: {insight.pattern}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold mb-1">Explanation</h4>
                <p className="text-sm text-muted-foreground mb-4">{insight.explanation}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Suggestion</h4>
                <p className="text-sm text-muted-foreground">{insight.suggestion}</p>
              </div>
            </CardContent>
          </Card>
        ))}
=======
      <div className="space-y-4">
        {insights.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className={`p-6 border-l-4 ${insight.severity === 'warning' ? 'border-amber-500' : 'border-blue-500'}`}>
                <div className="flex items-start gap-4">
                  <Icon className={`h-6 w-6 flex-shrink-0 ${insight.severity === 'warning' ? 'text-amber-500' : 'text-blue-500'}`} />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{insight.title}</h3>
                    <p className="text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
>>>>>>> Stashed changes
      </div>
    </div>
  );
}
