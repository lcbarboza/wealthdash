export const TransactionType = {
  BUY: 'BUY',
} as const;
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

/** Full transaction record as returned by the API */
export interface Transaction {
  id: string;
  wallet_id: string;
  asset_id: string;
  asset_name: string;
  asset_ticker: string | null;
  asset_currency: string;
  type: TransactionType;
  quantity: number;
  unit_price: number;
  date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/** Input DTO for creating a transaction */
export interface CreateTransactionInput {
  asset_id: string;
  type?: TransactionType;
  quantity: number;
  unit_price: number;
  date: string;
  notes?: string | null;
}

/** Input DTO for updating a transaction */
export interface UpdateTransactionInput {
  type?: TransactionType;
  quantity?: number;
  unit_price?: number;
  date?: string;
  notes?: string | null;
}

/** Consolidated position for an asset within a wallet */
export interface Position {
  asset_id: string;
  asset_name: string;
  asset_ticker: string | null;
  asset_type: string;
  asset_class: string;
  asset_currency: string;
  sector: string | null;
  current_price: number | null;
  total_quantity: number;
  total_cost: number;
  average_cost: number;
  market_value: number | null;
  gain: number | null;
  value_brl: number | null;
}
