# 🚀 Quick Start Guide - NeuroFlow

## Prerequisites
- Node.js 18+ installed
- Firebase account (free tier works)

## Setup in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Name it "NeuroFlow" (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 3: Enable Authentication
1. In Firebase Console, click "Authentication"
2. Click "Get started"
3. Enable "Email/Password"
4. Enable "Google" (add support email)

### Step 4: Create Firestore Database
1. Click "Firestore Database" in sidebar
2. Click "Create database"
3. Select "Start in production mode"
4. Choose a location (closest to you)
5. Click "Enable"

### Step 5: Get Firebase Config
1. Click ⚙️ (settings) > Project settings
2. Scroll to "Your apps" section
3. Click the web icon ( </> )
4. Register app (nickname: "NeuroFlow Web")
5. Copy the `firebaseConfig` object

### Step 6: Create `.env.local`
Create a file named `.env.local` in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
```

### Step 7: Deploy Security Rules
```bash
# Install Firebase CLI if you haven't
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firestore (select your project)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

### Step 8: Run the App
```bash
npm run dev
```

Open http://localhost:9002

### Step 9: Create Your Account
1. Click "Create one" on signin page
2. Sign up with email or Google
3. You'll be redirected to the dashboard
4. Start using the app!

## 🎉 You're Done!

The app is now running with:
- ✅ Firebase authentication
- ✅ Secure Firestore database
- ✅ All modules functional
- ✅ Real-time data sync

## 🧪 Test the Features

### Dashboard
- View your cognitive metrics (initially demo data)
- Charts will populate as you add data

### Finance
1. Click "+ Add Transaction"
2. Add an expense (e.g., "Lunch", $15, Food category)
3. See it appear in the list and charts

### Habits
1. Click "+ New Habit"
2. Create a habit (e.g., "Morning Run", Daily, 1x)
3. Click the circle to mark it complete today
4. Streak counter will update

### Journal
1. Click "+ New Entry"
2. Write a journal entry
3. Adjust valence and energy sliders
4. Save and see it in the list

### Insights
- View pattern insights (static for now)
- Implement Cloud Functions for real insights

### Settings
- Update preferences
- Sign out

## 📱 Mobile Testing
The app is fully responsive! Open on your phone:
1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Open `http://YOUR-IP:9002` on your phone
3. Both devices must be on the same network

## 🐛 Troubleshooting

### "Firebase: Error (auth/...)"
- Check your `.env.local` values
- Make sure Authentication is enabled in Firebase Console

### "Permission denied" errors
- Deploy security rules: `firebase deploy --only firestore:rules`
- Make sure you're signed in to the app

### Port 9002 already in use
Change port in `package.json`:
```json
"dev": "next dev --turbopack -p 3000"
```

### App not loading
1. Check terminal for errors
2. Clear browser cache
3. Restart dev server: Ctrl+C, then `npm run dev`

## 🚀 Deploy to Production

### Vercel (Recommended)
1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables from `.env.local`
5. Deploy

### Firebase Hosting
```bash
npm run build
firebase init hosting
firebase deploy --only hosting
```

## 📚 Next Steps
- Read `IMPLEMENTATION_SUMMARY.md` for full feature list
- Read `DEPLOYMENT.md` for detailed documentation
- Check `firestore.rules` to understand security
- Explore `src/lib/types.ts` for data structures

## 💡 Tips
- **Data is user-scoped**: Each user only sees their own data
- **Real-time updates**: Changes sync automatically
- **Mobile-first**: Works great on all devices
- **Secure**: Firestore rules prevent data leakage
- **Scalable**: Firebase handles millions of users

## 🎯 Success Checklist
- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Firestore database created
- [ ] `.env.local` configured
- [ ] Security rules deployed
- [ ] App running on localhost:9002
- [ ] Account created
- [ ] First transaction added
- [ ] First habit created
- [ ] First journal entry written

If all checked ✅ - **Congratulations! You're running a MAANG-level cognitive platform!**

---

Need help? Check the error messages in your terminal - they're usually very helpful!
