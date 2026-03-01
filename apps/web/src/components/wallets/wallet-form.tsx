import { type FormEvent, useState } from 'react';
import type { ApiError } from '../../types/asset';
import type { CreateWalletInput, Wallet } from '../../types/wallet';

interface WalletFormProps {
  initialData?: Wallet;
  onSubmit: (data: CreateWalletInput) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export function WalletForm({ initialData, onSubmit, onCancel, submitLabel }: WalletFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const data: CreateWalletInput = {
      name: name.trim(),
      description: description.trim() || null,
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

      <div>
        <label htmlFor="wallet-name" className={labelClass}>
          Name *
        </label>
        <input
          id="wallet-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          required
          placeholder="e.g. Corretora XP"
        />
      </div>

      <div>
        <label htmlFor="wallet-description" className={labelClass}>
          Description
        </label>
        <textarea
          id="wallet-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClass} min-h-[72px] resize-y`}
          rows={3}
          placeholder="Optional description..."
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
