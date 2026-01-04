import type { Student, Recommendation } from "../types/student";

// Seeded random number generator for consistent results
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function randomBetween(min: number, max: number, rng: () => number): number {
  return min + rng() * (max - min);
}

function randomInt(min: number, max: number, rng: () => number): number {
  return Math.floor(randomBetween(min, max + 1, rng));
}

function randomChoice<T>(array: T[], rng: () => number): T {
  return array[Math.floor(rng() * array.length)];
}

function generateRecommendations(
  student_id: string,
  weakAreas: string[],
  rng: () => number
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const types: Recommendation["type"][] = [
    "Quiz",
    "Assignment",
    "Course Module",
    "Video Lecture",
    "Practice Exercise",
  ];

  const topics = [
    "Data Structures",
    "Algorithms",
    "Database Design",
    "Web Development",
    "Software Engineering",
    "Machine Learning",
    "Networks",
    "Operating Systems",
  ];

  const count = randomInt(2, 5, rng);
  for (let i = 0; i < count; i++) {
    const type = randomChoice(types, rng);
    const topic = randomChoice(topics, rng);
    const weakArea = weakAreas.length > 0 ? randomChoice(weakAreas, rng) : "general improvement";

    recommendations.push({
      id: `rec-${student_id}-${i}`,
      title: `${type}: ${topic}`,
      type,
      expected_gain: parseFloat(randomBetween(2, 15, rng).toFixed(1)),
      estimated_minutes: randomInt(20, 120, rng),
      explanation: `This ${type.toLowerCase()} targets ${weakArea} and will help strengthen your understanding of ${topic.toLowerCase()}.`,
    });
  }

  return recommendations;
}

