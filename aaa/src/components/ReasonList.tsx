import { AlertCircle, AlertTriangle, Info } from "lucide-react";

interface ReasonListProps {
  reasons: string[];
  type?: "warning" | "danger" | "info";
}

export function ReasonList({ reasons, type = "info" }: ReasonListProps) {
  const Icon = type === "danger" ? AlertCircle : type === "warning" ? AlertTriangle : Info;
  const colorClass =
    type === "danger"
      ? "text-red-600"
      : type === "warning"
      ? "text-orange-600"
      : "text-blue-600";

  return (
    <ul className="space-y-2">
      {reasons.map((reason, index) => (
        <li key={index} className="flex items-start gap-2">
          <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${colorClass}`} />
          <span className="text-sm text-muted-foreground">{reason}</span>
        </li>
      ))}
    </ul>
  );
}
