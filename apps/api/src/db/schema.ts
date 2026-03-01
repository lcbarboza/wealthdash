import { sql } from 'drizzle-orm';
import { index, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const assets = sqliteTable('assets', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  ticker: text('ticker'),
  asset_type: text('asset_type').notNull(),
  asset_class: text('asset_class').notNull(),
  sector: text('sector'),
  currency: text('currency').notNull().default('BRL'),

  // Fixed income fields (nullable for non-fixed-income assets)
  maturity_date: text('maturity_date'),
  rate_type: text('rate_type'),
  indexer: text('indexer'),
  rate_value: real('rate_value'),

  // Current market price (manually entered, in asset's currency)
  current_price: real('current_price'),

  // Metadata
  notes: text('notes'),
  created_at: text('created_at').notNull().default(sql`(datetime('now'))`),
  updated_at: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

export const wallets = sqliteTable(
  'wallets',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    created_at: text('created_at').notNull().default(sql`(datetime('now'))`),
    updated_at: text('updated_at').notNull().default(sql`(datetime('now'))`),
  },
  (table) => [uniqueIndex('wallets_name_unique').on(table.name)],
);

export const transactions = sqliteTable(
  'transactions',
  {
    id: text('id').primaryKey(),
    wallet_id: text('wallet_id')
      .notNull()
      .references(() => wallets.id, { onDelete: 'cascade' }),
    asset_id: text('asset_id')
      .notNull()
      .references(() => assets.id),
    type: text('type').notNull().default('BUY'),
    quantity: real('quantity').notNull(),
    unit_price: real('unit_price').notNull(),
    date: text('date').notNull(),
    notes: text('notes'),
    created_at: text('created_at').notNull().default(sql`(datetime('now'))`),
    updated_at: text('updated_at').notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    index('transactions_wallet_id_idx').on(table.wallet_id),
    index('transactions_asset_id_idx').on(table.asset_id),
    index('transactions_date_idx').on(table.date),
  ],
);

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updated_at: text('updated_at').notNull().default(sql`(datetime('now'))`),
});
