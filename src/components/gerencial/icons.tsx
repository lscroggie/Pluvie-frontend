type IconProps = { className?: string };

export function DropIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M8 1.5c2.2 2.8 4.5 5.9 4.5 8.5a4.5 4.5 0 1 1-9 0c0-2.6 2.3-5.7 4.5-8.5Z" />
    </svg>
  );
}

export function DashboardIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="1.5" y="8.5" width="3" height="6" rx="0.75" />
      <rect x="6.5" y="5" width="3" height="9.5" rx="0.75" />
      <rect x="11.5" y="2" width="3" height="12.5" rx="0.75" />
    </svg>
  );
}

export function BuildingIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="2" y="2" width="8" height="12.5" rx="0.75" />
      <path d="M4.5 5h1M4.5 8h1M4.5 11h1M8 5h1M8 8h1M8 11h1" strokeLinecap="round" />
      <path d="M10 6.5h3.5v8h-3.5" />
    </svg>
  );
}

export function ReportsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="2.5" y="1.5" width="11" height="13" rx="1" />
      <path d="M5 5h6M5 8h6M5 11h3.5" strokeLinecap="round" />
    </svg>
  );
}

export function GearIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <circle cx="8" cy="8" r="2.25" />
      <path
        d="M8 1.75v1.5M8 12.75v1.5M14.25 8h-1.5M3.25 8h-1.5M12.36 3.64l-1.06 1.06M4.7 11.3l-1.06 1.06M12.36 12.36l-1.06-1.06M4.7 4.7 3.64 3.64"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DownloadIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M8 2v8" strokeLinecap="round" />
      <path d="M4.5 6.5 8 10l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 13.5h11" strokeLinecap="round" />
    </svg>
  );
}
