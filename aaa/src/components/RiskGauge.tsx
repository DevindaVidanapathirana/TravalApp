interface RiskGaugeProps {
  value: number; // 0-100
  size?: "sm" | "md" | "lg";
}

export function RiskGauge({ value, size = "md" }: RiskGaugeProps) {
  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-48 h-48",
  };

  const radius = size === "sm" ? 36 : size === "md" ? 48 : 72;
  const strokeWidth = size === "sm" ? 8 : size === "md" ? 10 : 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  let color = "#22c55e"; // green
  if (value >= 60) color = "#ef4444"; // red
  else if (value >= 30) color = "#f59e0b"; // orange

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold">{value.toFixed(0)}%</span>
      </div>
    </div>
  );
}
