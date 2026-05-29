# 🦅 Elite Performance Terminal (EPT)

An AI-Powered Command Center for High-Stakes Bank Exam Preparation. Built for SBI PO, IBPS PO, and RBI Grade B aspirants who demand precision, strategy, and deep analytics.

## ⚡ Core Philosophy: "Zero-Latency Intelligence"
The EPT is not just a tracker; it's a strategic partner. It utilizes a **Hybrid Vault Architecture** that combines the speed of local storage with the persistence of the Firebase Cloud.

## 🛠 Strategic Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI (Elite Dark/Light Theme)
- **Intelligence**: Google Gemini 2.0 (Genkit)
- **Persistence**: Hybrid Vault (Local + Firebase Firestore)
- **Security**: Firebase Authentication (Google Uplink)
- **Icons**: Lucide React (Tactical Set)

## 📡 Operational Features
- **Global Stage Synchronizer**: One-click toggle between Prelims and Mains that recalibrates the entire UI.
- **Precision Console**: Real-time study unit timer with automatic cloud archiving.
- **Mistake Intelligence**: A dedicated journal for tactical error analysis and resolution tracking.
- **Readiness Architecture**: Dynamic SVG pulse rings calculating your probability of exam success.
- **Tactical Audit Log**: A full "black-box" recorder of every touch, scroll, and log action for diagnostic reporting.

## 🚀 Setup Protocol

### 1. Repository Acquisition
```bash
git clone https://github.com/yourusername/elite-perf-terminal.git
cd elite-perf-terminal
```

### 2. Dependency Initialization
```bash
npm install
```

### 3. Environment Calibration
Create a `.env.local` file with your credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
GOOGLE_GENAI_API_KEY=your_gemini_key
```

### 4. Engage Terminal
```bash
npm run dev
```

## 🔐 Hybrid Vault Security
Your data is partitioned by User ID. When signed in, the terminal performs a real-time uplink to Firestore. When offline, it maintains operational capability using the local buffer.

---
*Built for the 1%. Maintained by the Elite.*
