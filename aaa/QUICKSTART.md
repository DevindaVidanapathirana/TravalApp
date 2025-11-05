# Student Engagement Dashboard - Quick Start Guide

## ✅ What's Been Built

A fully functional React TypeScript dashboard with:

- ✅ **200 synthetic student records** with realistic behavior, sentiment, and performance data
- ✅ **Authentication system** (Login: admin / admin123)
- ✅ **Main Dashboard** with KPI cards, alerts, and risk distribution chart
- ✅ **Students List** with search, filters (persona, risk, grade, inactivity)
- ✅ **Student Profile** with 5 comprehensive tabs:
  - Overview: Key metrics and top reasons
  - Engagement: Radar chart, trend graph, detailed metrics
  - Performance: Bar charts, actual vs predicted comparison
  - Dropout Risk: Gauge, sentiment analysis, risk drivers
  - Recommendations: Personalized cards with expected gains
- ✅ **Mock ML Service** with deterministic prediction formulas
- ✅ **Reusable UI Components** (KpiCard, RiskGauge, DataTable, etc.)
- ✅ **Clean modern design** with Tailwind CSS and shadcn/ui components
- ✅ **Interactive charts** using Recharts
- ✅ **Responsive layout** (desktop-first, tablet-compatible)

## 🚀 Running the Application

### Option 1: Development Mode (Requires Node 20+)

```bash
cd student-dashboard
npm install
npm run dev
# Open http://localhost:5173
```

### Option 2: Production Build (Works with Node 18+)

```bash
cd student-dashboard
npm install
npm run build
npm run preview
# Open http://localhost:4173
```

### Login Credentials

```
Username: admin
Password: admin123
```

## 📂 Project Structure

```
student-dashboard/
├── src/
│   ├── components/
│   │   ├── ui/              # Button, Card, Input, Badge, Tabs, Table
│   │   ├── DataTable.tsx    # Student list table
│   │   ├── KpiCard.tsx      # KPI metric card
│   │   ├── RiskGauge.tsx    # Circular risk gauge
│   │   ├── TrendSparkline.tsx  # Mini trend chart
│   │   ├── ReasonList.tsx   # Bullet list with icons
│   │   ├── RecommendationCard.tsx  # Recommendation display
│   │   ├── Layout.tsx       # Main layout with sidebar
│   │   └── ProtectedRoute.tsx  # Auth guard
│   ├── contexts/
│   │   └── AuthContext.tsx  # Authentication
│   ├── data/
│   │   └── mockStudents.ts  # 200 students with synthetic data
│   ├── pages/
│   │   ├── DashboardPage.tsx  # Main dashboard
│   │   ├── LoginPage.tsx      # Login form
│   │   ├── StudentsPage.tsx   # Student list with filters
│   │   └── StudentProfilePage.tsx  # 360° student view
│   ├── services/
│   │   └── predictionService.ts  # Mock ML service
│   └── types/
│       └── student.ts       # TypeScript interfaces
├── README.md               # Full documentation
└── QUICKSTART.md          # This file
```

## 🎯 Key Features to Explore

### 1. Dashboard
- View KPI cards showing engagement score, at-risk students, pass rate
- Click alerts to filter students by risk or inactivity
- See risk distribution chart

### 2. Students List
- Search by Student ID
- Filter by engagement persona, risk level, predicted grade
- Set minimum inactivity days
- Click "View Profile" to see detailed student view

### 3. Student Profile Tabs

**Overview**: Quick snapshot with engagement persona, scores, and top reasons

**Engagement**: 
- Radar chart showing behavior metrics
- 12-week trend line
- Detailed metrics (login frequency, session duration, forum participation)

**Performance**: 
- Bar chart comparing quiz, assignment, exam, ETI scores
- Actual vs Predicted comparison (when available)
- All input features displayed

**Dropout Risk**: 
- Circular gauge showing risk percentage
- Sentiment analysis (positive/neutral/negative)
- Keywords from feedback
- Risk drivers explanation
- Recent feedback messages

**Recommendations**: 
- Personalized intervention cards
- Expected gain in marks
- Estimated time required
- Explanation of why recommended
- Scenario: predicted score improvement if recommendations completed

## 📊 Sample Students to Check

- **STU00001-STU00050**: Mixed engagement levels
- **STU00100-STU00120**: High-risk students (filter by High risk)
- **STU00150-STU00180**: High performers

Filter examples:
- All at-risk students: Engagement Persona = "At-risk"
- High dropout risk: Risk Level = "High"
- Inactive students: Min Inactivity Days = 7

## 🔧 Extending the Application

### Adding Real Backend APIs

Replace mock service in `src/services/predictionService.ts`:

```typescript
async getAllStudents(): Promise<Student[]> {
  const response = await fetch('/api/students');
  return response.json();
}

async runPredictions(): Promise<void> {
  await fetch('/api/predict', { method: 'POST' });
}
```

### Adding New KPI Card

In `DashboardPage.tsx`:

```tsx
<KpiCard
  title="Your Metric"
  value="123"
  icon={YourIcon}
  description="Description"
/>
```

### Adding New Filter

In `StudentsPage.tsx`:

```tsx
<select value={filter} onChange={e => setFilter(e.target.value)}>
  <option value="all">All</option>
  <option value="value1">Option 1</option>
</select>
```

## 🎨 Customization

### Colors & Theme

Edit `tailwind.config.js` and `src/index.css` to customize the color scheme.

### Mock Data

Edit `src/data/mockStudents.ts` to adjust student generation logic, add more fields, or change distributions.

### Prediction Logic

Edit `src/services/predictionService.ts` to modify the scoring algorithms.

## 📝 Tech Stack

- React 18
- TypeScript
- Vite 7
- React Router v6
- Tailwind CSS 3.4
- Recharts (charts)
- Lucide React (icons)

## 🐛 Troubleshooting

**Dev server won't start (Node 18)**:
- Upgrade to Node 20.19+ or 22.12+
- OR use production build: `npm run build && npm run preview`

**Charts not displaying**:
- Ensure Recharts is installed: `npm install recharts`
- Check browser console for errors

**Authentication not working**:
- Use exact credentials: admin / admin123
- Check browser console for errors

## 📄 License

MIT License - Free to use for educational or commercial projects.

---

**Need Help?** Check the full README.md for detailed documentation.
