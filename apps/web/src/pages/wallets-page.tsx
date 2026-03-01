import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WalletDetail } from '../components/wallets/wallet-detail';
import { WalletEmpty } from '../components/wallets/wallet-empty';
import { WalletForm } from '../components/wallets/wallet-form';
import { WalletList } from '../components/wallets/wallet-list';
import {
  createWallet,
  deleteWallet,
  getWallet,
  listWallets,
  updateWallet,
} from '../services/api/wallets';
import type { CreateWalletInput, Wallet } from '../types/wallet';

export function WalletsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listWallets();
      setWallets(data);
    } catch {
      setError('Failed to load wallets.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load wallet list on mount
  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  // Load selected wallet when id changes
  useEffect(() => {
    if (!id) {
      setSelectedWallet(null);
      return;
    }
    setCreating(false);
    getWallet(id)
      .then(setSelectedWallet)
      .catch(() => {
        setSelectedWallet(null);
        setError('Wallet not found.');
      });
  }, [id]);

  async function handleCreate(data: CreateWalletInput) {
    const created = await createWallet(data);
    await fetchWallets();
    setCreating(false);
    navigate(`/wallets/${created.id}`);
  }

  async function handleUpdate(data: CreateWalletInput) {
    if (!id) return;
    const updated = await updateWallet(id, data);
    setSelectedWallet(updated);
    await fetchWallets();
  }

  async function handleDelete() {
    if (!id) return;
    await deleteWallet(id);
    setSelectedWallet(null);
    await fetchWallets();
    navigate('/wallets');
  }

  function handleNewWallet() {
    setCreating(true);
    setSelectedWallet(null);
    navigate('/wallets');
  }

  return (
    <div className="flex h-screen">
      {/* Left panel: wallet list */}
      <div className="w-80 shrink-0 border-r border-neutral-200 bg-white">
        <WalletList
          wallets={wallets}
          selectedId={id}
          onNewWallet={handleNewWallet}
          loading={loading}
        />
      </div>

      {/* Right panel: detail / form / empty */}
      <div className="flex-1 overflow-y-auto bg-white">
        {error && (
          <div className="m-4 rounded-lg border border-danger-200 bg-danger-50 p-3 text-sm text-danger-700">
            {error}
            <button
              type="button"
              onClick={() => setError(null)}
              className="ml-2 font-medium underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {creating ? (
          <div className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">New Wallet</h2>
            <WalletForm
              onSubmit={handleCreate}
              onCancel={() => setCreating(false)}
              submitLabel="Create Wallet"
            />
          </div>
        ) : selectedWallet ? (
          <WalletDetail wallet={selectedWallet} onUpdate={handleUpdate} onDelete={handleDelete} />
        ) : (
          <WalletEmpty />
        )}
      </div>
    </div>
  );
}
