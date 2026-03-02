import {
  type AllocationInsightsResponse,
  type Insight,
  InsightCategory,
  InsightSeverity,
  type InsightsSummary,
  THRESHOLDS,
} from '../types/insights.js';
import type { PortfolioSummary } from '../types/portfolio.js';
import { getPortfolioSummary } from './portfolio-service.js';

const ALL_ASSET_CLASSES = ['EQUITY', 'FIXED_INCOME', 'REAL_ESTATE'];

const ASSET_CLASS_LABELS: Record<string, string> = {
  EQUITY: 'Equity',
  FIXED_INCOME: 'Fixed Income',
  REAL_ESTATE: 'Real Estate',
};

// ---- Rule functions ----

function checkAssetClassConcentration(summary: PortfolioSummary): Insight[] {
  const insights: Insight[] = [];
  for (const item of summary.by_asset_class) {
    if (item.weight >= THRESHOLDS.ASSET_CLASS_CONCENTRATION_CRITICAL) {
      const label = ASSET_CLASS_LABELS[item.label] ?? item.label;
      insights.push({
        id: `asset-class-concentration-critical-${item.label.toLowerCase()}`,
        category: InsightCategory.ALLOCATION,
        severity: InsightSeverity.CRITICAL,
        title: `Severe ${label} concentration`,
        description: `${label} represents ${item.weight.toFixed(1)}% of your portfolio, exceeding the ${THRESHOLDS.ASSET_CLASS_CONCENTRATION_CRITICAL}% critical threshold. This level of concentration significantly increases risk exposure to a single asset class.`,
        data: {
          asset_class: item.label,
          weight: Number(item.weight.toFixed(1)),
          threshold: THRESHOLDS.ASSET_CLASS_CONCENTRATION_CRITICAL,
        },
      });
    } else if (item.weight >= THRESHOLDS.ASSET_CLASS_CONCENTRATION_WARNING) {
      const label = ASSET_CLASS_LABELS[item.label] ?? item.label;
      insights.push({
        id: `asset-class-concentration-warning-${item.label.toLowerCase()}`,
        category: InsightCategory.ALLOCATION,
        severity: InsightSeverity.WARNING,
        title: `${label} overconcentration`,
        description: `${label} represents ${item.weight.toFixed(1)}% of your portfolio, exceeding the ${THRESHOLDS.ASSET_CLASS_CONCENTRATION_WARNING}% warning threshold. Consider diversifying into other asset classes to reduce risk.`,
        data: {
          asset_class: item.label,
          weight: Number(item.weight.toFixed(1)),
          threshold: THRESHOLDS.ASSET_CLASS_CONCENTRATION_WARNING,
        },
      });
    }
  }
  return insights;
}

function checkAssetClassGap(summary: PortfolioSummary): Insight[] {
  const presentClasses = new Set(summary.by_asset_class.map((i) => i.label));
  const insights: Insight[] = [];
  for (const cls of ALL_ASSET_CLASSES) {
    if (!presentClasses.has(cls)) {
      const label = ASSET_CLASS_LABELS[cls] ?? cls;
      insights.push({
        id: `asset-class-gap-${cls.toLowerCase()}`,
        category: InsightCategory.ALLOCATION,
        severity: InsightSeverity.INFO,
        title: `No ${label} exposure`,
        description: `Your portfolio has no ${label.toLowerCase()} positions. Consider adding ${label.toLowerCase()} assets to improve diversification across asset classes.`,
        data: { missing_class: cls },
      });
    }
  }
  return insights;
}

