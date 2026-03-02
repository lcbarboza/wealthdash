// ---- Severity & Category ----

export const InsightSeverity = {
  INFO: 'info',
  WARNING: 'warning',
  CRITICAL: 'critical',
} as const;
export type InsightSeverity = (typeof InsightSeverity)[keyof typeof InsightSeverity];

export const InsightCategory = {
  ALLOCATION: 'allocation',
} as const;
export type InsightCategory = (typeof InsightCategory)[keyof typeof InsightCategory];

// ---- Insight object ----

export interface Insight {
  id: string;
  category: InsightCategory;
  severity: InsightSeverity;
  title: string;
  description: string;
  data: Record<string, unknown>;
}

// ---- Response envelope ----

export interface InsightsSummary {
  total_insights: number;
  info: number;
  warning: number;
  critical: number;
}

export interface AllocationInsightsResponse {
  insights: Insight[];
  summary: InsightsSummary;
  generated_at: string;
}

// ---- Thresholds ----

export const THRESHOLDS = {
  ASSET_CLASS_CONCENTRATION_WARNING: 70,
  ASSET_CLASS_CONCENTRATION_CRITICAL: 85,
  SINGLE_ASSET_WARNING: 20,
  SINGLE_ASSET_CRITICAL: 35,
  TOP3_WARNING: 60,
  TOP3_CRITICAL: 80,
  CURRENCY_CONCENTRATION_INFO: 90,
  CURRENCY_CONCENTRATION_WARNING: 95,
  SECTOR_CONCENTRATION_WARNING: 40,
  SECTOR_CONCENTRATION_CRITICAL: 55,
  WALLET_CONCENTRATION_INFO: 80,
  WALLET_CONCENTRATION_WARNING: 90,
  SMALL_POSITION_THRESHOLD: 1,
  SMALL_POSITION_MIN_COUNT: 3,
} as const;
