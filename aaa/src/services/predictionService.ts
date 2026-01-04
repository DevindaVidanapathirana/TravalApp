import type { Student, Alert } from "../types/student";
import { mockStudents } from "../data/mockStudents";

export class PredictionService {
  private students: Student[];

  constructor() {
    this.students = [...mockStudents];
  }

  getAllStudents(): Student[] {
    return this.students;
  }

  getStudentById(id: string): Student | undefined {
    return this.students.find((s) => s.student_id === id);
  }

  // Re-run predictions (in a real app, this would call ML API)
  runPredictions(): void {
    this.students = this.students.map((student) => {
      // Recalculate engagement score
      const engagement_score =
        student.login_frequency * 0.2 +
        (student.session_duration / 120) * 100 * 0.15 +
        student.forum_participation * 2 * 0.15 +
        student.assignment_access_rate * 100 * 0.2 +
        ((10 - student.time_gap_avg) / 10) * 100 * 0.15 +
        ((30 - student.inactivity_days) / 30) * 100 * 0.15;

      const normalized_engagement = Math.max(0, Math.min(100, engagement_score));

      let engagement_persona: "Highly Engaged" | "Moderately Engaged" | "At-risk";
      if (normalized_engagement >= 70) engagement_persona = "Highly Engaged";
      else if (normalized_engagement >= 40) engagement_persona = "Moderately Engaged";
      else engagement_persona = "At-risk";

      // Recalculate predicted score
      const predicted_score =
        student.quiz_avg * 0.25 +
        student.assignment_avg * 0.25 +
        student.exam_avg * 0.3 +
        student.ETI_score * 0.1 +
        (normalized_engagement / 100) * 10;

      let predicted_grade: string;
      if (predicted_score >= 90) predicted_grade = "A";
      else if (predicted_score >= 80) predicted_grade = "B";
      else if (predicted_score >= 70) predicted_grade = "C";
      else if (predicted_score >= 60) predicted_grade = "D";
      else predicted_grade = "F";

      // Recalculate dropout risk
      const dropout_risk_score =
        (student.inactivity_days / 30) * 100 * 0.4 +
        ((100 - normalized_engagement) / 100) * 100 * 0.4 +
        ((1 - student.sentiment_score) / 2) * 100 * 0.2;

      const normalized_dropout_risk = Math.max(0, Math.min(100, dropout_risk_score));

      let risk_level: "Low" | "Medium" | "High";
      if (normalized_dropout_risk >= 60) risk_level = "High";
      else if (normalized_dropout_risk >= 30) risk_level = "Medium";
      else risk_level = "Low";

      return {
        ...student,
        engagement_score: parseFloat(normalized_engagement.toFixed(1)),
        engagement_persona,
        predicted_score: parseFloat(predicted_score.toFixed(1)),
        predicted_grade,
        dropout_risk_score: parseFloat(normalized_dropout_risk.toFixed(1)),
        risk_level,
      };
    });
  }

  // Get KPI metrics
  getKpiMetrics() {
    const avgEngagement =
      this.students.reduce((sum, s) => sum + s.engagement_score, 0) / this.students.length;

    const atRiskCount = this.students.filter((s) => s.risk_level === "High").length;

    const predictedPassCount = this.students.filter(
      (s) => s.predicted_grade !== "F"
    ).length;
    const predictedPassRate = (predictedPassCount / this.students.length) * 100;

    const riskDistribution = {
      low: this.students.filter((s) => s.risk_level === "Low").length,
      medium: this.students.filter((s) => s.risk_level === "Medium").length,
      high: this.students.filter((s) => s.risk_level === "High").length,
    };

    return {
      avgEngagement: parseFloat(avgEngagement.toFixed(1)),
      atRiskCount,
      predictedPassRate: parseFloat(predictedPassRate.toFixed(1)),
      riskDistribution,
    };
  }

  // Get recent alerts
  getAlerts(): Alert[] {
    const alerts: Alert[] = [];

    const highRiskCount = this.students.filter((s) => s.risk_level === "High").length;
    if (highRiskCount > 0) {
      alerts.push({
        id: "alert-high-risk",
        message: `${highRiskCount} students at high dropout risk`,
        type: "high-risk",
        count: highRiskCount,
        timestamp: new Date().toISOString(),
      });
    }

    const inactiveCount = this.students.filter((s) => s.inactivity_days > 7).length;
    if (inactiveCount > 0) {
      alerts.push({
        id: "alert-inactive",
        message: `${inactiveCount} students inactive > 7 days`,
        type: "inactive",
        count: inactiveCount,
        timestamp: new Date().toISOString(),
      });
    }

    // Check for engagement drops (last value in trend < first value)
    const engagementDropCount = this.students.filter((s) => {
      const trend = s.engagement_trend;
      if (trend.length < 2) return false;
      const recent = trend.slice(-3).reduce((a, b) => a + b, 0) / 3;
      const earlier = trend.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
      return recent < earlier - 10;
    }).length;

    if (engagementDropCount > 0) {
      alerts.push({
        id: "alert-engagement-drop",
        message: `Engagement dropped week-over-week for ${engagementDropCount} students`,
        type: "engagement-drop",
        count: engagementDropCount,
        timestamp: new Date().toISOString(),
      });
    }

    return alerts;
  }

  // Filter students
  filterStudents(filters: {
    search?: string;
    persona?: string;
    riskLevel?: string;
    gradeRange?: string;
    minInactivityDays?: number;
  }): Student[] {
    let filtered = [...this.students];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter((s) => s.student_id.toLowerCase().includes(search));
    }

    if (filters.persona && filters.persona !== "all") {
      filtered = filtered.filter((s) => s.engagement_persona === filters.persona);
    }

    if (filters.riskLevel && filters.riskLevel !== "all") {
      filtered = filtered.filter((s) => s.risk_level === filters.riskLevel);
    }

    if (filters.gradeRange && filters.gradeRange !== "all") {
      filtered = filtered.filter((s) => s.predicted_grade === filters.gradeRange);
    }

    if (filters.minInactivityDays !== undefined && filters.minInactivityDays > 0) {
      filtered = filtered.filter((s) => s.inactivity_days >= filters.minInactivityDays!);
    }

    return filtered;
  }
}

// Singleton instance
export const predictionService = new PredictionService();
