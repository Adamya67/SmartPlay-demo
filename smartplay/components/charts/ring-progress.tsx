"use client";

export function RingProgress({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="size-32 -rotate-90" viewBox="0 0 110 110">
        <circle
          cx="55"
          cy="55"
          r={radius}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="10"
          fill="transparent"
        />
        <circle
          cx="55"
          cy="55"
          r={radius}
          stroke="#b5ff5d"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="font-display text-4xl font-semibold text-white">{value}%</div>
        <div className="mt-2 max-w-24 text-xs leading-tight text-slate-400">
          {label}
        </div>
      </div>
    </div>
  );
}
