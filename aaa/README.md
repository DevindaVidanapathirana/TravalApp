# Student Engagement Dashboard

A comprehensive React TypeScript dashboard for instructors and administrators to monitor student engagement, predict performance, assess dropout risk, and generate personalized recommendations.

## ✨ Features

### Core Functionality
- **Student Engagement Monitoring**: Track behavior metrics, login frequency, session duration, and forum participation
- **Performance Prediction**: ML-powered grade predictions based on historical data and engagement patterns
- **Dropout Risk Assessment**: Identify at-risk students with sentiment analysis and behavior patterns
- **Personalized Recommendations**: Generate targeted interventions with expected gain calculations
- **Real-time Analytics**: KPI cards, trend visualizations, and interactive charts

### Dashboard Pages

#### 1. Login (Admin Authentication)
- Secure admin-only access
- Mock authentication (username: `admin`, password: `admin123`)

#### 2. Main Dashboard
- **KPI Cards**: Avg Engagement Score, At-risk Students, Predicted Pass Rate, Total Students
- **Recent Alerts**: High dropout risk, inactive students, engagement drops
- **Risk Distribution Chart**: Visual breakdown of student risk levels
- **Quick Actions**: Upload data, run predictions, view recommendations

#### 3. Students List
- **Search & Filters**: Student ID, Engagement Persona, Risk Level, Predicted Grade, Inactivity threshold
- **Data Table**: Sortable columns with sparkline trends
- **Quick Navigation**: Click any row to view detailed student profile

#### 4. Student Profile (360° View with 5 Tabs)

**Overview Tab**: Engagement persona, score, dropout risk, predicted grade, top reasons

**Engagement Tab**: Behavior metrics radar chart, 12-week trend, detailed metrics

**Performance Tab**: Performance breakdown, actual vs predicted comparison, input features

**Dropout Risk Tab**: Risk score gauge, sentiment analysis, risk drivers, recent feedback

**Recommendations Tab**: Personalized cards with expected gain, scenario projections

## 🚀 Tech Stack

- React 18 + TypeScript
- Vite (Build Tool)
- React Router v6
- Tailwind CSS
- shadcn/ui-style Components
- Recharts (Charts)
- Lucide React (Icons)

## 📦 Installation

### Prerequisites
- **Node.js 20.19+ or 22.12+** (required by Vite 7)
- npm or yarn

**Note**: If you encounter issues with Node 18.x, you may need to upgrade Node.js. The build process works but the dev server may have issues with older Node versions.

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser at http://localhost:5173

# Login with:
# Username: admin
# Password: admin123
```

## 📜 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📊 Data Model

### Student Record Structure

**Behavior Metrics**
- `login_frequency`: Logins per week
- `session_duration`: Average minutes per session
- `forum_participation`: Posts per week
- `assignment_access_rate`: 0-1 scale
- `time_gap_avg`: Average days between activities
- `inactivity_days`: Days since last activity
- `engagement_trend`: 12-week engagement history

**Sentiment Analysis**
- `feedback_texts`: Array of feedback messages
- `sentiment_score`: -1 to 1 scale
- `sentiment_label`: positive/neutral/negative
- `top_keywords`: Most frequent terms

**Performance Data**
- `quiz_avg`, `assignment_avg`, `exam_avg`: 0-100 scores
- `time_spent_hours`: Total time in course
- `progress_pct`: Course completion percentage
- `historical_gpa`: 0-4 scale
- `ETI_score`: Engagement Time Index
- `predicted_score`: ML prediction
- `predicted_grade`: A/B/C/D/F

**Computed Predictions**
- `engagement_score`: 0-100 composite score
- `engagement_persona`: Highly/Moderately/At-risk
- `dropout_risk_score`: 0-100 risk percentage
- `risk_level`: Low/Medium/High
- `recommendations`: Array of personalized interventions

## 🧮 Mock Prediction Logic

The prediction service uses deterministic formulas (no real ML):

### Engagement Score
```
engagement_score = 
  login_frequency × 0.2 +
  (session_duration / 120) × 100 × 0.15 +
  forum_participation × 2 × 0.15 +
  assignment_access_rate × 100 × 0.2 +
  ((10 - time_gap_avg) / 10) × 100 × 0.15 +
  ((30 - inactivity_days) / 30) × 100 × 0.15
```

### Predicted Score
```
predicted_score =
  quiz_avg × 0.25 +
  assignment_avg × 0.25 +
  exam_avg × 0.3 +
  ETI_score × 0.1 +
  (engagement_score / 100) × 10
```

### Dropout Risk Score
```
dropout_risk_score =
  (inactivity_days / 30) × 100 × 0.4 +
  ((100 - engagement_score) / 100) × 100 × 0.4 +
  ((1 - sentiment_score) / 2) × 100 × 0.2
```

## 🔌 Extending with Real Backend

The code is structured to easily integrate with real APIs:

```typescript
// In predictionService.ts
async getAllStudents(): Promise<Student[]> {
  const response = await fetch('/api/students');
  return response.json();
}

async runPredictions(): Promise<void> {
  await fetch('/api/predict', { method: 'POST' });
}
```

Add API configuration:
```typescript
// src/config/api.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Base UI components
│   ├── DataTable.tsx
│   ├── KpiCard.tsx
│   ├── Layout.tsx
│   ├── RiskGauge.tsx
│   └── ...
├── contexts/
│   └── AuthContext.tsx
├── data/
│   └── mockStudents.ts  # 200 synthetic students
├── pages/
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   ├── StudentProfilePage.tsx
│   └── StudentsPage.tsx
├── services/
│   └── predictionService.ts
└── types/
    └── student.ts
```

## 🎨 Key Features

- ✅ 200 synthetic student records with realistic distributions
- ✅ Clean admin dashboard with sidebar navigation
- ✅ Comprehensive filtering and search
- ✅ Interactive charts (line, bar, radar)
- ✅ Risk assessment with visual gauges
- ✅ Recommendation system with expected gains
- ✅ Responsive design (desktop-first)
- ✅ Mock authentication
- ✅ TypeScript throughout
- ✅ Ready for backend integration

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

MIT License - feel free to use this for educational or commercial projects.

---

**Built with ❤️ using React + TypeScript + Vite + Tailwind CSS**
