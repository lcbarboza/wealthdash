import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Report } from '../../types/report';

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

interface ReportViewerProps {
  report: Report;
}

export function ReportViewer({ report }: ReportViewerProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white px-8 py-5">
        <h1 className="text-xl font-bold tracking-tight text-neutral-900">{report.title}</h1>
        <p className="mt-1 text-xs text-neutral-500">{formatDate(report.date)}</p>
      </div>

      {/* Markdown content */}
      <div className="flex-1 overflow-auto">
        <article className="prose mx-auto max-w-4xl px-8 py-8">
          <Markdown remarkPlugins={[remarkGfm]}>{report.content}</Markdown>
        </article>
      </div>
    </div>
  );
}
