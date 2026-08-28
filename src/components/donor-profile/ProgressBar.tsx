"use client";

import { useEffect, useState } from "react";

export function ProgressBar({
  progress,
  delayMs = 0,
  className,
  barClassName,
}: {
  progress: number;
  delayMs?: number;
  className?: string;
  barClassName?: string;
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(progress), delayMs);
    return () => clearTimeout(timer);
  }, [progress, delayMs]);

  return (
    <div className={className}>
      <div
        className={`h-full rounded-full ${barClassName ?? ""}`}
        style={{ width: `${width}%`, transition: "width 900ms ease-out" }}
      />
    </div>
  );
}
