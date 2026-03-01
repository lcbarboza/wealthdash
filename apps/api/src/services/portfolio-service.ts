import { db } from '../db/index.js';
import { wallets } from '../db/schema.js';
import type {
  AllocationBreakdownItem,
  PortfolioSummary,
  TopHoldingItem,
} from '../types/portfolio.js';
import type { Position } from '../types/transaction.js';
import { getPositionsByWallet } from './transaction-service.js';

/**
 * Aggregate positions across all wallets into a single portfolio summary.
 * Positions for the same asset in different wallets are merged (summed).
 * Positions without market value (value_brl === null) are excluded from
 * allocation calculations but counted in positions_missing_price.
 */
export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  // 1. Fetch all wallets
  const allWallets = db.select({ id: wallets.id, name: wallets.name }).from(wallets).all();

  // 2. Fetch positions for each wallet, track per-wallet totals, and merge by asset_id
  const mergedMap = new Map<string, Position>();
  const walletTotals = new Map<
    string,
    { name: string; value: number; cost: number; gain: number }
  >();

  for (const w of allWallets) {
    const positions = await getPositionsByWallet(w.id);

    // Accumulate per-wallet totals (only priced positions)
    let wValue = 0;
    let wCost = 0;
    let wGain = 0;
    for (const p of positions) {
      if (p.value_brl != null) {
        wValue += p.value_brl;
        wCost += p.total_cost;
        wGain += p.gain ?? 0;
      }
    }
    walletTotals.set(w.id, { name: w.name, value: wValue, cost: wCost, gain: wGain });

    // Merge positions by asset_id across wallets
    for (const p of positions) {
      const existing = mergedMap.get(p.asset_id);
      if (existing) {
        existing.total_quantity += p.total_quantity;
        existing.total_cost += p.total_cost;
        existing.average_cost =
          existing.total_quantity > 0 ? existing.total_cost / existing.total_quantity : 0;
        if (existing.market_value != null && p.market_value != null) {
          existing.market_value += p.market_value;
        } else if (p.market_value != null) {
          existing.market_value = p.market_value;
        }
        if (existing.gain != null && p.gain != null) {
          existing.gain += p.gain;
        } else if (p.gain != null) {
          existing.gain = p.gain;
        }
        if (existing.value_brl != null && p.value_brl != null) {
          existing.value_brl += p.value_brl;
        } else if (p.value_brl != null) {
          existing.value_brl = p.value_brl;
        }
      } else {
        // Clone so we don't mutate the original
        mergedMap.set(p.asset_id, { ...p });
      }
    }
  }

  const allPositions = Array.from(mergedMap.values());

  // 3. Split into priced vs missing-price
  const priced = allPositions.filter((p) => p.value_brl != null);
  const missingCount = allPositions.filter((p) => p.value_brl == null).length;

  // 4. Compute totals
  const totalValue = priced.reduce((sum, p) => sum + (p.value_brl ?? 0), 0);
  const totalCost = priced.reduce((sum, p) => sum + p.total_cost, 0);
  const totalGain = totalValue - totalCost;
  const totalGainPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

  // 5. Breakdown helpers
  function buildBreakdown(keyFn: (p: Position) => string): AllocationBreakdownItem[] {
    const groups = new Map<string, { value: number; cost: number; gain: number }>();
    for (const p of priced) {
      const key = keyFn(p);
      const g = groups.get(key) ?? { value: 0, cost: 0, gain: 0 };
      g.value += p.value_brl ?? 0;
      g.cost += p.total_cost;
      g.gain += p.gain ?? 0;
      groups.set(key, g);
    }
    return Array.from(groups.entries())
      .map(([label, g]) => ({
        label,
        value: g.value,
        weight: totalValue > 0 ? (g.value / totalValue) * 100 : 0,
        cost: g.cost,
        gain: g.gain,
      }))
      .sort((a, b) => b.value - a.value);
  }

  const byAssetClass = buildBreakdown((p) => p.asset_class);
  const byAssetType = buildBreakdown((p) => p.asset_type);
  const byCurrency = buildBreakdown((p) => p.asset_currency);
  const bySector = buildBreakdown((p) => p.sector ?? 'Unclassified');

  // 6. Breakdown by wallet (from pre-computed per-wallet totals)
  const byWallet: AllocationBreakdownItem[] = Array.from(walletTotals.values())
    .map((w) => ({
      label: w.name,
      value: w.value,
      weight: totalValue > 0 ? (w.value / totalValue) * 100 : 0,
      cost: w.cost,
      gain: w.gain,
    }))
    .sort((a, b) => b.value - a.value);

  // 7. Top holdings
  const topHoldings: TopHoldingItem[] = priced
    .map((p) => ({
      asset_id: p.asset_id,
      asset_name: p.asset_name,
      asset_ticker: p.asset_ticker,
      asset_type: p.asset_type,
      value: p.value_brl ?? 0,
      weight: totalValue > 0 ? ((p.value_brl ?? 0) / totalValue) * 100 : 0,
      gain: p.gain ?? 0,
    }))
    .sort((a, b) => b.value - a.value);

  return {
    total_value: totalValue,
    total_cost: totalCost,
    total_gain: totalGain,
    total_gain_pct: totalGainPct,
    total_positions: allPositions.length,
    positions_missing_price: missingCount,
    by_asset_class: byAssetClass,
    by_asset_type: byAssetType,
    by_currency: byCurrency,
    by_sector: bySector,
    by_wallet: byWallet,
    top_holdings: topHoldings,
  };
}
