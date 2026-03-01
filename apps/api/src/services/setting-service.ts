import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { settings } from '../db/schema.js';
import type { UpdateSettingInput } from '../types/setting.js';

export class SettingNotFoundError extends Error {
  constructor(key: string) {
    super(`Setting not found: ${key}`);
    this.name = 'SettingNotFoundError';
  }
}

export class SettingValidationError extends Error {
  constructor(
    message: string,
    public readonly fields: string[],
  ) {
    super(message);
    this.name = 'SettingValidationError';
  }
}

/** Ensure default settings exist (idempotent) */
export function ensureDefaults() {
  const existing = db.select().from(settings).where(eq(settings.key, 'usd_brl_rate')).get();
  if (!existing) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    db.insert(settings).values({ key: 'usd_brl_rate', value: '5.00', updated_at: now }).run();
  }
}

export async function listSettings() {
  return db.select().from(settings).all();
}

export async function getSettingByKey(key: string) {
  const result = db.select().from(settings).where(eq(settings.key, key)).get();
  if (!result) {
    throw new SettingNotFoundError(key);
  }
  return result;
}

export async function updateSetting(key: string, input: UpdateSettingInput) {
  const existing = db.select().from(settings).where(eq(settings.key, key)).get();
  if (!existing) {
    throw new SettingNotFoundError(key);
  }

  if (!input.value || input.value.trim() === '') {
    throw new SettingValidationError('value must not be empty', ['value']);
  }

  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

  const result = db
    .update(settings)
    .set({ value: input.value.trim(), updated_at: now })
    .where(eq(settings.key, key))
    .returning()
    .get();

  return result;
}