function generateStudent(index: number): Student {
  const rng = seededRandom(index * 12345);
  const student_id = `STU${String(index + 1).padStart(5, "0")}`;

  // Behavior metrics with correlation to engagement level
  const baseEngagement = randomBetween(0, 1, rng);
  const login_frequency = randomBetween(
    baseEngagement * 3 + 1,
    baseEngagement * 12 + 5,
    rng
  );
  const session_duration = randomBetween(
    baseEngagement * 30 + 10,
    baseEngagement * 90 + 30,
    rng
  );
  const forum_participation = randomBetween(0, baseEngagement * 8 + 2, rng);
  const assignment_access_rate = randomBetween(
    baseEngagement * 0.4 + 0.2,
    baseEngagement * 0.3 + 0.7,
    rng
  );
  const time_gap_avg = randomBetween((1 - baseEngagement) * 5 + 1, (1 - baseEngagement) * 10 + 3, rng);
  const inactivity_days = randomInt(0, Math.floor((1 - baseEngagement) * 20 + 5), rng);

  // Generate engagement trend (12 weeks)
  const engagement_trend: number[] = [];
  let trendBase = baseEngagement * 100;
  for (let week = 0; week < 12; week++) {
    const variation = randomBetween(-10, 10, rng);
    trendBase = Math.max(0, Math.min(100, trendBase + variation));
    engagement_trend.push(parseFloat(trendBase.toFixed(1)));
  }

  // Sentiment
  const sentiment_score = randomBetween(-0.8, 0.9, rng);
  let sentiment_label: "positive" | "neutral" | "negative";
  if (sentiment_score > 0.3) sentiment_label = "positive";
  else if (sentiment_score < -0.3) sentiment_label = "negative";
  else sentiment_label = "neutral";

  const positiveKeywords = ["helpful", "engaging", "clear", "interesting", "challenging"];
  const neutralKeywords = ["average", "okay", "standard", "basic", "routine"];
  const negativeKeywords = ["confusing", "difficult", "boring", "unclear", "overwhelming"];

  let keywordPool =
    sentiment_label === "positive"
      ? positiveKeywords
      : sentiment_label === "negative"
      ? negativeKeywords
      : neutralKeywords;

  const top_keywords = [
    randomChoice(keywordPool, rng),
    randomChoice(keywordPool, rng),
    randomChoice(keywordPool, rng),
  ];

  const feedback_texts = [
    sentiment_label === "positive"
      ? "I really enjoyed this course and learned a lot."
      : sentiment_label === "negative"
      ? "The material was confusing and hard to follow."
      : "The course was okay, nothing special.",
    sentiment_label === "positive"
      ? "Great instructor and well-structured content."
      : sentiment_label === "negative"
      ? "Assignments were too difficult without proper guidance."
      : "Content was standard, met my expectations.",
  ];

  // Performance metrics
  const basePerformance = randomBetween(0.3, 1, rng);
  const quiz_avg = randomBetween(basePerformance * 40 + 30, basePerformance * 30 + 70, rng);
  const assignment_avg = randomBetween(basePerformance * 40 + 30, basePerformance * 30 + 70, rng);
  const exam_avg = randomBetween(basePerformance * 40 + 30, basePerformance * 30 + 70, rng);
  const time_spent_hours = randomBetween(baseEngagement * 50 + 20, baseEngagement * 80 + 100, rng);
  const progress_pct = randomBetween(baseEngagement * 40 + 30, baseEngagement * 20 + 80, rng);
  const historical_gpa = randomBetween(basePerformance * 1.5 + 1.5, basePerformance * 1 + 3, rng);
  const ETI_score = randomBetween(basePerformance * 40 + 30, basePerformance * 30 + 70, rng);

  // Engagement score (weighted behavior)
  const engagement_score =
    login_frequency * 0.2 +
    (session_duration / 120) * 100 * 0.15 +
    forum_participation * 2 * 0.15 +
    assignment_access_rate * 100 * 0.2 +
    ((10 - time_gap_avg) / 10) * 100 * 0.15 +
    ((30 - inactivity_days) / 30) * 100 * 0.15;

  const normalized_engagement = Math.max(0, Math.min(100, engagement_score));

  let engagement_persona: "Highly Engaged" | "Moderately Engaged" | "At-risk";
  if (normalized_engagement >= 70) engagement_persona = "Highly Engaged";
  else if (normalized_engagement >= 40) engagement_persona = "Moderately Engaged";
  else engagement_persona = "At-risk";

  // Predicted score (performance + engagement + ETI)
  const predicted_score =
    quiz_avg * 0.25 +
    assignment_avg * 0.25 +
    exam_avg * 0.3 +
    ETI_score * 0.1 +
    (normalized_engagement / 100) * 10;

  let predicted_grade: string;
  if (predicted_score >= 90) predicted_grade = "A";
  else if (predicted_score >= 80) predicted_grade = "B";
  else if (predicted_score >= 70) predicted_grade = "C";
  else if (predicted_score >= 60) predicted_grade = "D";
  else predicted_grade = "F";

  // Dropout risk (inactivity + low engagement + negative sentiment)
  const dropout_risk_score =
    (inactivity_days / 30) * 100 * 0.4 +
    ((100 - normalized_engagement) / 100) * 100 * 0.4 +
    ((1 - sentiment_score) / 2) * 100 * 0.2;

  const normalized_dropout_risk = Math.max(0, Math.min(100, dropout_risk_score));

  let risk_level: "Low" | "Medium" | "High";
  if (normalized_dropout_risk >= 60) risk_level = "High";
  else if (normalized_dropout_risk >= 30) risk_level = "Medium";
  else risk_level = "Low";

  // Identify weak areas for recommendations
  const weakAreas: string[] = [];
  if (quiz_avg < 60) weakAreas.push("quiz performance");
  if (assignment_avg < 60) weakAreas.push("assignment completion");
  if (forum_participation < 2) weakAreas.push("forum engagement");
  if (inactivity_days > 7) weakAreas.push("consistent activity");

  const recommendations = generateRecommendations(student_id, weakAreas, rng);

  const programs = [
    "Computer Science",
    "Data Science",
    "Software Engineering",
    "Information Technology",
    "Cybersecurity",
  ];

  const daysAgo = inactivity_days;
  const last_activity = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

  const actual_score = rng() > 0.3 ? parseFloat((predicted_score + randomBetween(-5, 5, rng)).toFixed(1)) : undefined;

  return {
    student_id,
    login_frequency: parseFloat(login_frequency.toFixed(1)),
    session_duration: parseFloat(session_duration.toFixed(1)),
    forum_participation: parseFloat(forum_participation.toFixed(1)),
    assignment_access_rate: parseFloat(assignment_access_rate.toFixed(2)),
    time_gap_avg: parseFloat(time_gap_avg.toFixed(1)),
    inactivity_days,
    engagement_trend,
    feedback_texts,
    sentiment_score: parseFloat(sentiment_score.toFixed(2)),
    sentiment_label,
    top_keywords,
    quiz_avg: parseFloat(quiz_avg.toFixed(1)),
    assignment_avg: parseFloat(assignment_avg.toFixed(1)),
    exam_avg: parseFloat(exam_avg.toFixed(1)),
    time_spent_hours: parseFloat(time_spent_hours.toFixed(1)),
    progress_pct: parseFloat(progress_pct.toFixed(1)),
    historical_gpa: parseFloat(historical_gpa.toFixed(2)),
    ETI_score: parseFloat(ETI_score.toFixed(1)),
    actual_score,
    predicted_score: parseFloat(predicted_score.toFixed(1)),
    predicted_grade,
    engagement_score: parseFloat(normalized_engagement.toFixed(1)),
    engagement_persona,
    dropout_risk_score: parseFloat(normalized_dropout_risk.toFixed(1)),
    risk_level,
    recommendations,
    program: randomChoice(programs, rng),
    last_activity,
  };
}

// Generate 200 students
export const mockStudents: Student[] = Array.from({ length: 200 }, (_, i) =>
  generateStudent(i)
);
