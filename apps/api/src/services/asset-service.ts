import crypto from 'node:crypto';
import { and, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { assets } from '../db/schema.js';
import {
  ASSET_CLASS_VALUES,
  ASSET_TYPE_VALUES,
  type AssetFilters,
  CURRENCY_VALUES,
  type CreateAssetInput,
  FIXED_INCOME_TYPES,
  INDEXER_VALUES,
  RATE_TYPE_VALUES,
  type UpdateAssetInput,
} from '../types/asset.js';

export class AssetValidationError extends Error {
  constructor(
    message: string,
    public readonly fields: string[],
  ) {
    super(message);
    this.name = 'AssetValidationError';
  }
}

export class AssetConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AssetConflictError';
  }
}

export class AssetNotFoundError extends Error {
  constructor(id: string) {
    super(`Asset not found: ${id}`);
    this.name = 'AssetNotFoundError';
  }
}

function validateAssetInput(input: CreateAssetInput | UpdateAssetInput, isCreate: boolean) {
  const errors: string[] = [];

  if (isCreate) {
    const create = input as CreateAssetInput;
    if (!create.name?.trim()) errors.push('name is required');
    if (!create.asset_type) errors.push('asset_type is required');
    if (!create.asset_class) errors.push('asset_class is required');
  }

  if (input.asset_type !== undefined && !ASSET_TYPE_VALUES.includes(input.asset_type)) {
    errors.push(
      `invalid asset_type: ${input.asset_type}. Valid values: ${ASSET_TYPE_VALUES.join(', ')}`,
    );
  }

  if (input.asset_class !== undefined && !ASSET_CLASS_VALUES.includes(input.asset_class)) {
    errors.push(
      `invalid asset_class: ${input.asset_class}. Valid values: ${ASSET_CLASS_VALUES.join(', ')}`,
    );
  }

  if (input.currency !== undefined && !CURRENCY_VALUES.includes(input.currency)) {
    errors.push(`invalid currency: ${input.currency}. Valid values: ${CURRENCY_VALUES.join(', ')}`);
  }

  if (
    input.rate_type !== undefined &&
    input.rate_type !== null &&
    !RATE_TYPE_VALUES.includes(input.rate_type)
  ) {
    errors.push(
      `invalid rate_type: ${input.rate_type}. Valid values: ${RATE_TYPE_VALUES.join(', ')}`,
    );
  }

  if (
    input.indexer !== undefined &&
    input.indexer !== null &&
    !INDEXER_VALUES.includes(input.indexer)
  ) {
    errors.push(`invalid indexer: ${input.indexer}. Valid values: ${INDEXER_VALUES.join(', ')}`);
  }

  // Fixed income type validation
  const assetType = input.asset_type;
  if (assetType && FIXED_INCOME_TYPES.has(assetType)) {
    const fixedFields = {
      maturity_date: input.maturity_date,
      rate_type: input.rate_type,
      indexer: input.indexer,
      rate_value: input.rate_value,
    };

    if (isCreate) {
      for (const [field, value] of Object.entries(fixedFields)) {
        if (value === undefined || value === null) {
          errors.push(`${field} is required for ${assetType}`);
        }
      }
    }
  }

  // Rate consistency rules
  if (input.rate_type === 'PRE' && input.indexer && input.indexer !== 'NONE') {
    errors.push('rate_type PRE requires indexer NONE');
  }

  if (
    (input.rate_type === 'POST' || input.rate_type === 'HYBRID') &&
    input.indexer !== undefined &&
    input.indexer !== null &&
    input.indexer === 'NONE'
  ) {
    errors.push(`rate_type ${input.rate_type} requires indexer other than NONE`);
  }

  // Current price validation
  if (
    input.current_price !== undefined &&
    input.current_price !== null &&
    input.current_price < 0
  ) {
    errors.push('current_price must be greater than or equal to zero');
  }

  if (errors.length > 0) {
    throw new AssetValidationError(`Validation failed: ${errors.join('; ')}`, errors);
  }
}

export async function createAsset(input: CreateAssetInput) {
  validateAssetInput(input, true);

  const id = crypto.randomUUID();
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

  try {
    const result = db
      .insert(assets)
      .values({
        id,
        name: input.name,
        ticker: input.ticker ?? null,
        asset_type: input.asset_type,
        asset_class: input.asset_class,
        sector: input.sector ?? null,
        currency: input.currency ?? 'BRL',
        current_price: input.current_price ?? null,
        maturity_date: input.maturity_date ?? null,
        rate_type: input.rate_type ?? null,
        indexer: input.indexer ?? null,
        rate_value: input.rate_value ?? null,
        notes: input.notes ?? null,
        created_at: now,
        updated_at: now,
      })
      .returning()
      .get();

    return result;
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      throw new AssetConflictError(`Asset with ticker "${input.ticker}" already exists`);
    }
    throw error;
  }
}

export async function getAssetById(id: string) {
  const result = db.select().from(assets).where(eq(assets.id, id)).get();

  if (!result) {
    throw new AssetNotFoundError(id);
  }

  return result;
}

export async function listAssets(filters?: AssetFilters) {
  const conditions = [];

  if (filters?.asset_type) {
    conditions.push(eq(assets.asset_type, filters.asset_type));
  }
  if (filters?.asset_class) {
    conditions.push(eq(assets.asset_class, filters.asset_class));
  }
  if (filters?.currency) {
    conditions.push(eq(assets.currency, filters.currency));
  }

  if (conditions.length > 0) {
    return db
      .select()
      .from(assets)
      .where(and(...conditions))
      .all();
  }

  return db.select().from(assets).all();
}

export async function updateAsset(id: string, input: UpdateAssetInput) {
  // Verify asset exists
  const existing = db.select().from(assets).where(eq(assets.id, id)).get();

  if (!existing) {
    throw new AssetNotFoundError(id);
  }

  // Merge with existing for validation context
  const merged = { ...existing, ...input };
  validateAssetInput(
    {
      name: merged.name,
      ticker: merged.ticker,
      asset_type: merged.asset_type as CreateAssetInput['asset_type'],
      asset_class: merged.asset_class as CreateAssetInput['asset_class'],
      sector: merged.sector,
      currency: merged.currency as CreateAssetInput['currency'],
      current_price: merged.current_price,
      maturity_date: merged.maturity_date,
      rate_type: merged.rate_type as CreateAssetInput['rate_type'],
      indexer: merged.indexer as CreateAssetInput['indexer'],
      rate_value: merged.rate_value,
      notes: merged.notes,
    },
    true,
  );

  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

  try {
    const result = db
      .update(assets)
      .set({
        ...input,
        updated_at: now,
      })
      .where(eq(assets.id, id))
      .returning()
      .get();

    return result;
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      throw new AssetConflictError(`Asset with ticker "${input.ticker}" already exists`);
    }
    throw error;
  }
}

export async function deleteAsset(id: string) {
  const existing = db.select().from(assets).where(eq(assets.id, id)).get();

  if (!existing) {
    throw new AssetNotFoundError(id);
  }

  db.delete(assets).where(eq(assets.id, id)).run();

  return existing;
}
