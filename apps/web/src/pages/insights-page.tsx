import { useCallback, useEffect, useState } from 'react';
import { AllocationSection } from '../components/insights/allocation-section';
import { fetchAllocationInsights } from '../services/api/insights';
import type { AllocationInsightsResponse } from '../types/insights';

export function InsightsPage() {
  const [data, setData] = useState<AllocationInsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAllocationInsights();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load insights');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Insights</h2>
        <div className="h-16 animate-pulse rounded-xl border border-neutral-200 bg-neutral-50" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl border border-neutral-200 bg-neutral-50"
            />
          ))}
        </div>
      </div>
    );
  }

  // ---------- Error ----------
  if (error) {
    return (
      <div className="p-6">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-neutral-900">Insights</h2>
        <div className="rounded-xl border border-danger-200 bg-danger-50 p-8 text-center">
          <p className="text-sm text-danger-700">{error}</p>
          <button
            type="button"
            onClick={load}
            className="mt-4 rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Insights</h2>
      <AllocationSection data={data} />
    </div>
  );
}
