/** A single row in an allocation breakdown (by class, type, currency, or sector) */
export interface AllocationBreakdownItem {
  label: string;
  value: number;
  weight: number;
  cost: number;
  gain: number;
}

/** A single top-holding entry */
export interface TopHoldingItem {
  asset_id: string;
  asset_name: string;
  asset_ticker: string | null;
  asset_type: string;
  value: number;
  weight: number;
  gain: number;
}

/** Full portfolio summary returned by GET /api/portfolio/summary */
export interface PortfolioSummary {
  total_value: number;
  total_cost: number;
  total_gain: number;
  total_gain_pct: number;
  total_positions: number;
  positions_missing_price: number;
  by_asset_class: AllocationBreakdownItem[];
  by_asset_type: AllocationBreakdownItem[];
  by_currency: AllocationBreakdownItem[];
  by_sector: AllocationBreakdownItem[];
  by_wallet: AllocationBreakdownItem[];
  top_holdings: TopHoldingItem[];
}
