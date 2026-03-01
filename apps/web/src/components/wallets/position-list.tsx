import { ASSET_CLASS_LABELS, ASSET_TYPE_LABELS } from '../../types/asset';
import type { Position } from '../../types/transaction';

interface PositionListProps {
  positions: Position[];
  loading: boolean;
}

function formatCurrency(value: number, currency: string): string {
  const locale = currency === 'USD' ? 'en-US' : 'pt-BR';
  return value.toLocaleString(locale, {
    style: 'currency',
    currency,
  });
}

export function PositionList({ positions, loading }: PositionListProps) {
  if (loading) {
    return <div className="p-4 text-center text-sm text-neutral-400">Loading positions...</div>;
  }

  if (positions.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-neutral-500">
          No positions yet. Add transactions to see consolidated positions.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200">
            <th className="px-4 py-3 text-xs font-medium text-neutral-500">Asset</th>
            <th className="px-4 py-3 text-xs font-medium text-neutral-500">Type</th>
            <th className="px-4 py-3 text-xs font-medium text-neutral-500">Class</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500">Quantity</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500">Avg Cost</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500">
              Total Cost
            </th>
          </tr>
        </thead>
        <tbody>
          {positions.map((pos) => (
            <tr key={pos.asset_id} className="border-b border-neutral-100 hover:bg-neutral-50">
              <td className="px-4 py-3">
                <div className="font-medium text-neutral-900">{pos.asset_name}</div>
                {pos.asset_ticker && (
                  <span className="text-xs text-neutral-400">{pos.asset_ticker}</span>
                )}
              </td>
              <td className="px-4 py-3 text-neutral-600">
                {ASSET_TYPE_LABELS[pos.asset_type as keyof typeof ASSET_TYPE_LABELS] ??
                  pos.asset_type}
              </td>
              <td className="px-4 py-3 text-neutral-600">
                {ASSET_CLASS_LABELS[pos.asset_class as keyof typeof ASSET_CLASS_LABELS] ??
                  pos.asset_class}
              </td>
              <td className="px-4 py-3 text-right text-neutral-900">
                {pos.total_quantity.toLocaleString('pt-BR')}
              </td>
              <td className="px-4 py-3 text-right text-neutral-900">
                {formatCurrency(pos.average_cost, pos.asset_currency)}
              </td>
              <td className="px-4 py-3 text-right font-medium text-neutral-900">
                {formatCurrency(pos.total_cost, pos.asset_currency)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-neutral-300 bg-neutral-50">
            <td colSpan={5} className="px-4 py-3 text-right text-xs font-semibold text-neutral-600">
              Total
            </td>
            <td className="px-4 py-3 text-right font-semibold text-neutral-900">
              {(() => {
                const currencies = new Set(positions.map((p) => p.asset_currency));
                if (currencies.size === 1) {
                  const currency = positions[0].asset_currency;
                  return formatCurrency(
                    positions.reduce((sum, p) => sum + p.total_cost, 0),
                    currency,
                  );
                }
                return '--';
              })()}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
