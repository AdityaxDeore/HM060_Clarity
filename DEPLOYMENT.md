# 🧠 NeuroFlow - Cognitive Life Management Platform

A production-ready, MAANG-level web application for managing finance, habits, mood, journaling with unified cognitive insights.

## ✨ Features

### Core Modules
- **Dashboard** - Unified cognitive overview with real-time metrics
- **Finance** - Income/expense tracking with emotional awareness
- **Habits** - Streak tracking with automatic difficulty adjustment
- **Journal** - Daily entries with mood tracking (valence + energy model)
- **Insights** - Silent intelligence discovering patterns and correlations
- **Settings** - Profile management and preferences

### Technical Highlights
- 🔐 **Firebase Authentication** (Email + Google OAuth)
- 🔥 **Firestore Database** with strict security rules
- 🎨 **Framer Motion** animations throughout
- 📊 **Recharts** for data visualization
- 🎭 **Animated gradient background** (subtle, non-distracting)
- 📱 **Fully responsive** design
- ⚡ **Next.js 15 App Router** with Turbopack
- 🎯 **TypeScript** for type safety

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Firebase project created ([console.firebase.google.com](https://console.firebase.google.com))

### Installation

1. **Clone and install dependencies:**
```bash
git clone <your-repo>
cd HM060_Clarity
npm install
```

2. **Configure Firebase:**

Create a `.env.local` file in the root directory:
```bash
cp .env.local.example .env.local
```

Fill in your Firebase credentials from the Firebase Console:
- Go to Project Settings > General
- Scroll to "Your apps" section
- Copy the config values

3. **Deploy Firestore Security Rules:**
```bash
npm install -g firebase-tools
firebase login
firebase init firestore  # Select your project
firebase deploy --only firestore:rules
```

4. **Run development server:**
```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── (app)/              # Protected app routes
│   │   ├── dashboard/      # Main dashboard
│   │   ├── finance/        # Finance module
│   │   ├── habits/         # Habits tracker
│   │   ├── journal/        # Journal entries
│   │   ├── insights/       # AI insights
│   │   └── settings/       # User settings
│   ├── auth/
│   │   ├── signin/         # Login page
│   │   └── signup/         # Registration
│   └── page.tsx            # Landing/redirect
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── main-sidebar.tsx    # App navigation
│   └── app-logo.tsx        # Branding
├── context/
│   ├── auth-context.tsx    # Firebase auth state
│   └── ...                 # Other contexts
├── lib/
│   ├── firebase.ts         # Firebase initialization
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Utility functions
└── hooks/                  # Custom React hooks
```

## 🔒 Security

### Firestore Rules
The `firestore.rules` file enforces:
- User can only access their own data
- All documents scoped by `uid`
- Insights/metrics written only by Cloud Functions
- No client-side trust model

### Authentication
- Session persistence with `browserLocalPersistence`
- Protected routes redirect to `/auth/signin`
- Auth state managed globally via Context API

## 📊 Data Schema

### Collections

**users** - User profiles
```typescript
{
  uid: string,
  email: string,
  displayName: string,
  theme: 'light' | 'dark' | 'system',
  notificationsEnabled: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**finances** - Transactions
```typescript
{
  uid: string,
  type: 'income' | 'expense',
  category: string,
  amount: number,
  description: string,
  emotionTag?: string,
  date: timestamp,
  createdAt: timestamp
}
```

**habits** - Habit definitions
```typescript
{
  uid: string,
  name: string,
  description: string,
  frequency: 'daily' | 'weekly' | 'monthly',
  frequencyCount: number,
  difficulty: number (1-5),
  color: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**habitLogs** - Habit completions
```typescript
{
  uid: string,
  habitId: string,
  date: timestamp,
  completed: boolean,
  notes?: string,
  createdAt: timestamp
}
```

**journals** - Journal entries
```typescript
{
  uid: string,
  title: string,
  content: string,
  mood: { valence: number, energy: number },
  sentiment: number (-1 to 1),
  tags: string[],
  date: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**moodLogs** - Mood tracking
```typescript
{
  uid: string,
  valence: number (-1 to 1),
  energy: number (-1 to 1),
  note: string,
  emotionTags: string[],
  date: timestamp,
  createdAt: timestamp
}
```

**insights** - AI-generated insights
```typescript
{
  uid: string,
  type: 'correlation' | 'prediction' | 'pattern' | 'warning',
  title: string,
  description: string,
  severity: 'info' | 'warning' | 'critical',
  createdAt: timestamp
}
```

## 🎨 Design Philosophy

### Visual Identity
- **Subtle gradient background** - Animated but calming
- **Professional color palette** - Purple/blue primary with accent colors
- **Consistent spacing** - 4px grid system
- **Typography hierarchy** - Clear, readable

### UX Principles
- **Progressive disclosure** - Forms appear on demand
- **Micro-interactions** - Hover states, transitions
- **Empty states** - Helpful, friendly copy
- **Loading states** - Skeleton loaders, not spinners
- **Responsive first** - Mobile to desktop

## 🧪 Features to Extend

### Cloud Functions (Not Implemented)
Create Firebase Cloud Functions for:
- **Cognitive Load Score** - Based on transactions, mood, habits
- **Life Coherence Score** - Alignment between goals and actions
- **Habit Fragility Detection** - Predict streak breaks
- **Burnout Warning** - Multi-factor analysis
- **Insight Generation** - Pattern discovery

Example function structure:
```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.computeCognitiveLoad = functions.firestore
  .document('habits/{habitId}')
  .onWrite(async (change, context) => {
    // Calculate cognitive load
    // Update cognitiveMetrics collection
  });
```

## 📦 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Firebase Hosting
```bash
npm run build
firebase init hosting
firebase deploy
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Animation | Framer Motion |
| Charts | Recharts |
| Backend | Firebase (Auth, Firestore) |
| State | Context API |
| Icons | Lucide React |

## 📝 Environment Variables

Required variables in `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

## 🤝 Contributing

This is a production-ready base. To contribute:
1. Fork the repository
2. Create a feature branch
3. Follow TypeScript best practices
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - feel free to use for your projects

## 🎯 Quality Checklist

✅ Real Firebase integration (no mock data)  
✅ Strict security rules  
✅ TypeScript throughout  
✅ Responsive design  
✅ Animated micro-interactions  
✅ Loading & empty states  
✅ Protected routes  
✅ Session persistence  
✅ Professional UI/UX  
✅ Production-ready code  

## 🚨 Important Notes

1. **Firebase Setup Required** - App won't work without Firebase credentials
2. **Firestore Indexes** - May need to create composite indexes for queries
3. **Cloud Functions** - Logic is client-side; move to Functions for production scale
4. **Rate Limiting** - Consider adding rate limits for API calls
5. **Analytics** - Add Firebase Analytics for user behavior tracking

---

Built with ❤️ as a MAANG-level cognitive life management platform.
