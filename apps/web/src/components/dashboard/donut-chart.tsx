import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { AllocationBreakdownItem } from '../../types/portfolio';
import { getChartColor, getSwatchColor } from './chart-colors';

interface DonutChartProps {
  items: AllocationBreakdownItem[];
  labelMap?: Record<string, string>;
  /** Height of the chart area in px (default 280) */
  height?: number;
}

function formatBrl(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

interface TooltipPayloadEntry {
  name: string;
  value: number;
  payload: {
    label: string;
    displayLabel: string;
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

export function DonutChart({ items, labelMap, height = 280 }: DonutChartProps) {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-neutral-400">No data</div>
    );
  }

  const data = items.map((item) => ({
    ...item,
    displayLabel: labelMap?.[item.label] ?? item.label,
  }));

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      {/* Chart */}
      <div className="shrink-0" style={{ width: height, height }}>
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
                <Cell key={data[i].label} fill={getChartColor(i).fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-1 flex-col gap-1.5 py-2">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center gap-2.5">
            <span className={`inline-block h-3 w-3 shrink-0 rounded-sm ${getSwatchColor(i)}`} />
            <span className="min-w-0 flex-1 truncate text-sm text-neutral-700">
              {d.displayLabel}
            </span>
            <span className="shrink-0 text-sm font-medium tabular-nums text-neutral-900">
              {d.weight.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
