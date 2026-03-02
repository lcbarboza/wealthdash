import { NavLink } from 'react-router-dom';
import type { ReportMeta } from '../../types/report';

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  return `${kb.toFixed(1)} KB`;
}

interface ReportListProps {
  reports: ReportMeta[];
  activeSlug: string | undefined;
}

export function ReportList({ reports, activeSlug }: ReportListProps) {
  return (
    <div className="space-y-1 p-3">
      {reports.map((report) => (
        <NavLink
          key={report.slug}
          to={`/reports/${report.slug}`}
          className={() =>
            [
              'block rounded-lg border px-4 py-3 transition-colors',
              report.slug === activeSlug
                ? 'border-primary-200 bg-primary-50'
                : 'border-transparent hover:border-neutral-200 hover:bg-neutral-50',
            ].join(' ')
          }
        >
          <h3
            className={[
              'text-sm font-semibold leading-snug',
              report.slug === activeSlug ? 'text-primary-700' : 'text-neutral-900',
            ].join(' ')}
          >
            {report.title}
          </h3>
          <div className="mt-1 flex items-center gap-3 text-xs text-neutral-400">
            <span>{formatDate(report.date)}</span>
            <span>{formatSize(report.size)}</span>
          </div>
        </NavLink>
      ))}
    </div>
  );
}
