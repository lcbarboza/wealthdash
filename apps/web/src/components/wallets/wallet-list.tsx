import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { Wallet } from '../../types/wallet';

interface WalletListProps {
  wallets: Wallet[];
  selectedId: string | undefined;
  onNewWallet: () => void;
  loading: boolean;
}

export function WalletList({ wallets, selectedId, onNewWallet, loading }: WalletListProps) {
  const [search, setSearch] = useState('');

  const filtered = wallets.filter((wallet) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      wallet.name.toLowerCase().includes(term) || wallet.description?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-neutral-200 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">Wallets</h2>
          <button
            type="button"
            onClick={onNewWallet}
            className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-700"
          >
            + New
          </button>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search wallets..."
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && <div className="p-4 text-center text-sm text-neutral-400">Loading...</div>}

        {!loading && filtered.length === 0 && (
          <div className="p-4 text-center text-sm text-neutral-400">
            {search ? 'No wallets match your search.' : 'No wallets yet.'}
          </div>
        )}

        {!loading &&
          filtered.map((wallet) => (
            <NavLink
              key={wallet.id}
              to={`/wallets/${wallet.id}`}
              className={[
                'block border-b border-neutral-100 px-4 py-3 transition-colors hover:bg-neutral-50',
                wallet.id === selectedId ? 'border-l-2 border-l-primary-500 bg-primary-50' : '',
              ].join(' ')}
            >
              <div className="text-sm font-medium text-neutral-900">{wallet.name}</div>
              {wallet.description && (
                <div className="mt-0.5 text-xs text-neutral-400 truncate">{wallet.description}</div>
              )}
            </NavLink>
          ))}
      </div>
    </div>
  );
}