function checkSingleAssetDominance(summary: PortfolioSummary): Insight[] {
  const insights: Insight[] = [];
  for (const h of summary.top_holdings) {
    if (h.weight >= THRESHOLDS.SINGLE_ASSET_CRITICAL) {
      insights.push({
        id: `single-asset-critical-${h.asset_id}`,
        category: InsightCategory.ALLOCATION,
        severity: InsightSeverity.CRITICAL,
        title: `Severe ${h.asset_ticker ?? h.asset_name} dominance`,
        description: `${h.asset_ticker ?? h.asset_name} represents ${h.weight.toFixed(1)}% of your portfolio, exceeding the ${THRESHOLDS.SINGLE_ASSET_CRITICAL}% critical threshold. A single asset at this weight creates significant idiosyncratic risk.`,
        data: {
          asset_id: h.asset_id,
          asset_name: h.asset_name,
          asset_ticker: h.asset_ticker,
          weight: Number(h.weight.toFixed(1)),
          threshold: THRESHOLDS.SINGLE_ASSET_CRITICAL,
        },
      });
    } else if (h.weight >= THRESHOLDS.SINGLE_ASSET_WARNING) {
      insights.push({
        id: `single-asset-warning-${h.asset_id}`,
        category: InsightCategory.ALLOCATION,
        severity: InsightSeverity.WARNING,
        title: `${h.asset_ticker ?? h.asset_name} overweight`,
        description: `${h.asset_ticker ?? h.asset_name} represents ${h.weight.toFixed(1)}% of your portfolio, exceeding the ${THRESHOLDS.SINGLE_ASSET_WARNING}% threshold. Consider reducing exposure to limit single-asset risk.`,
        data: {
          asset_id: h.asset_id,
          asset_name: h.asset_name,
          asset_ticker: h.asset_ticker,
          weight: Number(h.weight.toFixed(1)),
          threshold: THRESHOLDS.SINGLE_ASSET_WARNING,
        },
      });
    }
  }
  return insights;
}

function checkTop3Concentration(summary: PortfolioSummary): Insight[] {
  const top3 = summary.top_holdings.slice(0, 3);
  if (top3.length === 0) return [];

  const combinedWeight = top3.reduce((sum, h) => sum + h.weight, 0);
  const names = top3.map((h) => h.asset_ticker ?? h.asset_name).join(', ');

  if (combinedWeight >= THRESHOLDS.TOP3_CRITICAL) {
    return [
      {
        id: 'top3-concentration-critical',
        category: InsightCategory.ALLOCATION,
        severity: InsightSeverity.CRITICAL,
        title: 'Severe top-3 concentration',
        description: `Your top 3 holdings (${names}) represent ${combinedWeight.toFixed(1)}% of the portfolio, exceeding the ${THRESHOLDS.TOP3_CRITICAL}% critical threshold. The portfolio is heavily dependent on a few positions.`,
        data: {
          top3_names: names,
          combined_weight: Number(combinedWeight.toFixed(1)),
          threshold: THRESHOLDS.TOP3_CRITICAL,
        },
      },
    ];
  }

  if (combinedWeight >= THRESHOLDS.TOP3_WARNING) {
    return [
      {
        id: 'top3-concentration-warning',
        category: InsightCategory.ALLOCATION,
        severity: InsightSeverity.WARNING,
        title: 'Top-3 holdings concentration',
        description: `Your top 3 holdings (${names}) represent ${combinedWeight.toFixed(1)}% of the portfolio, exceeding the ${THRESHOLDS.TOP3_WARNING}% threshold. Consider spreading investments across more positions.`,
        data: {
          top3_names: names,
          combined_weight: Number(combinedWeight.toFixed(1)),
          threshold: THRESHOLDS.TOP3_WARNING,
        },
      },
    ];
  }

  return [];
}

