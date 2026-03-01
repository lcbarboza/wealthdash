/**
 * Shared chart color palette for the dashboard.
 * Uses oklch values matching the WealthDash theme tokens for consistency.
 * Each color has a fill (lighter) and stroke (darker) for depth.
 *
 * Palette: Emerald → Gold → Teal → Coral → Violet → Sky → Amber → Pink
 */
export const CHART_COLORS = [
  { fill: 'oklch(0.52 0.14 162)', stroke: 'oklch(0.44 0.12 162)' }, // primary (emerald)
  { fill: 'oklch(0.72 0.15 80)', stroke: 'oklch(0.62 0.14 80)' }, // accent (gold)
  { fill: 'oklch(0.55 0.15 155)', stroke: 'oklch(0.47 0.13 155)' }, // success (vivid emerald)
  { fill: 'oklch(0.55 0.20 20)', stroke: 'oklch(0.47 0.20 20)' }, // danger (coral)
  { fill: 'oklch(0.60 0.15 195)', stroke: 'oklch(0.50 0.15 195)' }, // teal
  { fill: 'oklch(0.62 0.18 310)', stroke: 'oklch(0.52 0.18 310)' }, // violet
  { fill: 'oklch(0.65 0.17 75)', stroke: 'oklch(0.55 0.16 75)' }, // amber
  { fill: 'oklch(0.58 0.14 340)', stroke: 'oklch(0.48 0.14 340)' }, // pink
  { fill: 'oklch(0.65 0.12 220)', stroke: 'oklch(0.55 0.12 220)' }, // sky
  { fill: 'oklch(0.60 0.15 130)', stroke: 'oklch(0.50 0.15 130)' }, // emerald-light
  { fill: 'oklch(0.68 0.16 60)', stroke: 'oklch(0.58 0.16 60)' }, // orange
  { fill: 'oklch(0.55 0.12 280)', stroke: 'oklch(0.45 0.12 280)' }, // indigo-deep
] as const;

export function getChartColor(index: number) {
  return CHART_COLORS[index % CHART_COLORS.length];
}

/** Tailwind bg class equivalents for legend swatches */
export const SWATCH_COLORS = [
  'bg-primary-500',
  'bg-accent-500',
  'bg-success-500',
  'bg-danger-500',
  'bg-[oklch(0.60_0.15_195)]',
  'bg-[oklch(0.62_0.18_310)]',
  'bg-[oklch(0.65_0.17_75)]',
  'bg-[oklch(0.58_0.14_340)]',
  'bg-[oklch(0.65_0.12_220)]',
  'bg-[oklch(0.60_0.15_130)]',
  'bg-[oklch(0.68_0.16_60)]',
  'bg-[oklch(0.55_0.12_280)]',
];

export function getSwatchColor(index: number): string {
  return SWATCH_COLORS[index % SWATCH_COLORS.length];
}
