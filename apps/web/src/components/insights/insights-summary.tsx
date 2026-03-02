import type { InsightsSummary } from '../../types/insights';

interface InsightsSummaryBannerProps {
  summary: InsightsSummary;
}

export function InsightsSummaryBanner({ summary }: InsightsSummaryBannerProps) {
  if (summary.total_insights === 0) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-success-200 bg-success-50/50 p-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success-100">
          <svg
            className="h-5 w-5 text-success-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <title>All clear</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-success-900">All clear</p>
          <p className="text-sm text-success-700">
            Your portfolio allocation looks healthy. No issues detected.
          </p>
        </div>
      </div>
    );
  }

  const parts: string[] = [];
  if (summary.critical > 0) parts.push(`${summary.critical} critical`);
  if (summary.warning > 0)
    parts.push(`${summary.warning} warning${summary.warning > 1 ? 's' : ''}`);
  if (summary.info > 0) parts.push(`${summary.info} info`);

  const hasCritical = summary.critical > 0;
  const borderColor = hasCritical ? 'border-danger-200' : 'border-warning-200';
  const bgColor = hasCritical ? 'bg-danger-50/50' : 'bg-warning-50/50';
  const iconBg = hasCritical ? 'bg-danger-100' : 'bg-warning-100';
  const iconColor = hasCritical ? 'text-danger-600' : 'text-warning-600';
  const titleColor = hasCritical ? 'text-danger-900' : 'text-warning-900';
  const subtitleColor = hasCritical ? 'text-danger-700' : 'text-warning-700';

  return (
    <div className={`flex items-center gap-3 rounded-xl border ${borderColor} ${bgColor} p-5`}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
        <svg
          className={`h-5 w-5 ${iconColor}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <title>Insights found</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>
      <div>
        <p className={`text-sm font-semibold ${titleColor}`}>
          {summary.total_insights} insight{summary.total_insights > 1 ? 's' : ''} found
        </p>
        <p className={`text-sm ${subtitleColor}`}>{parts.join(', ')}</p>
      </div>
    </div>
  );
}
