export const AssetType = {
  STOCK: 'STOCK',
  ETF: 'ETF',
  FII: 'FII',
  FUND: 'FUND',
  PREVIDENCIA: 'PREVIDENCIA',
  TESOURO: 'TESOURO',
  CDB: 'CDB',
  LCI: 'LCI',
  LCA: 'LCA',
  CRI: 'CRI',
  CRA: 'CRA',
} as const;
export type AssetType = (typeof AssetType)[keyof typeof AssetType];

export const AssetClass = {
  EQUITY: 'EQUITY',
  FIXED_INCOME: 'FIXED_INCOME',
  REAL_ESTATE: 'REAL_ESTATE',
} as const;
export type AssetClass = (typeof AssetClass)[keyof typeof AssetClass];

export const Currency = {
  BRL: 'BRL',
  USD: 'USD',
} as const;
export type Currency = (typeof Currency)[keyof typeof Currency];

export const RateType = {
  PRE: 'PRE',
  POST: 'POST',
  HYBRID: 'HYBRID',
} as const;
export type RateType = (typeof RateType)[keyof typeof RateType];

export const Indexer = {
  CDI: 'CDI',
  IPCA: 'IPCA',
  SELIC: 'SELIC',
  NONE: 'NONE',
} as const;
export type Indexer = (typeof Indexer)[keyof typeof Indexer];

/** Asset types that require fixed income fields */
export const FIXED_INCOME_TYPES: ReadonlySet<AssetType> = new Set([
  AssetType.TESOURO,
  AssetType.CDB,
  AssetType.LCI,
  AssetType.LCA,
  AssetType.CRI,
  AssetType.CRA,
]);

export const ASSET_TYPE_VALUES = Object.values(AssetType);
export const ASSET_CLASS_VALUES = Object.values(AssetClass);
export const CURRENCY_VALUES = Object.values(Currency);
export const RATE_TYPE_VALUES = Object.values(RateType);
export const INDEXER_VALUES = Object.values(Indexer);

/** Input DTO for creating an asset */
export interface CreateAssetInput {
  name: string;
  ticker?: string | null;
  asset_type: AssetType;
  asset_class: AssetClass;
  sector?: string | null;
  currency?: Currency;
  maturity_date?: string | null;
  rate_type?: RateType | null;
  indexer?: Indexer | null;
  rate_value?: number | null;
  notes?: string | null;
}

/** Input DTO for updating an asset (all fields optional) */
export interface UpdateAssetInput {
  name?: string;
  ticker?: string | null;
  asset_type?: AssetType;
  asset_class?: AssetClass;
  sector?: string | null;
  currency?: Currency;
  maturity_date?: string | null;
  rate_type?: RateType | null;
  indexer?: Indexer | null;
  rate_value?: number | null;
  notes?: string | null;
}

/** Query filters for listing assets */
export interface AssetFilters {
  asset_type?: AssetType;
  asset_class?: AssetClass;
  currency?: Currency;
}
