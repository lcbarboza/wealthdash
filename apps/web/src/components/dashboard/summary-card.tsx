interface SummaryCardProps {
  label: string;
  value: string;
  subValue?: string;
  variant?: 'default' | 'positive' | 'negative' | 'warning';
}

const variantConfig = {
  default: {
    text: 'text-neutral-900',
    sub: 'text-neutral-500',
    accent: 'bg-primary-500',
    bg: 'bg-primary-50/50',
  },
  positive: {
    text: 'text-success-700',
    sub: 'text-success-600',
    accent: 'bg-success-500',
    bg: 'bg-success-50/50',
  },
  negative: {
    text: 'text-danger-700',
    sub: 'text-danger-600',
    accent: 'bg-danger-500',
    bg: 'bg-danger-50/50',
  },
  warning: {
    text: 'text-warning-700',
    sub: 'text-warning-600',
    accent: 'bg-warning-500',
    bg: 'bg-warning-50/50',
  },
};

export function SummaryCard({ label, value, subValue, variant = 'default' }: SummaryCardProps) {
  const v = variantConfig[variant];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-neutral-200 ${v.bg} p-5 transition-shadow hover:shadow-md`}
    >
      {/* Accent bar */}
      <div className={`absolute top-0 left-0 h-1 w-full ${v.accent}`} />

      <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">{label}</p>
      <p className={`mt-1 text-2xl font-bold tracking-tight ${v.text}`}>{value}</p>
      {subValue && <p className={`mt-0.5 text-sm font-medium ${v.sub}`}>{subValue}</p>}
    </div>
  );
}
