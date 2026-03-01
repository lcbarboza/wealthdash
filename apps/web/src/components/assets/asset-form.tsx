import { type FormEvent, useEffect, useState } from 'react';
import type { ApiError, Asset, CreateAssetInput } from '../../types/asset';
import {
  ASSET_CLASS_LABELS,
  ASSET_CLASS_VALUES,
  ASSET_TYPE_LABELS,
  ASSET_TYPE_VALUES,
  CURRENCY_LABELS,
  CURRENCY_VALUES,
  FIXED_INCOME_TYPES,
  INDEXER_LABELS,
  INDEXER_VALUES,
  RATE_TYPE_LABELS,
  RATE_TYPE_VALUES,
} from '../../types/asset';

interface AssetFormProps {
  initialData?: Asset;
  onSubmit: (data: CreateAssetInput) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export function AssetForm({ initialData, onSubmit, onCancel, submitLabel }: AssetFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [ticker, setTicker] = useState(initialData?.ticker ?? '');
  const [assetType, setAssetType] = useState(initialData?.asset_type ?? 'STOCK');
  const [assetClass, setAssetClass] = useState(initialData?.asset_class ?? 'EQUITY');
  const [sector, setSector] = useState(initialData?.sector ?? '');
  const [currency, setCurrency] = useState(initialData?.currency ?? 'BRL');
  const [notes, setNotes] = useState(initialData?.notes ?? '');

  // Fixed income fields
  const [maturityDate, setMaturityDate] = useState(initialData?.maturity_date ?? '');
  const [rateType, setRateType] = useState(initialData?.rate_type ?? 'POST');
  const [indexer, setIndexer] = useState(initialData?.indexer ?? 'CDI');
  const [rateValue, setRateValue] = useState(initialData?.rate_value?.toString() ?? '');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const isFixedIncome = FIXED_INCOME_TYPES.has(assetType);

  // Reset fixed income fields when switching away from fixed income types
  useEffect(() => {
    if (!isFixedIncome) {
      setMaturityDate('');
      setRateType('POST');
      setIndexer('CDI');
      setRateValue('');
    }
  }, [isFixedIncome]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const data: CreateAssetInput = {
      name: name.trim(),
      asset_type: assetType,
      asset_class: assetClass,
      currency: currency,
      ticker: ticker.trim() || null,
      sector: sector.trim() || null,
      notes: notes.trim() || null,
    };

    if (isFixedIncome) {
      data.maturity_date = maturityDate || null;
      data.rate_type = rateType;
      data.indexer = indexer;
      data.rate_value = rateValue ? Number(rateValue) : null;
    }

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
          <label htmlFor="name" className={labelClass}>
            Name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            required
            placeholder="e.g. Petrobras PN"
          />
        </div>

        <div>
          <label htmlFor="ticker" className={labelClass}>
            Ticker
          </label>
          <input
            id="ticker"
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className={inputClass}
            placeholder="e.g. PETR4"
          />
        </div>

        <div>
          <label htmlFor="sector" className={labelClass}>
            Sector
          </label>
          <input
            id="sector"
            type="text"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className={inputClass}
            placeholder="e.g. Energy"
          />
        </div>

        <div>
          <label htmlFor="asset_type" className={labelClass}>
            Asset Type *
          </label>
          <select
            id="asset_type"
            value={assetType}
            onChange={(e) => setAssetType(e.target.value as typeof assetType)}
            className={inputClass}
          >
            {ASSET_TYPE_VALUES.map((v) => (
              <option key={v} value={v}>
                {ASSET_TYPE_LABELS[v]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="asset_class" className={labelClass}>
            Asset Class *
          </label>
          <select
            id="asset_class"
            value={assetClass}
            onChange={(e) => setAssetClass(e.target.value as typeof assetClass)}
            className={inputClass}
          >
            {ASSET_CLASS_VALUES.map((v) => (
              <option key={v} value={v}>
                {ASSET_CLASS_LABELS[v]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="currency" className={labelClass}>
            Currency
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as typeof currency)}
            className={inputClass}
          >
            {CURRENCY_VALUES.map((v) => (
              <option key={v} value={v}>
                {CURRENCY_LABELS[v]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isFixedIncome && (
        <fieldset className="rounded-lg border border-neutral-200 p-4">
          <legend className="px-2 text-xs font-semibold text-neutral-500">
            Fixed Income Details
          </legend>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="maturity_date" className={labelClass}>
                Maturity Date
              </label>
              <input
                id="maturity_date"
                type="date"
                value={maturityDate}
                onChange={(e) => setMaturityDate(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="rate_type" className={labelClass}>
                Rate Type
              </label>
              <select
                id="rate_type"
                value={rateType}
                onChange={(e) => setRateType(e.target.value as typeof rateType)}
                className={inputClass}
              >
                {RATE_TYPE_VALUES.map((v) => (
                  <option key={v} value={v}>
                    {RATE_TYPE_LABELS[v]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="indexer" className={labelClass}>
                Indexer
              </label>
              <select
                id="indexer"
                value={indexer}
                onChange={(e) => setIndexer(e.target.value as typeof indexer)}
                className={inputClass}
              >
                {INDEXER_VALUES.map((v) => (
                  <option key={v} value={v}>
                    {INDEXER_LABELS[v]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="rate_value" className={labelClass}>
                Rate Value (%)
              </label>
              <input
                id="rate_value"
                type="number"
                step="0.01"
                value={rateValue}
                onChange={(e) => setRateValue(e.target.value)}
                className={inputClass}
                placeholder="e.g. 110.5"
              />
            </div>
          </div>
        </fieldset>
      )}

      <div>
        <label htmlFor="notes" className={labelClass}>
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={`${inputClass} min-h-[72px] resize-y`}
          rows={3}
          placeholder="Optional notes about this asset..."
        />
      </div>

      <div className="flex items-center gap-3 border-t border-neutral-100 pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : submitLabel}
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
