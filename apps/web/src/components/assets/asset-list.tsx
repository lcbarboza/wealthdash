import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { Asset } from '../../types/asset';
import { ASSET_CLASS_LABELS, ASSET_TYPE_LABELS } from '../../types/asset';

interface AssetListProps {
  assets: Asset[];
  selectedId: string | undefined;
  onNewAsset: () => void;
  loading: boolean;
}

export function AssetList({ assets, selectedId, onNewAsset, loading }: AssetListProps) {
  const [search, setSearch] = useState('');

  const filtered = assets.filter((asset) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return asset.name.toLowerCase().includes(term) || asset.ticker?.toLowerCase().includes(term);
  });

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-neutral-200 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">Assets</h2>
          <button
            type="button"
            onClick={onNewAsset}
            className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-700"
          >
            + New
          </button>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or ticker..."
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && <div className="p-4 text-center text-sm text-neutral-400">Loading...</div>}

        {!loading && filtered.length === 0 && (
          <div className="p-4 text-center text-sm text-neutral-400">
            {search ? 'No assets match your search.' : 'No assets yet.'}
          </div>
        )}

        {!loading &&
          filtered.map((asset) => (
            <NavLink
              key={asset.id}
              to={`/assets/${asset.id}`}
              className={[
                'block border-b border-neutral-100 px-4 py-3 transition-colors hover:bg-neutral-50',
                asset.id === selectedId ? 'border-l-2 border-l-primary-500 bg-primary-50' : '',
              ].join(' ')}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-900">{asset.name}</span>
                {asset.ticker && (
                  <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-500">
                    {asset.ticker}
                  </span>
                )}
              </div>
              <div className="mt-1 flex gap-2">
                <span className="text-xs text-neutral-400">
                  {ASSET_TYPE_LABELS[asset.asset_type]}
                </span>
                <span className="text-xs text-neutral-300">/</span>
                <span className="text-xs text-neutral-400">
                  {ASSET_CLASS_LABELS[asset.asset_class]}
                </span>
              </div>
            </NavLink>
          ))}
      </div>
    </div>
  );
}
