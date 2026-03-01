import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ASSET_TYPE_LABELS } from '../../types/asset';
import type { TopHoldingItem } from '../../types/portfolio';
import { getChartColor } from './chart-colors';

interface HorizontalBarChartProps {
  holdings: TopHoldingItem[];
  /** Max items to show (default 10) */
  maxItems?: number;
}

function formatBrl(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

interface TooltipPayloadEntry {
  payload: {
    name: string;
    ticker: string | null;
    type: string;
    value: number;
    weight: number;
    gain: number;
  };
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const gainColor = d.gain > 0 ? 'text-success-600' : d.gain < 0 ? 'text-danger-600' : '';
  const typeLabel = ASSET_TYPE_LABELS[d.type as keyof typeof ASSET_TYPE_LABELS] ?? d.type;
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-sm font-semibold text-neutral-900">
        {d.name}
        {d.ticker ? ` (${d.ticker})` : ''}
      </p>
      <p className="text-xs text-neutral-500">{typeLabel}</p>
      <p className="text-xs text-neutral-600">
        {formatBrl(d.value)} &middot; {d.weight.toFixed(1)}%
      </p>
      <p className={`text-xs font-medium ${gainColor}`}>Gain: {formatBrl(d.gain)}</p>
    </div>
  );
}

export function HorizontalBarChart({ holdings, maxItems = 10 }: HorizontalBarChartProps) {
  if (holdings.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-neutral-400">
        No holdings
      </div>
    );
  }

  const data = holdings.slice(0, maxItems).map((h) => ({
    name: h.asset_ticker ?? h.asset_name,
    fullName: h.asset_name,
    ticker: h.asset_ticker,
    type: h.asset_type,
    value: h.value,
    weight: h.weight,
    gain: h.gain,
  }));

  const barHeight = 36;
  const chartHeight = data.length * barHeight + 40;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 32, bottom: 4, left: 0 }}
        barCategoryGap="20%"
      >
        <XAxis
          type="number"
          domain={[0, 'dataMax']}
          tickFormatter={(v: number) => `${v.toFixed(0)}%`}
          tick={{ fontSize: 11, fill: 'oklch(0.55 0.015 260)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={90}
          tick={{ fontSize: 12, fill: 'oklch(0.37 0.015 260)', fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'oklch(0.96 0.008 260)' }} />
        <Bar dataKey="weight" radius={[0, 6, 6, 0]} maxBarSize={24}>
          {data.map((_, i) => (
            <Cell key={data[i].name} fill={getChartColor(i).fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
