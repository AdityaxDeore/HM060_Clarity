<div align="center">

# 🧠 NeuroFlow

### Personal Clarity Dashboard

*A beautiful, modern productivity app that helps you understand yourself better*

[![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.1-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack) • [Screenshots](#-screenshots)

</div>

---

## ✨ Features

### 📊 **Dashboard**
- Symmetric cognitive map with central focus score
- 4 interconnected life areas (Mood, Money, Habits, Thoughts)
- Real-time focus calculation based on your activities
- Animated grid background with mouse-interactive spotlight

### 😊 **Mood Tracking**
- Visual mood selector with emojis
- Calendar view of mood history
- Mood fluctuation chart
- Context notes for each entry

### 💰 **Financial Hub**
- Income and expense tracking
- Category-based expense breakdown with pie charts
- Balance calculation
- Recent transaction history
- Smart spending alerts based on mood

### 🔄 **Habit Architect**
- Daily habit tracking with completion status
- Visual progress indicators
- Streak tracking
- Custom habit creation

### 📝 **Decision Journal**
- Document important decisions
- Track reasoning and feelings
- AI-powered pattern recognition
- Decision history timeline

### 🤖 **AI Insights Engine**
- Generate insights from your decision patterns
- Personalized suggestions
- Daily review summaries
- Smart recommendations

### 🎨 **Beautiful UI**
- Glassmorphism design with transparent cards
- Animated grid background with spotlight effect
- Smooth page transitions
- Collapsible sidebar with gradients
- Dark mode optimized
- Fully responsive design

---

## 🚀 Installation

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/AdityaxDeore/HM060_Clarity.git
   cd HM060_Clarity/HM060_Clarity
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install additional packages**
   ```bash
   npm install three @react-three/fiber @react-three/drei gsap @paper-design/shaders-react
   ```

---

## 🏃 Usage

### Development Mode

Start the development server on port 9002:

```bash
npm run dev
```

Then open your browser and navigate to:
```
http://localhost:9002
```

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

---

## 🛠️ Tech Stack

### Core
- **[Next.js 15.5.9](https://nextjs.org/)** - React framework with Turbopack
- **[React 19.2.1](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### Styling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - Component library
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library

### 3D & Graphics
- **[Three.js](https://threejs.org/)** - 3D graphics
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)** - React renderer for Three.js
- **[@react-three/drei](https://github.com/pmndrs/drei)** - Useful helpers for R3F
- **[@paper-design/shaders-react](https://www.npmjs.com/package/@paper-design/shaders-react)** - Shader effects

### Data Visualization
- **[Recharts](https://recharts.org/)** - Chart library
- **[date-fns](https://date-fns.org/)** - Date utilities

### Forms & Validation
- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[Zod](https://zod.dev/)** - Schema validation

### AI & Analytics
- Custom AI flows for insights generation
- Pattern recognition algorithms
- Daily review summarization

---

## 📁 Project Structure

```
HM060_Clarity/
├── src/
│   ├── app/
│   │   ├── (app)/          # Authenticated pages
│   │   │   ├── dashboard/
│   │   │   ├── mood/
│   │   │   ├── money/
│   │   │   ├── habits/
│   │   │   ├── journal/
│   │   │   ├── insights/
│   │   │   └── review/
│   │   ├── onboarding/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── dashboard/      # Dashboard components
│   │   ├── mood/          # Mood tracking components
│   │   ├── money/         # Financial components
│   │   ├── habits/        # Habit tracking components
│   │   ├── journal/       # Decision journal components
│   │   └── ui/            # Reusable UI components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and types
│   └── ai/                # AI flow integrations
├── public/
└── docs/
```

---

## 🎯 Getting Started Guide

### First Launch

1. **Onboarding**: Set your name, age, and main goal
2. **Dashboard**: View your cognitive map and focus score
3. **Track Mood**: Log your first mood entry
4. **Add Habits**: Create habits you want to build
5. **Journal Decisions**: Document important choices
6. **Track Finances**: Add your first transaction
7. **Generate Insights**: Get AI-powered recommendations

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Aditya Deore**

- GitHub: [@AdityaxDeore](https://github.com/AdityaxDeore)

---

<div align="center">

**Made with ❤️ and ☕ for better self-understanding**

⭐ Star this repo if you find it helpful!

</div>

