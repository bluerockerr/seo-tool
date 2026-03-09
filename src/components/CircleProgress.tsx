interface CircleProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export default function CircleProgress({
  percentage,
  size = 200,
  strokeWidth = 20
}: CircleProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getLabel = (score: number) => {
    if (score >= 80) return 'Good';
    if (score >= 60) return 'Needs Improvement';
    return 'Poor';
  };

  const color = getColor(percentage);
  const label = getLabel(percentage);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="-0.2em"
          className="text-5xl font-bold transform rotate-90"
          style={{ fill: '#1f2937' }}
        >
          {percentage}%
        </text>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="1.5em"
          className="text-sm transform rotate-90"
          style={{ fill: '#6b7280' }}
        >
          Overall
        </text>
      </svg>
      <div
        className="mt-4 px-4 py-1 rounded-full text-sm font-medium"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {label}
      </div>
    </div>
  );
}
