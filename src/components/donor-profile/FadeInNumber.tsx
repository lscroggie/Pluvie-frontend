"use client";

import { useEffect, useState } from "react";

export function FadeInNumber({
  value,
  className,
  delayMs = 0,
}: {
  value: number;
  className?: string;
  delayMs?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 550ms ease-out, transform 550ms ease-out",
      }}
    >
      {value}
    </span>
  );
}
