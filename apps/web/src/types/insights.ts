export type InsightSeverity = 'info' | 'warning' | 'critical';

export type InsightCategory = 'allocation';

export interface Insight {
  id: string;
  category: InsightCategory;
  severity: InsightSeverity;
  title: string;
  description: string;
  data: Record<string, unknown>;
}

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
