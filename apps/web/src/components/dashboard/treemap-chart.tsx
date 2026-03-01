import { ResponsiveContainer, Tooltip, Treemap } from 'recharts';
import type { AllocationBreakdownItem } from '../../types/portfolio';
import { getChartColor } from './chart-colors';

interface TreemapChartProps {
  items: AllocationBreakdownItem[];
  labelMap?: Record<string, string>;
  height?: number;
}

function formatBrl(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

interface TreemapContentProps {
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
  displayLabel: string;
  weight: number;
}

function CustomContent({ x, y, width, height, index, displayLabel, weight }: TreemapContentProps) {
  const color = getChartColor(index);
  const showLabel = width > 50 && height > 30;
  const showPct = width > 40 && height > 20;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={6}
        ry={6}
        fill={color.fill}
        stroke={color.stroke}
        strokeWidth={2}
      />
      {showLabel && (
        <text
          x={x + width / 2}
          y={y + height / 2 - (showPct ? 7 : 0)}
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize={width > 80 ? 13 : 11}
          fontWeight={600}
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
        >
          {displayLabel.length > (width > 80 ? 16 : 10)
            ? `${displayLabel.slice(0, width > 80 ? 14 : 8)}…`
            : displayLabel}
        </text>
      )}
      {showLabel && showPct && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 12}
          textAnchor="middle"
          dominantBaseline="central"
          fill="rgba(255,255,255,0.85)"
          fontSize={11}
        >
          {weight.toFixed(1)}%
        </text>
      )}
    </g>
  );
}

interface TooltipPayloadEntry {
  payload: {
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

export function TreemapChart({ items, labelMap, height = 260 }: TreemapChartProps) {
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
    <ResponsiveContainer width="100%" height={height}>
      <Treemap
        data={data}
        dataKey="value"
        nameKey="displayLabel"
        content={
          <CustomContent x={0} y={0} width={0} height={0} index={0} displayLabel="" weight={0} />
        }
      >
        <Tooltip content={<CustomTooltip />} />
      </Treemap>
    </ResponsiveContainer>
  );
}
