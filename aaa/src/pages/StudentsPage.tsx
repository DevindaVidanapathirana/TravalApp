import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { DataTable } from "../components/DataTable";
import { predictionService } from "../services/predictionService";
import { Search, Filter } from "lucide-react";

export function StudentsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [personaFilter, setPersonaFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [inactivityDays, setInactivityDays] = useState(0);

  // Apply URL params on mount
  useEffect(() => {
    const risk = searchParams.get("risk");
    const inactive = searchParams.get("inactive");
    if (risk) setRiskFilter(risk);
    if (inactive) setInactivityDays(Number(inactive));
  }, [searchParams]);

  const filteredStudents = predictionService.filterStudents({
    search,
    persona: personaFilter,
    riskLevel: riskFilter,
    gradeRange: gradeFilter,
    minInactivityDays: inactivityDays,
  });

  const handleViewProfile = (studentId: string) => {
    navigate(`/students/${studentId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Students</h2>
        <p className="text-muted-foreground">
          Search and filter students by engagement and performance
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="text-sm font-medium mb-2 block">Search Student ID</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="STU00001"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Engagement Persona</label>
              <select
                value={personaFilter}
                onChange={(e) => setPersonaFilter(e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background"
              >
                <option value="all">All</option>
                <option value="Highly Engaged">Highly Engaged</option>
                <option value="Moderately Engaged">Moderately Engaged</option>
                <option value="At-risk">At-risk</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Risk Level</label>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background"
              >
                <option value="all">All</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Predicted Grade</label>
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background"
              >
                <option value="all">All</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Min Inactivity Days
              </label>
              <Input
                type="number"
                min="0"
                value={inactivityDays}
                onChange={(e) => setInactivityDays(Number(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>
            Results ({filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable students={filteredStudents} onViewProfile={handleViewProfile} />
        </CardContent>
      </Card>
    </div>
  );
}
