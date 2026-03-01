import { sql } from 'drizzle-orm';
import { real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

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

  // Metadata
  notes: text('notes'),
  created_at: text('created_at').notNull().default(sql`(datetime('now'))`),
  updated_at: text('updated_at').notNull().default(sql`(datetime('now'))`),
});
