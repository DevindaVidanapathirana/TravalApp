import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { Recommendation } from "../types/student";
import { Clock, TrendingUp } from "lucide-react";

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAssign?: () => void;
}

export function RecommendationCard({ recommendation, onAssign }: RecommendationCardProps) {
  const typeColors: Record<Recommendation["type"], string> = {
    Quiz: "bg-blue-100 text-blue-800",
    Assignment: "bg-purple-100 text-purple-800",
    "Course Module": "bg-green-100 text-green-800",
    "Video Lecture": "bg-orange-100 text-orange-800",
    "Practice Exercise": "bg-pink-100 text-pink-800",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{recommendation.title}</CardTitle>
          <Badge className={typeColors[recommendation.type]}>{recommendation.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span className="font-semibold">+{recommendation.expected_gain} marks</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{recommendation.estimated_minutes} mins</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{recommendation.explanation}</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm" onClick={onAssign}>
          Assign
        </Button>
        <Button size="sm" variant="outline">
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
