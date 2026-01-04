import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { RiskGauge } from "../components/RiskGauge";
import { ReasonList } from "../components/ReasonList";
import { RecommendationCard } from "../components/RecommendationCard";
import { predictionService } from "../services/predictionService";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function StudentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const student = predictionService.getStudentById(id || "");

  if (!student) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate("/students")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Students
        </Button>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Student not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Generate reasons for engagement persona
  const topReasons: string[] = [];
  if (student.inactivity_days > 7) {
    topReasons.push(`${student.inactivity_days} days inactive (above average)`);
  }
  if (student.forum_participation < 2) {
    topReasons.push("Low forum participation");
  }
  if (student.sentiment_label === "negative") {
    topReasons.push("Negative feedback sentiment");
  }
  if (student.login_frequency < 3) {
    topReasons.push("Low login frequency");
  }
  if (student.time_gap_avg > 5) {
    topReasons.push(`High time gap between activities (${student.time_gap_avg.toFixed(1)} days avg)`);
  }
  if (topReasons.length === 0) {
    topReasons.push("Consistent engagement patterns");
    topReasons.push("Good participation in activities");
  }

  // Behavior metrics for radar chart
  const behaviorData = [
    {
      metric: "Login Freq",
      value: Math.min((student.login_frequency / 12) * 100, 100),
    },
    {
      metric: "Session Duration",
      value: Math.min((student.session_duration / 120) * 100, 100),
    },
    {
      metric: "Forum",
      value: Math.min((student.forum_participation / 8) * 100, 100),
    },
    {
      metric: "Assignments",
      value: student.assignment_access_rate * 100,
    },
    {
      metric: "Activity",
      value: Math.max(0, ((30 - student.inactivity_days) / 30) * 100),
    },
  ];

  // Engagement trend data
  const engagementTrendData = student.engagement_trend.map((score, index) => ({
    week: `W${index + 1}`,
    engagement: score,
  }));

  // Performance comparison
  const performanceData = [
    { name: "Quizzes", score: student.quiz_avg },
    { name: "Assignments", score: student.assignment_avg },
    { name: "Exams", score: student.exam_avg },
    { name: "ETI", score: student.ETI_score },
  ];

  // Actual vs Predicted (if actual exists)
  const comparisonData = student.actual_score
    ? [
        { name: "Predicted", value: student.predicted_score },
        { name: "Actual", value: student.actual_score },
      ]
    : [];

  // Dropout risk drivers
  const riskDrivers: string[] = [];
  if (student.inactivity_days > 10) {
    riskDrivers.push(`High inactivity: ${student.inactivity_days} days`);
  }
  if (student.sentiment_label === "negative") {
    riskDrivers.push("Negative sentiment detected");
  }
  if (student.engagement_score < 40) {
    riskDrivers.push("Low overall engagement");
  }
  if (student.time_gap_avg > 7) {
    riskDrivers.push("Inconsistent activity pattern");
  }
  if (riskDrivers.length === 0) {
    riskDrivers.push("No major risk factors detected");
  }

  // Calculate recommendation scenario
  const totalGain = student.recommendations.reduce((sum, rec) => sum + rec.expected_gain, 0);
  const improvedScore = student.predicted_score + totalGain;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate("/students")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Students
        </Button>
      </div>

      {/* Student Info Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold">{student.student_id}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {student.program}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Last active: {new Date(student.last_activity).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge
                variant={
                  student.engagement_persona === "Highly Engaged"
                    ? "default"
                    : student.engagement_persona === "Moderately Engaged"
                    ? "secondary"
                    : "destructive"
                }
              >
                {student.engagement_persona}
              </Badge>
              <Badge
                variant={
                  student.risk_level === "Low"
                    ? "default"
                    : student.risk_level === "Medium"
                    ? "secondary"
                    : "destructive"
                }
              >
                {student.risk_level} Risk
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="dropout">Dropout Risk</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Engagement Persona</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{student.engagement_persona}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Score: {student.engagement_score}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Engagement Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{student.engagement_score}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on behavior metrics
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Dropout Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{student.dropout_risk_score}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {student.risk_level} risk level
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Predicted Grade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{student.predicted_grade}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Score: {student.predicted_score.toFixed(1)}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Reasons</CardTitle>
            </CardHeader>
            <CardContent>
              <ReasonList
                reasons={topReasons}
                type={
                  student.engagement_persona === "At-risk"
                    ? "danger"
                    : student.engagement_persona === "Moderately Engaged"
                    ? "warning"
                    : "info"
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Behavior Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={behaviorData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Score"
                      dataKey="value"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Trend (12 Weeks)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={engagementTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Login Frequency</p>
                  <p className="text-2xl font-bold">{student.login_frequency}/week</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg Session Duration
                  </p>
                  <p className="text-2xl font-bold">{student.session_duration.toFixed(0)} min</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Forum Participation
                  </p>
                  <p className="text-2xl font-bold">{student.forum_participation.toFixed(1)}/week</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Assignment Access Rate
                  </p>
                  <p className="text-2xl font-bold">
                    {(student.assignment_access_rate * 100).toFixed(0)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Time Gap</p>
                  <p className="text-2xl font-bold">{student.time_gap_avg.toFixed(1)} days</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inactivity Days</p>
                  <p className="text-2xl font-bold">{student.inactivity_days}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {comparisonData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Actual vs Predicted</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Input Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quiz Average</p>
                  <p className="text-2xl font-bold">{student.quiz_avg.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assignment Average</p>
                  <p className="text-2xl font-bold">{student.assignment_avg.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Exam Average</p>
                  <p className="text-2xl font-bold">{student.exam_avg.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ETI Score</p>
                  <p className="text-2xl font-bold">{student.ETI_score.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time Spent</p>
                  <p className="text-2xl font-bold">{student.time_spent_hours.toFixed(0)}h</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Progress</p>
                  <p className="text-2xl font-bold">{student.progress_pct.toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Historical GPA</p>
                  <p className="text-2xl font-bold">{student.historical_gpa.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Predicted Score</p>
                  <p className="text-2xl font-bold">{student.predicted_score.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dropout Risk Tab */}
        <TabsContent value="dropout" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Risk Score</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <RiskGauge value={student.dropout_risk_score} size="lg" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overall Sentiment</p>
                  <Badge
                    className="mt-1"
                    variant={
                      student.sentiment_label === "positive"
                        ? "default"
                        : student.sentiment_label === "negative"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {student.sentiment_label}
                  </Badge>
                  <p className="text-sm mt-1">
                    Score: {student.sentiment_score.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Top Keywords
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {student.top_keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Risk Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <ReasonList reasons={riskDrivers} type={student.risk_level === "High" ? "danger" : student.risk_level === "Medium" ? "warning" : "info"} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {student.feedback_texts.slice(0, 3).map((feedback, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">{feedback}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommendation Scenario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm">
                  <span className="font-semibold">If you complete these{" "}
                  {student.recommendations.length} items,</span> predicted score
                  improves from{" "}
                  <span className="font-bold text-blue-600">
                    {student.predicted_score.toFixed(1)}
                  </span>{" "}
                  →{" "}
                  <span className="font-bold text-green-600">
                    {improvedScore.toFixed(1)}
                  </span>{" "}
                  (+{totalGain.toFixed(1)} marks).
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {student.recommendations.map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                onAssign={() => alert(`Assigned: ${rec.title}`)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