function checkCurrencyConcentration(summary: PortfolioSummary): Insight[] {
  const insights: Insight[] = [];
  for (const item of summary.by_currency) {
    if (item.weight >= THRESHOLDS.CURRENCY_CONCENTRATION_WARNING) {
      insights.push({
        id: `currency-concentration-warning-${item.label.toLowerCase()}`,
        category: InsightCategory.ALLOCATION,
        severity: InsightSeverity.WARNING,
        title: `${item.label} currency overconcentration`,
        description: `${item.label} represents ${item.weight.toFixed(1)}% of your portfolio, exceeding ${THRESHOLDS.CURRENCY_CONCENTRATION_WARNING}%. Consider adding assets in other currencies to hedge against exchange rate risk.`,
        data: {
          currency: item.label,
          weight: Number(item.weight.toFixed(1)),
          threshold: THRESHOLDS.CURRENCY_CONCENTRATION_WARNING,
        },
      });
    } else if (item.weight >= THRESHOLDS.CURRENCY_CONCENTRATION_INFO) {
      insights.push({
        id: `currency-concentration-info-${item.label.toLowerCase()}`,
        category: InsightCategory.ALLOCATION,
        severity: InsightSeverity.INFO,
        title: `High ${item.label} currency exposure`,
        description: `${item.label} represents ${item.weight.toFixed(1)}% of your portfolio. Adding assets in other currencies could improve diversification.`,
        data: {
          currency: item.label,
          weight: Number(item.weight.toFixed(1)),
          threshold: THRESHOLDS.CURRENCY_CONCENTRATION_INFO,
        },
      });
    }
  }
  return insights;
}

function checkSectorConcentration(summary: PortfolioSummary): Insight[] {
  const insights: Insight[] = [];
  for (const item of summary.by_sector) {
    if (item.label === 'Unclassified') continue;

    if (item.weight >= THRESHOLDS.SECTOR_CONCENTRATION_CRITICAL) {
      insights.push({
        id: `sector-concentration-critical-${item.label.toLowerCase().replace(/\s+/g, '-')}`,
        category: InsightCategory.ALLOCATION,
        severity: InsightSeverity.CRITICAL,
        title: `Severe ${item.label} sector concentration`,
        description: `The ${item.label} sector represents ${item.weight.toFixed(1)}% of your portfolio, exceeding the ${THRESHOLDS.SECTOR_CONCENTRATION_CRITICAL}% critical threshold. Heavy sector bets amplify industry-specific risk.`,
        data: {
          sector: item.label,
          weight: Number(item.weight.toFixed(1)),
          threshold: THRESHOLDS.SECTOR_CONCENTRATION_CRITICAL,
        },
      });
    } else if (item.weight >= THRESHOLDS.SECTOR_CONCENTRATION_WARNING) {
      insights.push({
        id: `sector-concentration-warning-${item.label.toLowerCase().replace(/\s+/g, '-')}`,
        category: InsightCategory.ALLOCATION,
        severity: InsightSeverity.WARNING,
        title: `${item.label} sector overweight`,
        description: `The ${item.label} sector represents ${item.weight.toFixed(1)}% of your portfolio, exceeding the ${THRESHOLDS.SECTOR_CONCENTRATION_WARNING}% threshold. Consider diversifying across more sectors.`,
        data: {
          sector: item.label,
          weight: Number(item.weight.toFixed(1)),
          threshold: THRESHOLDS.SECTOR_CONCENTRATION_WARNING,
        },
      });
    }
  }
  return insights;
}

function checkWalletConcentration(summary: PortfolioSummary): Insight[] {
  // Skip if only one wallet — expected for new users
  if (summary.by_wallet.length <= 1) return [];

  const insights: Insight[] = [];
  for (const item of summary.by_wallet) {
    if (item.weight >= THRESHOLDS.WALLET_CONCENTRATION_WARNING) {
      insights.push({
        id: `wallet-concentration-warning-${item.label.toLowerCase().replace(/\s+/g, '-')}`,
        category: InsightCategory.ALLOCATION,
        severity: InsightSeverity.WARNING,
        title: `${item.label} wallet overconcentration`,
        description: `Wallet "${item.label}" holds ${item.weight.toFixed(1)}% of your portfolio, exceeding ${THRESHOLDS.WALLET_CONCENTRATION_WARNING}%. Distributing assets across multiple brokers reduces counterparty risk.`,
        data: {
          wallet: item.label,
          weight: Number(item.weight.toFixed(1)),
          threshold: THRESHOLDS.WALLET_CONCENTRATION_WARNING,
        },
      });
    } else if (item.weight >= THRESHOLDS.WALLET_CONCENTRATION_INFO) {
      insights.push({
        id: `wallet-concentration-info-${item.label.toLowerCase().replace(/\s+/g, '-')}`,
        category: InsightCategory.ALLOCATION,
        severity: InsightSeverity.INFO,
        title: `High concentration in ${item.label}`,
        description: `Wallet "${item.label}" holds ${item.weight.toFixed(1)}% of your portfolio. Consider spreading investments across brokers to reduce counterparty risk.`,
        data: {
          wallet: item.label,
          weight: Number(item.weight.toFixed(1)),
          threshold: THRESHOLDS.WALLET_CONCENTRATION_INFO,
        },
      });
    }
  }
  return insights;
}

