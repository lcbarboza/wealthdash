import { useCallback, useEffect, useState } from 'react';
import { listSettings, updateSetting } from '../../services/api/settings';
import {
  createTransaction,
  deleteTransaction,
  getPositions,
  listTransactions,
} from '../../services/api/transactions';
import type { CreateTransactionInput, Position, Transaction } from '../../types/transaction';
import type { CreateWalletInput, Wallet } from '../../types/wallet';
import { PositionList } from './position-list';
import { TransactionForm } from './transaction-form';
import { TransactionList } from './transaction-list';
import { WalletForm } from './wallet-form';

interface WalletDetailProps {
  wallet: Wallet;
  onUpdate: (data: CreateWalletInput) => Promise<void>;
  onDelete: () => void;
}

type Tab = 'positions' | 'transactions';

export function WalletDetail({ wallet, onUpdate, onDelete }: WalletDetailProps) {
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('positions');
  const [addingTransaction, setAddingTransaction] = useState(false);

  const [positions, setPositions] = useState<Position[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [positionsLoading, setPositionsLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  // Exchange rate state
  const [usdBrlRate, setUsdBrlRate] = useState('');
  const [rateEditing, setRateEditing] = useState(false);
  const [rateInput, setRateInput] = useState('');
  const [rateSaving, setRateSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const allSettings = await listSettings();
      const rateSetting = allSettings.find((s) => s.key === 'usd_brl_rate');
      if (rateSetting) {
        setUsdBrlRate(rateSetting.value);
      }
    } catch {
      // silently fail
    }
  }, []);

  const fetchPositions = useCallback(async () => {
    try {
      setPositionsLoading(true);
      const data = await getPositions(wallet.id);
      setPositions(data);
    } catch {
      // silently fail
    } finally {
      setPositionsLoading(false);
    }
  }, [wallet.id]);

  const fetchTransactions = useCallback(async () => {
    try {
      setTransactionsLoading(true);
      const data = await listTransactions(wallet.id);
      setTransactions(data);
    } catch {
      // silently fail
    } finally {
      setTransactionsLoading(false);
    }
  }, [wallet.id]);

  useEffect(() => {
    fetchSettings();
    fetchPositions();
    fetchTransactions();
  }, [fetchSettings, fetchPositions, fetchTransactions]);

  async function handleSaveRate() {
    const parsed = Number.parseFloat(rateInput);
    if (Number.isNaN(parsed) || parsed <= 0) return;
    setRateSaving(true);
    try {
      await updateSetting('usd_brl_rate', rateInput);
      setUsdBrlRate(rateInput);
      setRateEditing(false);
      await fetchPositions();
    } catch {
      // silently fail
    } finally {
      setRateSaving(false);
    }
  }

  async function handleAddTransaction(data: CreateTransactionInput) {
    await createTransaction(wallet.id, data);
    setAddingTransaction(false);
    await fetchTransactions();
    await fetchPositions();
  }

  async function handleDeleteTransaction(txnId: string) {
    await deleteTransaction(wallet.id, txnId);
    await fetchTransactions();
    await fetchPositions();
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${wallet.name}"? All transactions will be removed. This action cannot be undone.`,
    );
    if (confirmed) {
      onDelete();
    }
  }

  if (editing) {
    return (
      <div className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">Edit Wallet</h2>
        <WalletForm
          initialData={wallet}
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

  const tabClass = (tab: Tab) =>
    [
      'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
      activeTab === tab
        ? 'border-primary-600 text-primary-700'
        : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300',
    ].join(' ');

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">{wallet.name}</h2>
          {wallet.description && (
            <p className="mt-1 text-sm text-neutral-500">{wallet.description}</p>
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

      {/* Tabs */}
      <div className="mb-4 flex border-b border-neutral-200">
        <button
          type="button"
          className={tabClass('positions')}
          onClick={() => setActiveTab('positions')}
        >
          Positions
        </button>
        <button
          type="button"
          className={tabClass('transactions')}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'positions' && (
        <div>
          {/* Exchange rate bar */}
          <div className="mb-4 flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2">
            <span className="text-xs font-medium text-neutral-500">USD/BRL:</span>
            {rateEditing ? (
              <>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={rateInput}
                  onChange={(e) => setRateInput(e.target.value)}
                  className="w-24 rounded border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-900 outline-none focus:border-primary-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveRate();
                    if (e.key === 'Escape') setRateEditing(false);
                  }}
                />
                <button
                  type="button"
                  onClick={handleSaveRate}
                  disabled={rateSaving}
                  className="rounded bg-primary-600 px-2 py-1 text-xs font-medium text-white hover:bg-primary-700 disabled:opacity-50"
                >
                  {rateSaving ? '...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setRateEditing(false)}
                  className="text-xs text-neutral-500 hover:text-neutral-700"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="text-sm font-semibold text-neutral-900">{usdBrlRate || '--'}</span>
                <button
                  type="button"
                  onClick={() => {
                    setRateInput(usdBrlRate);
                    setRateEditing(true);
                  }}
                  className="text-xs font-medium text-primary-600 hover:text-primary-700"
                >
                  Edit
                </button>
              </>
            )}
          </div>

          <PositionList positions={positions} loading={positionsLoading} />
        </div>
      )}

      {activeTab === 'transactions' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-700">Transactions</h3>
            {!addingTransaction && (
              <button
                type="button"
                onClick={() => setAddingTransaction(true)}
                className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-700"
              >
                + Add Transaction
              </button>
            )}
          </div>

          {addingTransaction && (
            <div className="mb-6 rounded-lg border border-neutral-200 p-4">
              <h4 className="mb-3 text-sm font-semibold text-neutral-700">New Transaction</h4>
              <TransactionForm
                onSubmit={handleAddTransaction}
                onCancel={() => setAddingTransaction(false)}
              />
            </div>
          )}

          <TransactionList
            transactions={transactions}
            loading={transactionsLoading}
            onDelete={handleDeleteTransaction}
          />
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 border-t border-neutral-100 pt-4">
        <div className="flex gap-6 text-xs text-neutral-400">
          <span>Created: {wallet.created_at}</span>
          <span>Updated: {wallet.updated_at}</span>
        </div>
      </div>
    </div>
  );
}
