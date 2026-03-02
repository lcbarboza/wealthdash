import type { InsightSeverity } from '../../types/insights';

interface InsightCardProps {
  severity: InsightSeverity;
  title: string;
  description: string;
}

const severityConfig = {
  info: {
    border: 'border-primary-200',
    bg: 'bg-primary-50/50',
    accent: 'bg-primary-500',
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
    titleColor: 'text-primary-900',
  },
  warning: {
    border: 'border-warning-200',
    bg: 'bg-warning-50/50',
    accent: 'bg-warning-500',
    iconBg: 'bg-warning-100',
    iconColor: 'text-warning-600',
    titleColor: 'text-warning-900',
  },
  critical: {
    border: 'border-danger-200',
    bg: 'bg-danger-50/50',
    accent: 'bg-danger-500',
    iconBg: 'bg-danger-100',
    iconColor: 'text-danger-600',
    titleColor: 'text-danger-900',
  },
};

function InfoIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <title>Info</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <title>Warning</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
      />
    </svg>
  );
}

function CriticalIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <title>Critical</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
      />
    </svg>
  );
}

const iconMap: Record<InsightSeverity, () => React.JSX.Element> = {
  info: InfoIcon,
  warning: WarningIcon,
  critical: CriticalIcon,
};

export function InsightCard({ severity, title, description }: InsightCardProps) {
  const config = severityConfig[severity];
  const Icon = iconMap[severity];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border ${config.border} ${config.bg} p-5 transition-shadow hover:shadow-md`}
    >
      {/* Accent bar */}
      <div className={`absolute top-0 left-0 h-1 w-full ${config.accent}`} />

      <div className="flex gap-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.iconBg}`}
        >
          <span className={config.iconColor}>
            <Icon />
          </span>
        </div>
        <div className="min-w-0">
          <h4 className={`text-sm font-semibold ${config.titleColor}`}>{title}</h4>
          <p className="mt-1 text-sm leading-relaxed text-neutral-600">{description}</p>
        </div>
      </div>
    </div>
  );
}