function checkSmallPositions(summary: PortfolioSummary): Insight[] {
  const small = summary.top_holdings.filter((h) => h.weight < THRESHOLDS.SMALL_POSITION_THRESHOLD);

  if (small.length <= THRESHOLDS.SMALL_POSITION_MIN_COUNT) return [];

  const combinedWeight = small.reduce((sum, h) => sum + h.weight, 0);

  return [
    {
      id: 'small-positions-alert',
      category: InsightCategory.ALLOCATION,
      severity: InsightSeverity.INFO,
      title: `${small.length} small positions detected`,
      description: `You have ${small.length} positions each representing less than ${THRESHOLDS.SMALL_POSITION_THRESHOLD}% of your portfolio (${combinedWeight.toFixed(1)}% combined). These may add complexity without meaningful impact on returns. Consider consolidating.`,
      data: {
        count: small.length,
        combined_weight: Number(combinedWeight.toFixed(1)),
        threshold: THRESHOLDS.SMALL_POSITION_THRESHOLD,
      },
    },
  ];
}

function checkMissingPrices(summary: PortfolioSummary): Insight[] {
  if (summary.positions_missing_price === 0) return [];

  return [
    {
      id: 'missing-prices-warning',
      category: InsightCategory.ALLOCATION,
      severity: InsightSeverity.WARNING,
      title: `${summary.positions_missing_price} position${summary.positions_missing_price > 1 ? 's' : ''} missing prices`,
      description: `${summary.positions_missing_price} position${summary.positions_missing_price > 1 ? 's lack' : ' lacks'} a current market price and ${summary.positions_missing_price > 1 ? 'are' : 'is'} excluded from allocation calculations. Update prices to get a complete allocation analysis.`,
      data: {
        count: summary.positions_missing_price,
      },
    },
  ];
}

// ---- Main function ----

function buildSummary(insights: Insight[]): InsightsSummary {
  let info = 0;
  let warning = 0;
  let critical = 0;
  for (const i of insights) {
    if (i.severity === InsightSeverity.INFO) info++;
    else if (i.severity === InsightSeverity.WARNING) warning++;
    else if (i.severity === InsightSeverity.CRITICAL) critical++;
  }
  return { total_insights: insights.length, info, warning, critical };
}

export async function getAllocationInsights(): Promise<AllocationInsightsResponse> {
  const summary = await getPortfolioSummary();

  // If portfolio is empty, return early
  if (summary.total_value === 0 && summary.positions_missing_price === 0) {
    return {
      insights: [],
      summary: { total_insights: 0, info: 0, warning: 0, critical: 0 },
      generated_at: new Date().toISOString(),
    };
  }

  const insights: Insight[] = [
    ...checkAssetClassConcentration(summary),
    ...checkAssetClassGap(summary),
    ...checkSingleAssetDominance(summary),
    ...checkTop3Concentration(summary),
    ...checkCurrencyConcentration(summary),
    ...checkSectorConcentration(summary),
    ...checkWalletConcentration(summary),
    ...checkSmallPositions(summary),
    ...checkMissingPrices(summary),
  ];

  // Sort: critical first, then warning, then info
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  insights.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return {
    insights,
    summary: buildSummary(insights),
    generated_at: new Date().toISOString(),
  };
}
