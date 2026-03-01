import crypto from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { wallets } from '../db/schema.js';
import type { CreateWalletInput, UpdateWalletInput } from '../types/wallet.js';

export class WalletValidationError extends Error {
  constructor(
    message: string,
    public readonly fields: string[],
  ) {
    super(message);
    this.name = 'WalletValidationError';
  }
}

export class WalletConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WalletConflictError';
  }
}

export class WalletNotFoundError extends Error {
  constructor(id: string) {
    super(`Wallet not found: ${id}`);
    this.name = 'WalletNotFoundError';
  }
}

function validateWalletInput(input: CreateWalletInput | UpdateWalletInput, isCreate: boolean) {
  const errors: string[] = [];

  if (isCreate) {
    const create = input as CreateWalletInput;
    if (!create.name?.trim()) errors.push('name is required');
  } else if (input.name !== undefined && !input.name.trim()) {
    errors.push('name cannot be empty');
  }

  if (errors.length > 0) {
    throw new WalletValidationError(`Validation failed: ${errors.join('; ')}`, errors);
  }
}

export async function createWallet(input: CreateWalletInput) {
  validateWalletInput(input, true);

  const id = crypto.randomUUID();
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

  try {
    const result = db
      .insert(wallets)
      .values({
        id,
        name: input.name.trim(),
        description: input.description ?? null,
        created_at: now,
        updated_at: now,
      })
      .returning()
      .get();

    return result;
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      throw new WalletConflictError(`Wallet with name "${input.name}" already exists`);
    }
    throw error;
  }
}

export async function getWalletById(id: string) {
  const result = db.select().from(wallets).where(eq(wallets.id, id)).get();

  if (!result) {
    throw new WalletNotFoundError(id);
  }

  return result;
}

export async function listWallets() {
  return db.select().from(wallets).all();
}

export async function updateWallet(id: string, input: UpdateWalletInput) {
  const existing = db.select().from(wallets).where(eq(wallets.id, id)).get();

  if (!existing) {
    throw new WalletNotFoundError(id);
  }

  validateWalletInput(input, false);

  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

  const updates: Record<string, unknown> = { updated_at: now };
  if (input.name !== undefined) updates.name = input.name.trim();
  if (input.description !== undefined) updates.description = input.description;

  try {
    const result = db.update(wallets).set(updates).where(eq(wallets.id, id)).returning().get();

    return result;
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      throw new WalletConflictError(`Wallet with name "${input.name}" already exists`);
    }
    throw error;
  }
}

export async function deleteWallet(id: string) {
  const existing = db.select().from(wallets).where(eq(wallets.id, id)).get();

  if (!existing) {
    throw new WalletNotFoundError(id);
  }

  // Transactions are cascade-deleted by the FK constraint
  db.delete(wallets).where(eq(wallets.id, id)).run();

  return existing;
}
