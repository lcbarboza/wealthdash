import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { AllocationBreakdownItem } from '../../types/portfolio';
import type { Position } from '../../types/transaction';
import { getChartColor, getSwatchColor } from '../dashboard/chart-colors';

/* ── Formatting helpers ─────────────────────────────────────── */

function formatBrl(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatSignedBrl(value: number): string {
  const formatted = formatBrl(Math.abs(value));
  return value >= 0 ? `+${formatted}` : `-${formatted}`;
}

function formatSignedPct(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/* ── Build allocation breakdown from positions ──────────────── */

function buildBreakdown(
  positions: Position[],
  keyFn: (p: Position) => string,
): AllocationBreakdownItem[] {
  const priced = positions.filter((p) => p.value_brl != null);
  const total = priced.reduce((s, p) => s + (p.value_brl ?? 0), 0);
  if (total === 0) return [];

  const map = new Map<string, { value: number; cost: number; gain: number }>();
  for (const p of priced) {
    const key = keyFn(p);
    const prev = map.get(key) ?? { value: 0, cost: 0, gain: 0 };
    map.set(key, {
      value: prev.value + (p.value_brl ?? 0),
      cost: prev.cost + p.total_cost,
      gain: prev.gain + (p.gain ?? 0),
    });
  }

  return Array.from(map.entries())
    .map(([label, d]) => ({
      label,
      value: d.value,
      weight: (d.value / total) * 100,
      cost: d.cost,
      gain: d.gain,
    }))
    .sort((a, b) => b.value - a.value);
}

/* ── Wallet totals computed from positions ──────────────────── */

interface WalletTotals {
  totalValue: number;
  totalCost: number;
  totalGain: number;
  totalGainPct: number;
  positionsCount: number;
  missingPriceCount: number;
}

function computeTotals(positions: Position[]): WalletTotals {
  const priced = positions.filter((p) => p.value_brl != null);
  const totalValue = priced.reduce((s, p) => s + (p.value_brl ?? 0), 0);
  const totalCost = priced.reduce((s, p) => s + p.total_cost, 0);
  const totalGain = priced.reduce((s, p) => s + (p.gain ?? 0), 0);
  const totalGainPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
  return {
    totalValue,
    totalCost,
    totalGain,
    totalGainPct,
    positionsCount: positions.length,
    missingPriceCount: positions.length - priced.length,
  };
}

/* ── Donut tooltip ──────────────────────────────────────────── */

interface TooltipPayloadEntry {
  name: string;
  value: number;
  payload: { label: string; displayLabel: string; value: number; weight: number; gain: number };
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadEntry[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const gainColor = d.gain > 0 ? 'text-success-600' : d.gain < 0 ? 'text-danger-600' : '';
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-sm font-semibold text-neutral-900">{d.displayLabel}</p>
      <p className="text-xs text-neutral-500">
        {formatBrl(d.value)} &middot; {d.weight.toFixed(1)}%
      </p>
      <p className={`text-xs font-medium ${gainColor}`}>Gain: {formatBrl(d.gain)}</p>
    </div>
  );
}

/* ── Mini summary card (inline) ─────────────────────────────── */

function MiniCard({
  label,
  value,
  subValue,
  variant = 'default',
}: {
  label: string;
  value: string;
  subValue?: string;
  variant?: 'default' | 'positive' | 'negative' | 'warning';
}) {
  const variants = {
    default: { text: 'text-neutral-900', sub: 'text-neutral-500', accent: 'bg-primary-500' },
    positive: { text: 'text-success-700', sub: 'text-success-600', accent: 'bg-success-500' },
    negative: { text: 'text-danger-700', sub: 'text-danger-600', accent: 'bg-danger-500' },
    warning: { text: 'text-warning-700', sub: 'text-warning-600', accent: 'bg-warning-500' },
  };
  const v = variants[variant];
  return (
    <div className="relative overflow-hidden rounded-lg border border-neutral-200 bg-white p-4">
      <div className={`absolute top-0 left-0 h-0.5 w-full ${v.accent}`} />
      <p className="text-[11px] font-medium tracking-wide text-neutral-500 uppercase">{label}</p>
      <p className={`mt-0.5 text-lg font-bold tracking-tight ${v.text}`}>{value}</p>
      {subValue && <p className={`text-xs font-medium ${v.sub}`}>{subValue}</p>}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */

interface WalletSummaryProps {
  positions: Position[];
  loading: boolean;
}

export function WalletSummary({ positions, loading }: WalletSummaryProps) {
  if (loading) {
    return (
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-lg border border-neutral-200 bg-neutral-50"
            />
          ))}
        </div>
        <div className="h-48 animate-pulse rounded-lg border border-neutral-200 bg-neutral-50" />
      </div>
    );
  }

  if (positions.length === 0) return null;

  const totals = computeTotals(positions);
  const byAsset = buildBreakdown(positions, (p) => p.asset_ticker ?? p.asset_name);
  const byType = buildBreakdown(positions, (p) => p.asset_type);

  const gainVariant: 'positive' | 'negative' | 'default' =
    totals.totalGain > 0 ? 'positive' : totals.totalGain < 0 ? 'negative' : 'default';

  const allocationData = byAsset.map((item) => ({
    ...item,
    displayLabel: item.label,
  }));

  return (
    <div className="mb-6 space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MiniCard label="Total Value (BRL)" value={formatBrl(totals.totalValue)} />
        <MiniCard
          label="Unrealized Gain / Loss"
          value={formatSignedBrl(totals.totalGain)}
          subValue={formatSignedPct(totals.totalGainPct)}
          variant={gainVariant}
        />
        <MiniCard
          label="Positions"
          value={String(totals.positionsCount)}
          subValue={
            totals.missingPriceCount > 0 ? `${totals.missingPriceCount} missing price` : undefined
          }
          variant={totals.missingPriceCount > 0 ? 'warning' : 'default'}
        />
      </div>

      {/* Allocation charts */}
      {allocationData.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* By Asset */}
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <h4 className="mb-3 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
              Allocation by Asset
            </h4>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
              <div className="shrink-0" style={{ width: 180, height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      dataKey="value"
                      nameKey="displayLabel"
                      cx="50%"
                      cy="50%"
                      innerRadius="55%"
                      outerRadius="85%"
                      paddingAngle={2}
                      cornerRadius={4}
                      stroke="none"
                    >
                      {allocationData.map((_, i) => (
                        <Cell key={allocationData[i].label} fill={getChartColor(i).fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-1 flex-col gap-1.5 py-1">
                {allocationData.map((d, i) => (
                  <div key={d.label} className="flex items-center gap-2">
                    <span
                      className={`inline-block h-2.5 w-2.5 shrink-0 rounded-sm ${getSwatchColor(i)}`}
                    />
                    <span className="min-w-0 flex-1 truncate text-xs text-neutral-700">
                      {d.displayLabel}
                    </span>
                    <span className="shrink-0 text-xs font-medium tabular-nums text-neutral-900">
                      {d.weight.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* By Asset Type */}
          {byType.length > 0 && (
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <h4 className="mb-3 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                Allocation by Type
              </h4>
              <AllocationMiniDonut items={byType} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Reusable mini donut for the second chart ───────────────── */

function AllocationMiniDonut({ items }: { items: AllocationBreakdownItem[] }) {
  // Offset by 3 colors so Asset Type chart doesn't duplicate Asset Class colors
  const colorOffset = 3;
  const data = items.map((item) => ({
    ...item,
    displayLabel: item.label,
  }));

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
      <div className="shrink-0" style={{ width: 180, height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="displayLabel"
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="85%"
              paddingAngle={2}
              cornerRadius={4}
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={data[i].label} fill={getChartColor(i + colorOffset).fill} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 py-1">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center gap-2">
            <span
              className={`inline-block h-2.5 w-2.5 shrink-0 rounded-sm ${getSwatchColor(i + colorOffset)}`}
            />
            <span className="min-w-0 flex-1 truncate text-xs text-neutral-700">
              {d.displayLabel}
            </span>
            <span className="shrink-0 text-xs font-medium tabular-nums text-neutral-900">
              {d.weight.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
