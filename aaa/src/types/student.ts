export interface Student {
  student_id: string;
  
  // Behavior metrics
  login_frequency: number; // logins per week
  session_duration: number; // avg minutes per session
  forum_participation: number; // posts per week
  assignment_access_rate: number; // 0-1
  time_gap_avg: number; // avg days between activities
  inactivity_days: number; // days since last activity
  engagement_trend: number[]; // weekly engagement scores
  
  // Sentiment
  feedback_texts: string[];
  sentiment_score: number; // -1 to 1
  sentiment_label: "positive" | "neutral" | "negative";
  top_keywords: string[];
  
  // Performance
  quiz_avg: number; // 0-100
  assignment_avg: number; // 0-100
  exam_avg: number; // 0-100
  time_spent_hours: number;
  progress_pct: number; // 0-100
  historical_gpa: number; // 0-4
  ETI_score: number; // 0-100
  actual_score?: number; // optional actual score
  predicted_score: number;
  predicted_grade: string; // A/B/C/D/F
  
  // Predictions
  engagement_score: number; // 0-100
  engagement_persona: "Highly Engaged" | "Moderately Engaged" | "At-risk";
  dropout_risk_score: number; // 0-100
  risk_level: "Low" | "Medium" | "High";
  
  // Recommendations
  recommendations: Recommendation[];
  
  // Metadata
  program: string;
  last_activity: string; // ISO date
}

export interface Recommendation {
  id: string;
  title: string;
  type: "Quiz" | "Assignment" | "Course Module" | "Video Lecture" | "Practice Exercise";
  expected_gain: number; // marks improvement
  estimated_minutes: number;
  explanation: string;
}

export interface Alert {
  id: string;
  message: string;
  type: "high-risk" | "inactive" | "engagement-drop";
  count: number;
  timestamp: string;
}
