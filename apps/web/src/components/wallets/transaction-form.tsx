import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { listAssets } from '../../services/api/assets';
import type { ApiError, Asset } from '../../types/asset';
import type { CreateTransactionInput } from '../../types/transaction';

interface TransactionFormProps {
  onSubmit: (data: CreateTransactionInput) => Promise<void>;
  onCancel: () => void;
}

export function TransactionForm({ onSubmit, onCancel }: TransactionFormProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetsLoading, setAssetsLoading] = useState(true);

  const [assetId, setAssetId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    let cancelled = false;
    listAssets()
      .then((data) => {
        if (cancelled) return;
        setAssets(data);
        if (data.length > 0) {
          setAssetId((prev) => prev || data[0].id);
        }
      })
      .catch(() => {
        if (!cancelled) setError({ error: 'Error', message: 'Failed to load assets' });
      })
      .finally(() => {
        if (!cancelled) setAssetsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const data: CreateTransactionInput = {
      asset_id: assetId,
      quantity: Number(quantity),
      unit_price: Number(unitPrice),
      date,
      notes: notes.trim() || null,
    };

    try {
      await onSubmit(data);
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'body' in err &&
        err.body &&
        typeof err.body === 'object'
      ) {
        setError(err.body as ApiError);
      } else {
        setError({
          error: 'Error',
          message: err instanceof Error ? err.message : 'An error occurred',
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-100';
  const labelClass = 'mb-1 block text-xs font-medium text-neutral-600';

  const selectedAsset = useMemo(() => assets.find((a) => a.id === assetId), [assets, assetId]);
  const currencySymbol = selectedAsset?.currency === 'USD' ? '$' : 'R$';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-danger-200 bg-danger-50 p-3">
          <p className="text-sm font-medium text-danger-700">{error.message}</p>
          {error.fields && error.fields.length > 0 && (
            <ul className="mt-1 list-inside list-disc text-xs text-danger-600">
              {error.fields.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label htmlFor="txn-asset" className={labelClass}>
            Asset *
          </label>
          {assetsLoading ? (
            <div className="text-sm text-neutral-400">Loading assets...</div>
          ) : assets.length === 0 ? (
            <div className="text-sm text-neutral-400">
              No assets available. Create an asset first.
            </div>
          ) : (
            <select
              id="txn-asset"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              className={inputClass}
              required
            >
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.name}
                  {asset.ticker ? ` (${asset.ticker})` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label htmlFor="txn-quantity" className={labelClass}>
            Quantity *
          </label>
          <input
            id="txn-quantity"
            type="number"
            step="any"
            min="0.000001"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={inputClass}
            required
            placeholder="e.g. 100"
          />
        </div>

        <div>
          <label htmlFor="txn-unit-price" className={labelClass}>
            Unit Price ({currencySymbol}) *
          </label>
          <input
            id="txn-unit-price"
            type="number"
            step="0.01"
            min="0"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            className={inputClass}
            required
            placeholder="e.g. 28.50"
          />
        </div>

        <div>
          <label htmlFor="txn-date" className={labelClass}>
            Purchase Date *
          </label>
          <input
            id="txn-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="txn-notes" className={labelClass}>
          Notes
        </label>
        <textarea
          id="txn-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={`${inputClass} min-h-[56px] resize-y`}
          rows={2}
          placeholder="Optional notes..."
        />
      </div>

      <div className="flex items-center gap-3 border-t border-neutral-100 pt-4">
        <button
          type="submit"
          disabled={submitting || assets.length === 0}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Add Transaction'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
