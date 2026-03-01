import type { Transaction } from '../../types/transaction';

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
  onDelete: (id: string) => void;
}

function formatCurrency(value: number, currency: string): string {
  const locale = currency === 'USD' ? 'en-US' : 'pt-BR';
  return value.toLocaleString(locale, {
    style: 'currency',
    currency,
  });
}

function formatDate(dateStr: string): string {
  // Convert YYYY-MM-DD to DD/MM/YYYY
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export function TransactionList({ transactions, loading, onDelete }: TransactionListProps) {
  if (loading) {
    return <div className="p-4 text-center text-sm text-neutral-400">Loading transactions...</div>;
  }

  if (transactions.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-neutral-500">No transactions yet. Add your first transaction.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200">
            <th className="px-4 py-3 text-xs font-medium text-neutral-500">Date</th>
            <th className="px-4 py-3 text-xs font-medium text-neutral-500">Asset</th>
            <th className="px-4 py-3 text-xs font-medium text-neutral-500">Type</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500">Quantity</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500">
              Unit Price
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500">Total</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500" />
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id} className="border-b border-neutral-100 hover:bg-neutral-50">
              <td className="px-4 py-3 text-neutral-600">{formatDate(txn.date)}</td>
              <td className="px-4 py-3">
                <div className="font-medium text-neutral-900">{txn.asset_name}</div>
                {txn.asset_ticker && (
                  <span className="text-xs text-neutral-400">{txn.asset_ticker}</span>
                )}
              </td>
              <td className="px-4 py-3">
                <span className="rounded bg-success-100 px-1.5 py-0.5 text-xs font-medium text-success-700">
                  {txn.type}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-neutral-900">
                {txn.quantity.toLocaleString('pt-BR')}
              </td>
              <td className="px-4 py-3 text-right text-neutral-900">
                {formatCurrency(txn.unit_price, txn.asset_currency)}
              </td>
              <td className="px-4 py-3 text-right font-medium text-neutral-900">
                {formatCurrency(txn.quantity * txn.unit_price, txn.asset_currency)}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => {
                    const confirmed = window.confirm('Delete this transaction?');
                    if (confirmed) onDelete(txn.id);
                  }}
                  className="text-xs text-danger-500 hover:text-danger-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
