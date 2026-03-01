export const TransactionType = {
  BUY: 'BUY',
} as const;
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

export const TRANSACTION_TYPE_VALUES = Object.values(TransactionType);

/** Input DTO for creating a transaction */
export interface CreateTransactionInput {
  asset_id: string;
  type?: TransactionType;
  quantity: number;
  unit_price: number;
  date: string;
  notes?: string | null;
}

/** Input DTO for updating a transaction (asset_id not changeable) */
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
  current_price: number | null;
  total_quantity: number;
  total_cost: number;
  average_cost: number;
  market_value: number | null;
  gain: number | null;
  value_brl: number | null;
}
