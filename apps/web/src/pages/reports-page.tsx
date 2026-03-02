import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ReportEmpty } from '../components/reports/report-empty';
import { ReportList } from '../components/reports/report-list';
import { ReportViewer } from '../components/reports/report-viewer';
import { getReport, listReports } from '../services/api/reports';
import type { Report, ReportMeta } from '../types/report';

export function ReportsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [reports, setReports] = useState<ReportMeta[]>([]);
  const [selected, setSelected] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listReports();
      setReports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  // Load selected report when slug changes
  useEffect(() => {
    if (!slug) {
      setSelected(null);
      return;
    }

    let cancelled = false;
    setLoadingReport(true);

    getReport(slug)
      .then((data) => {
        if (!cancelled) setSelected(data);
      })
      .catch(() => {
        if (!cancelled) {
          setSelected(null);
          navigate('/reports', { replace: true });
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingReport(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, navigate]);

  return (
    <div className="flex h-screen">
      {/* Left panel -- report list */}
      <div className="flex w-80 flex-col border-r border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-5 py-4">
          <h2 className="text-lg font-bold tracking-tight text-neutral-900">Reports</h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            {reports.length} report{reports.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="space-y-2 p-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-lg border border-neutral-100 bg-neutral-50"
                />
              ))}
            </div>
          ) : error ? (
            <div className="p-5 text-center">
              <p className="text-sm text-danger-600">{error}</p>
              <button
                type="button"
                onClick={loadList}
                className="mt-3 rounded-lg bg-primary-600 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-700"
              >
                Retry
              </button>
            </div>
          ) : reports.length === 0 ? (
            <div className="p-5 text-center">
              <p className="text-sm text-neutral-500">No reports yet.</p>
              <p className="mt-1 text-xs text-neutral-400">
                Use the investment-report skill to generate your first report.
              </p>
            </div>
          ) : (
            <ReportList reports={reports} activeSlug={slug} />
          )}
        </div>
      </div>

      {/* Right panel -- report viewer */}
      <div className="flex flex-1 flex-col overflow-hidden bg-neutral-50">
        {loadingReport ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
          </div>
        ) : selected ? (
          <ReportViewer report={selected} />
        ) : (
          <ReportEmpty />
        )}
      </div>
    </div>
  );
}
