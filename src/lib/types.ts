// User Profile
export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  age: number;
  mainGoal: string;
  biggestStruggle: string;
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  createdAt: number; // timestamp
  updatedAt: number;
};

// Mood Log - 2D valence/energy model
export type MoodLog = {
  id: string;
  uid: string;
  date: number; // timestamp
  valence: number; // -1 (negative) to 1 (positive)
  energy: number; // -1 (low) to 1 (high)
  note: string;
  emotionTags: string[];
  createdAt: number;
};

// Financial Transaction
export type Transaction = {
  id: string;
  uid: string;
  date: number; // timestamp
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  emotionTag?: string; // linked from mood
  createdAt: number;
};

// Habit Definition
export type Habit = {
  id: string;
  uid: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  frequencyCount: number; // e.g., 5 times a week
  difficulty: number; // 1-5, auto-adjusted based on stress
  createdAt: number;
  updatedAt: number;
};

// Habit Log (completion tracking)
export type HabitLog = {
  id: string;
  uid: string;
  habitId: string;
  date: number; // timestamp
  completed: boolean;
  notes?: string;
  createdAt: number;
};

// Journal Entry
export type JournalEntry = {
  id: string;
  uid: string;
  date: number; // timestamp
  title: string;
  content: string;
  mood?: { valence: number; energy: number };
  sentiment: number; // -1 to 1, computed via NLP
  tags: string[];
  createdAt: number;
  updatedAt: number;
};

// Insight (AI/computed)
export type Insight = {
  id: string;
  uid: string;
  type: 'correlation' | 'prediction' | 'pattern' | 'warning';
  title: string;
  description: string;
  relevantMetrics: string[];
  severity: 'info' | 'warning' | 'critical';
  actionable: boolean;
  suggestedAction?: string;
  createdAt: number;
};

// Cognitive Metrics (computed daily)
export type CognitiveMetrics = {
  uid: string;
  date: number; // timestamp of day
  cognitiveLoadScore: number; // 0-100
  lifeCoherenceScore: number; // 0-100
  habitFragilityRisk: number; // 0-100
  burnoutWarning: boolean;
  keyInsight: string;
  updatedAt: number;
};

// Settings
export type UserSettings = {
  uid: string;
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  dailyReviewTime?: string;
  currency: string;
  updatedAt: number;
};
