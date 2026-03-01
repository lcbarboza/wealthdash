import { useCallback, useEffect, useState } from 'react';
import { DonutChart } from '../components/dashboard/donut-chart';
import { HorizontalBarChart } from '../components/dashboard/horizontal-bar-chart';
import { SummaryCard } from '../components/dashboard/summary-card';
import { TreemapChart } from '../components/dashboard/treemap-chart';
import { fetchPortfolioSummary } from '../services/api/portfolio';
import { ASSET_CLASS_LABELS, ASSET_TYPE_LABELS, CURRENCY_LABELS } from '../types/asset';
import type { PortfolioSummary } from '../types/portfolio';

function formatBrl(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatSignedBrl(value: number): string {
  const formatted = formatBrl(Math.abs(value));
  return value >= 0 ? `+${formatted}` : `-${formatted}`;
}

function formatSignedPct(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function DashboardPage() {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPortfolioSummary();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portfolio summary');
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
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Dashboard</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-neutral-200 bg-neutral-50"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-xl border border-neutral-200 bg-neutral-50"
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
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-neutral-900">Dashboard</h2>
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

  if (!summary) return null;

  const byWallet = summary.by_wallet ?? [];

  const gainVariant =
    summary.total_gain > 0 ? 'positive' : summary.total_gain < 0 ? 'negative' : 'default';

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Dashboard</h2>

      {/* ========== Summary Cards ========== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total Value" value={formatBrl(summary.total_value)} />
        <SummaryCard
          label="Unrealized Gain / Loss"
          value={formatSignedBrl(summary.total_gain)}
          subValue={formatSignedPct(summary.total_gain_pct)}
          variant={gainVariant}
        />
        <SummaryCard label="Positions" value={String(summary.total_positions)} />
        {summary.positions_missing_price > 0 ? (
          <SummaryCard
            label="Missing Price"
            value={`${summary.positions_missing_price} position${summary.positions_missing_price > 1 ? 's' : ''}`}
            subValue="Excluded from allocation"
            variant="warning"
          />
        ) : (
          <SummaryCard label="Wallets" value={String(byWallet.length)} />
        )}
      </div>

      {/* ========== Charts Grid — Row 1: Asset Class + Asset Type ========== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Asset Class — Donut */}
        <section className="rounded-xl border border-neutral-200 bg-white">
          <div className="border-b border-neutral-100 px-6 py-4">
            <h3 className="text-sm font-semibold tracking-wide text-neutral-900 uppercase">
              Allocation by Asset Class
            </h3>
          </div>
          <div className="px-6 py-5">
            <DonutChart items={summary.by_asset_class} labelMap={ASSET_CLASS_LABELS} />
          </div>
        </section>

        {/* Asset Type — Donut */}
        <section className="rounded-xl border border-neutral-200 bg-white">
          <div className="border-b border-neutral-100 px-6 py-4">
            <h3 className="text-sm font-semibold tracking-wide text-neutral-900 uppercase">
              Allocation by Asset Type
            </h3>
          </div>
          <div className="px-6 py-5">
            <DonutChart items={summary.by_asset_type} labelMap={ASSET_TYPE_LABELS} />
          </div>
        </section>
      </div>

      {/* ========== Charts Grid — Row 2: Currency + Wallet ========== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Currency Exposure — Donut */}
        <section className="rounded-xl border border-neutral-200 bg-white">
          <div className="border-b border-neutral-100 px-6 py-4">
            <h3 className="text-sm font-semibold tracking-wide text-neutral-900 uppercase">
              Currency Exposure
            </h3>
          </div>
          <div className="px-6 py-5">
            <DonutChart items={summary.by_currency} labelMap={CURRENCY_LABELS} height={220} />
          </div>
        </section>

        {/* Wallet Allocation — Donut */}
        <section className="rounded-xl border border-neutral-200 bg-white">
          <div className="border-b border-neutral-100 px-6 py-4">
            <h3 className="text-sm font-semibold tracking-wide text-neutral-900 uppercase">
              Allocation by Wallet
            </h3>
          </div>
          <div className="px-6 py-5">
            <DonutChart items={byWallet} height={220} />
          </div>
        </section>
      </div>

      {/* ========== Sector Allocation — Treemap (full width) ========== */}
      <section className="rounded-xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-100 px-6 py-4">
          <h3 className="text-sm font-semibold tracking-wide text-neutral-900 uppercase">
            Sector Allocation
          </h3>
        </div>
        <div className="px-6 py-5">
          <TreemapChart items={summary.by_sector} height={300} />
        </div>
      </section>

      {/* ========== Top Holdings — Horizontal Bar (full width) ========== */}
      <section className="rounded-xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-100 px-6 py-4">
          <h3 className="text-sm font-semibold tracking-wide text-neutral-900 uppercase">
            Top Holdings
          </h3>
        </div>
        <div className="px-6 py-5">
          <HorizontalBarChart holdings={summary.top_holdings} maxItems={15} />
        </div>
      </section>
    </div>
  );
}
