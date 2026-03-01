/**
 * WealthDash Logo
 *
 * A stylized "W" monogram composed of ascending bars that form the letter W,
 * representing portfolio growth. The bars graduate in height from outside
 * to center, creating both the letter shape and an upward-trending chart motif.
 */

export function Logo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="WealthDash logo"
    >
      <title>WealthDash</title>
      {/* Background rounded square */}
      <rect width="40" height="40" rx="10" fill="url(#logo-gradient)" />

      {/* W-shaped ascending bars */}
      {/* Bar 1 — left outer (medium height) */}
      <rect x="6" y="16" width="4" height="14" rx="1.5" fill="white" opacity="0.9" />
      {/* Bar 2 — left inner (tall, descending into W valley) */}
      <rect x="12" y="22" width="4" height="8" rx="1.5" fill="white" opacity="0.7" />
      {/* Bar 3 — center peak (tallest, the W middle peak) */}
      <rect x="18" y="12" width="4" height="18" rx="1.5" fill="white" opacity="1" />
      {/* Bar 4 — right inner (tall, descending into W valley) */}
      <rect x="24" y="22" width="4" height="8" rx="1.5" fill="white" opacity="0.7" />
      {/* Bar 5 — right outer (medium height) */}
      <rect x="30" y="16" width="4" height="14" rx="1.5" fill="white" opacity="0.9" />

      {/* Upward trend line accent (gold) */}
      <path
        d="M8 26 L14 22 L20 14 L26 22 L32 18"
        stroke="oklch(0.83 0.13 80)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.9"
      />

      <defs>
        {/* Emerald gradient for logo background */}
        <linearGradient
          id="logo-gradient"
          x1="0"
          y1="0"
          x2="40"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="oklch(0.52 0.14 162)" />
          <stop offset="100%" stopColor="oklch(0.37 0.10 162)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * Small icon version for favicon-like usage or compact spaces.
 */
export function LogoMark({ className = 'h-6 w-6' }: { className?: string }) {
  return <Logo className={className} />;
}
