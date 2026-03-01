import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AssetDetail } from '../components/assets/asset-detail';
import { AssetEmpty } from '../components/assets/asset-empty';
import { AssetForm } from '../components/assets/asset-form';
import { AssetList } from '../components/assets/asset-list';
import {
  createAsset,
  deleteAsset,
  getAsset,
  listAssets,
  updateAsset,
} from '../services/api/assets';
import type { Asset, CreateAssetInput } from '../types/asset';

export function AssetsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listAssets();
      setAssets(data);
    } catch {
      setError('Failed to load assets.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load asset list on mount
  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Load selected asset when id changes
  useEffect(() => {
    if (!id) {
      setSelectedAsset(null);
      return;
    }
    setCreating(false);
    getAsset(id)
      .then(setSelectedAsset)
      .catch(() => {
        setSelectedAsset(null);
        setError('Asset not found.');
      });
  }, [id]);

  async function handleCreate(data: CreateAssetInput) {
    const created = await createAsset(data);
    await fetchAssets();
    setCreating(false);
    navigate(`/assets/${created.id}`);
  }

  async function handleUpdate(data: CreateAssetInput) {
    if (!id) return;
    const updated = await updateAsset(id, data);
    setSelectedAsset(updated);
    await fetchAssets();
  }

  async function handleDelete() {
    if (!id) return;
    await deleteAsset(id);
    setSelectedAsset(null);
    await fetchAssets();
    navigate('/assets');
  }

  function handleNewAsset() {
    setCreating(true);
    setSelectedAsset(null);
    navigate('/assets');
  }

  return (
    <div className="flex h-screen">
      {/* Left panel: asset list */}
      <div className="w-80 shrink-0 border-r border-neutral-200 bg-white">
        <AssetList assets={assets} selectedId={id} onNewAsset={handleNewAsset} loading={loading} />
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
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">New Asset</h2>
            <AssetForm
              onSubmit={handleCreate}
              onCancel={() => setCreating(false)}
              submitLabel="Create Asset"
            />
          </div>
        ) : selectedAsset ? (
          <AssetDetail asset={selectedAsset} onUpdate={handleUpdate} onDelete={handleDelete} />
        ) : (
          <AssetEmpty />
        )}
      </div>
    </div>
  );
}
