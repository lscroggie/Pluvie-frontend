export function PluvieLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 384 512" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient
          id="pluvie-logo-gradient"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="0"
          y2="512"
        >
          <stop stopColor="#6C5CE7" />
          <stop offset="1" stopColor="#FF7675" />
        </linearGradient>
      </defs>
      <path
        d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0h1.8c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192z"
        fill="url(#pluvie-logo-gradient)"
      />
    </svg>
  );
}
