import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KpiCard } from "../components/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { predictionService } from "../services/predictionService";
import {
  Activity,
  AlertCircle,
  TrendingUp,
  Upload,
  Play,
  FileText,
  Users,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export function DashboardPage() {
  const navigate = useNavigate();
  const [isRunningPredictions, setIsRunningPredictions] = useState(false);

  const kpiMetrics = predictionService.getKpiMetrics();
  const alerts = predictionService.getAlerts();

  const handleRunPredictions = () => {
    setIsRunningPredictions(true);
    setTimeout(() => {
      predictionService.runPredictions();
      setIsRunningPredictions(false);
      alert("Predictions updated successfully!");
    }, 1500);
  };

  const handleAlertClick = (type: string) => {
    if (type === "high-risk") {
      navigate("/students?risk=High");
    } else if (type === "inactive") {
      navigate("/students?inactive=7");
    } else if (type === "engagement-drop") {
      navigate("/students");
    }
  };

  const riskDistributionData = [
    { name: "Low", value: kpiMetrics.riskDistribution.low, color: "#22c55e" },
    { name: "Medium", value: kpiMetrics.riskDistribution.medium, color: "#f59e0b" },
    { name: "High", value: kpiMetrics.riskDistribution.high, color: "#ef4444" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Monitor student engagement and performance at a glance
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Avg Engagement Score"
          value={`${kpiMetrics.avgEngagement}%`}
          icon={Activity}
          description="Across all students"
        />
        <KpiCard
          title="At-Risk Students"
          value={kpiMetrics.atRiskCount}
          icon={AlertCircle}
          description="High dropout risk"
        />
        <KpiCard
          title="Predicted Pass Rate"
          value={`${kpiMetrics.predictedPassRate}%`}
          icon={TrendingUp}
          description="Grade D or higher"
        />
        <KpiCard
          title="Total Students"
          value={predictionService.getAllStudents().length}
          icon={Users}
          description="Active enrollment"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No alerts at this time</p>
              ) : (
                alerts.map((alert) => (
                  <button
                    key={alert.id}
                    onClick={() => handleAlertClick(alert.type)}
                    className="w-full flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors text-left"
                  >
                    <AlertCircle
                      className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        alert.type === "high-risk"
                          ? "text-red-600"
                          : alert.type === "inactive"
                          ? "text-orange-600"
                          : "text-blue-600"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dropout Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Dropout Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={riskDistributionData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => alert("Upload feature coming soon!")}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Data
            </Button>
            <Button
              variant="outline"
              onClick={handleRunPredictions}
              disabled={isRunningPredictions}
            >
              <Play className="h-4 w-4 mr-2" />
              {isRunningPredictions ? "Running..." : "Run Predictions"}
            </Button>
            <Button variant="outline" onClick={() => navigate("/students?recommendations=true")}>
              <FileText className="h-4 w-4 mr-2" />
              View Recommendations
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
