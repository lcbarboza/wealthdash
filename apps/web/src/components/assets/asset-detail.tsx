import { useState } from 'react';
import type { Asset, CreateAssetInput } from '../../types/asset';
import {
  ASSET_CLASS_LABELS,
  ASSET_TYPE_LABELS,
  CURRENCY_LABELS,
  FIXED_INCOME_TYPES,
  INDEXER_LABELS,
  RATE_TYPE_LABELS,
} from '../../types/asset';
import { AssetForm } from './asset-form';

interface AssetDetailProps {
  asset: Asset;
  onUpdate: (data: CreateAssetInput) => Promise<void>;
  onDelete: () => void;
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <dt className="text-xs font-medium text-neutral-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-neutral-900">
        {value || <span className="text-neutral-300">&mdash;</span>}
      </dd>
    </div>
  );
}

export function AssetDetail({ asset, onUpdate, onDelete }: AssetDetailProps) {
  const [editing, setEditing] = useState(false);

  const isFixedIncome = FIXED_INCOME_TYPES.has(asset.asset_type);

  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${asset.name}"? This action cannot be undone.`,
    );
    if (confirmed) {
      onDelete();
    }
  }

  if (editing) {
    return (
      <div className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">Edit Asset</h2>
        <AssetForm
          initialData={asset}
          onSubmit={async (data) => {
            await onUpdate(data);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
          submitLabel="Save Changes"
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">{asset.name}</h2>
          {asset.ticker && (
            <span className="mt-1 inline-block rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
              {asset.ticker}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg border border-danger-200 bg-white px-3 py-1.5 text-sm font-medium text-danger-600 transition-colors hover:bg-danger-50"
          >
            Delete
          </button>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
        <DetailRow label="Asset Type" value={ASSET_TYPE_LABELS[asset.asset_type]} />
        <DetailRow label="Asset Class" value={ASSET_CLASS_LABELS[asset.asset_class]} />
        <DetailRow label="Sector" value={asset.sector} />
        <DetailRow label="Currency" value={CURRENCY_LABELS[asset.currency]} />

        {isFixedIncome && (
          <>
            <DetailRow label="Maturity Date" value={asset.maturity_date} />
            <DetailRow
              label="Rate Type"
              value={asset.rate_type ? RATE_TYPE_LABELS[asset.rate_type] : null}
            />
            <DetailRow
              label="Indexer"
              value={asset.indexer ? INDEXER_LABELS[asset.indexer] : null}
            />
            <DetailRow
              label="Rate Value"
              value={asset.rate_value != null ? `${asset.rate_value}%` : null}
            />
          </>
        )}

        <div className="col-span-2">
          <DetailRow label="Notes" value={asset.notes} />
        </div>
      </dl>

      <div className="mt-6 border-t border-neutral-100 pt-4">
        <div className="flex gap-6 text-xs text-neutral-400">
          <span>Created: {asset.created_at}</span>
          <span>Updated: {asset.updated_at}</span>
        </div>
      </div>
    </div>
  );
}
