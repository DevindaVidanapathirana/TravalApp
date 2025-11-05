import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { Student } from "../types/student";
import { TrendSparkline } from "./TrendSparkline";

interface DataTableProps {
  students: Student[];
  onViewProfile: (studentId: string) => void;
}

export function DataTable({ students, onViewProfile }: DataTableProps) {
  const getPersonaBadgeVariant = (
    persona: Student["engagement_persona"]
  ): "default" | "secondary" | "destructive" => {
    if (persona === "Highly Engaged") return "default";
    if (persona === "Moderately Engaged") return "secondary";
    return "destructive";
  };

  const getRiskBadgeVariant = (
    
    risk: Student["risk_level"]
  ): "default" | "secondary" | "destructive" => {
    if (risk === "Low") return "default";
    if (risk === "Medium") return "secondary";
    return "destructive";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student ID</TableHead>
          <TableHead>Engagement</TableHead>
          <TableHead>Dropout Risk</TableHead>
          <TableHead>Predicted Grade</TableHead>
          <TableHead>Trend</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">
              No students found
            </TableCell>
          </TableRow>
        ) : (
          students.map((student) => (
            <TableRow key={student.student_id}>
              <TableCell className="font-medium">{student.student_id}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">{student.engagement_score}%</span>
                  <Badge variant={getPersonaBadgeVariant(student.engagement_persona)}>
                    {student.engagement_persona}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">{student.dropout_risk_score}%</span>
                  <Badge variant={getRiskBadgeVariant(student.risk_level)}>
                    {student.risk_level} Risk
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-lg">{student.predicted_grade}</span>
                  <span className="text-xs text-muted-foreground">
                    {student.predicted_score.toFixed(1)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="w-24">
                  <TrendSparkline data={student.engagement_trend} />
                </div>
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewProfile(student.student_id)}
                >
                  View Profile
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
