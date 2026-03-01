import crypto from 'node:crypto';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { assets, settings, transactions } from '../db/schema.js';
import type {
  CreateTransactionInput,
  Position,
  UpdateTransactionInput,
} from '../types/transaction.js';
import { TRANSACTION_TYPE_VALUES } from '../types/transaction.js';

export class TransactionValidationError extends Error {
  constructor(
    message: string,
    public readonly fields: string[],
  ) {
    super(message);
    this.name = 'TransactionValidationError';
  }
}

export class TransactionNotFoundError extends Error {
  constructor(id: string) {
    super(`Transaction not found: ${id}`);
    this.name = 'TransactionNotFoundError';
  }
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function validateTransactionInput(
  input: CreateTransactionInput | UpdateTransactionInput,
  isCreate: boolean,
) {
  const errors: string[] = [];

  if (isCreate) {
    const create = input as CreateTransactionInput;
    if (!create.asset_id?.trim()) errors.push('asset_id is required');
    if (create.quantity === undefined || create.quantity === null)
      errors.push('quantity is required');
    if (create.unit_price === undefined || create.unit_price === null)
      errors.push('unit_price is required');
    if (!create.date) errors.push('date is required');
  }

  if (input.type !== undefined && !TRANSACTION_TYPE_VALUES.includes(input.type)) {
    errors.push(`invalid type: ${input.type}. Valid values: ${TRANSACTION_TYPE_VALUES.join(', ')}`);
  }

  if (input.quantity !== undefined && input.quantity <= 0) {
    errors.push('quantity must be greater than zero');
  }

  if (input.unit_price !== undefined && input.unit_price < 0) {
    errors.push('unit_price must be greater than or equal to zero');
  }

  if (input.date !== undefined && !ISO_DATE_RE.test(input.date)) {
    errors.push('date must be in YYYY-MM-DD format');
  }

  if (errors.length > 0) {
    throw new TransactionValidationError(`Validation failed: ${errors.join('; ')}`, errors);
  }
}

export async function createTransaction(walletId: string, input: CreateTransactionInput) {
  validateTransactionInput(input, true);

  // Verify asset exists
  const asset = db.select().from(assets).where(eq(assets.id, input.asset_id)).get();
  if (!asset) {
    throw new TransactionValidationError(`Asset not found: ${input.asset_id}`, ['asset_id']);
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

  const result = db
    .insert(transactions)
    .values({
      id,
      wallet_id: walletId,
      asset_id: input.asset_id,
      type: input.type ?? 'BUY',
      quantity: input.quantity,
      unit_price: input.unit_price,
      date: input.date,
      notes: input.notes ?? null,
      created_at: now,
      updated_at: now,
    })
    .returning()
    .get();

  return result;
}

export async function getTransactionById(walletId: string, id: string) {
  const result = db
    .select({
      id: transactions.id,
      wallet_id: transactions.wallet_id,
      asset_id: transactions.asset_id,
      asset_name: assets.name,
      asset_ticker: assets.ticker,
      asset_currency: assets.currency,
      type: transactions.type,
      quantity: transactions.quantity,
      unit_price: transactions.unit_price,
      date: transactions.date,
      notes: transactions.notes,
      created_at: transactions.created_at,
      updated_at: transactions.updated_at,
    })
    .from(transactions)
    .innerJoin(assets, eq(transactions.asset_id, assets.id))
    .where(and(eq(transactions.id, id), eq(transactions.wallet_id, walletId)))
    .get();

  if (!result) {
    throw new TransactionNotFoundError(id);
  }

  return result;
}

export async function listTransactionsByWallet(walletId: string) {
  return db
    .select({
      id: transactions.id,
      wallet_id: transactions.wallet_id,
      asset_id: transactions.asset_id,
      asset_name: assets.name,
      asset_ticker: assets.ticker,
      asset_currency: assets.currency,
      type: transactions.type,
      quantity: transactions.quantity,
      unit_price: transactions.unit_price,
      date: transactions.date,
      notes: transactions.notes,
      created_at: transactions.created_at,
      updated_at: transactions.updated_at,
    })
    .from(transactions)
    .innerJoin(assets, eq(transactions.asset_id, assets.id))
    .where(eq(transactions.wallet_id, walletId))
    .orderBy(sql`${transactions.date} DESC`)
    .all();
}

export async function updateTransaction(
  walletId: string,
  id: string,
  input: UpdateTransactionInput,
) {
  const existing = db
    .select()
    .from(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.wallet_id, walletId)))
    .get();

  if (!existing) {
    throw new TransactionNotFoundError(id);
  }

  validateTransactionInput(input, false);

  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

  const updates: Record<string, unknown> = { updated_at: now };
  if (input.type !== undefined) updates.type = input.type;
  if (input.quantity !== undefined) updates.quantity = input.quantity;
  if (input.unit_price !== undefined) updates.unit_price = input.unit_price;
  if (input.date !== undefined) updates.date = input.date;
  if (input.notes !== undefined) updates.notes = input.notes;

  const result = db
    .update(transactions)
    .set(updates)
    .where(and(eq(transactions.id, id), eq(transactions.wallet_id, walletId)))
    .returning()
    .get();

  return result;
}

export async function deleteTransaction(walletId: string, id: string) {
  const existing = db
    .select()
    .from(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.wallet_id, walletId)))
    .get();

  if (!existing) {
    throw new TransactionNotFoundError(id);
  }

  db.delete(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.wallet_id, walletId)))
    .run();

  return existing;
}

export async function getPositionsByWallet(walletId: string): Promise<Position[]> {
  // Get USD/BRL rate from settings
  const rateSetting = db.select().from(settings).where(eq(settings.key, 'usd_brl_rate')).get();
  const usdBrlRate = rateSetting ? Number.parseFloat(rateSetting.value) : 5.0;

  const rows = db
    .select({
      asset_id: transactions.asset_id,
      asset_name: assets.name,
      asset_ticker: assets.ticker,
      asset_type: assets.asset_type,
      asset_class: assets.asset_class,
      asset_currency: assets.currency,
      sector: assets.sector,
      current_price: assets.current_price,
      total_quantity: sql<number>`SUM(${transactions.quantity})`,
      total_cost: sql<number>`SUM(${transactions.quantity} * ${transactions.unit_price})`,
    })
    .from(transactions)
    .innerJoin(assets, eq(transactions.asset_id, assets.id))
    .where(and(eq(transactions.wallet_id, walletId), eq(transactions.type, 'BUY')))
    .groupBy(transactions.asset_id)
    .all();

  return rows.map((row) => {
    const averageCost = row.total_quantity > 0 ? row.total_cost / row.total_quantity : 0;
    const currentPrice = row.current_price;
    const marketValue = currentPrice != null ? row.total_quantity * currentPrice : null;
    const gain = marketValue != null ? marketValue - row.total_cost : null;

    let valueBrl: number | null = null;
    if (marketValue != null) {
      valueBrl = row.asset_currency === 'USD' ? marketValue * usdBrlRate : marketValue;
    }

    return {
      asset_id: row.asset_id,
      asset_name: row.asset_name,
      asset_ticker: row.asset_ticker,
      asset_type: row.asset_type,
      asset_class: row.asset_class,
      asset_currency: row.asset_currency,
      sector: row.sector,
      current_price: currentPrice,
      total_quantity: row.total_quantity,
      total_cost: row.total_cost,
      average_cost: averageCost,
      market_value: marketValue,
      gain,
      value_brl: valueBrl,
    };
  });
}
