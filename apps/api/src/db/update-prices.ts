/**
 * Fetch current prices for all assets and update the database.
 *
 * Data sources:
 * - BR Stocks (STOCK):  Google Finance (BVMF exchange)
 * - US ETFs (ETF):      Google Finance (NASDAQ/NYSEARCA/LON exchanges)
 * - Funds (FUND):       CVM informe diário (dados.cvm.gov.br) — ~2-3 day lag
 * - Previdência:        CVM informe diário (same as funds)
 * - Tesouro Direto:     Last known PU from BTG XLSX (no free API available)
 * - Fixed Income:       Last known PU from BTG XLSX (private instruments)
 * - USD/BRL rate:       AwesomeAPI (economia.awesomeapi.com.br)
 *
 * Usage: npm run db:update-prices (from apps/api)
 */

import { createWriteStream } from 'node:fs';
import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import os from 'node:os';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { assets, settings } from '../db/schema.js';
import { runMigrations } from './migrate.js';

// Ensure migrations are current
runMigrations();

// ─── HTTP Helper ────────────────────────────────────────────────────

function httpGet(url: string, opts: { headers?: Record<string, string> } = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          ...opts.headers,
        },
      },
      (res) => {
        // Follow redirects
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          httpGet(res.headers.location, opts).then(resolve, reject);
          return;
        }
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
        res.on('error', reject);
      },
    );
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error(`Timeout: ${url}`));
    });
  });
}

function httpDownload(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      },
      (res) => {
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          httpDownload(res.headers.location, destPath).then(resolve, reject);
          return;
        }
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const ws = createWriteStream(destPath);
        pipeline(res, ws).then(resolve, reject);
      },
    );
    req.on('error', reject);
    req.setTimeout(60000, () => {
      req.destroy();
      reject(new Error(`Timeout: ${url}`));
    });
  });
}

// ─── Google Finance Scraper ─────────────────────────────────────────

/**
 * Fetch a single stock/ETF price from Google Finance.
 * Returns the price as a number, or null if not found.
 */
async function fetchGoogleFinancePrice(ticker: string, exchange: string): Promise<number | null> {
  try {
    const url = `https://www.google.com/finance/quote/${ticker}:${exchange}`;
    const html = await httpGet(url);
    const match = html.match(/data-last-price="([^"]+)"/);
    if (match) {
      return Number.parseFloat(match[1]);
    }
    return null;
  } catch (error) {
    console.warn(
      `  WARN: Google Finance failed for ${ticker}:${exchange} -`,
      (error as Error).message,
    );
    return null;
  }
}

/** Map of US ETF tickers to their Google Finance exchange codes */
const US_ETF_EXCHANGES: Record<string, string> = {
  IBIT: 'NASDAQ',
  VCLT: 'NASDAQ',
  GLDM: 'NYSEARCA',
  EIMI: 'LON',
  IWDA: 'LON',
};

// ─── CVM Fund Cota Fetcher ──────────────────────────────────────────

/** CNPJ mapping for funds and previdência */
const FUND_CNPJ_MAP: Record<string, string> = {
  'BTG Black Tesouro Selic Simples FIRF RL': '54.996.629/0001-62',
  'BTG Digital Tesouro Selic Simples FIRF': '29.562.673/0001-17',
  'BTG Reference Ouro FIM': '33.600.729/0001-58',
  'BTG IMA-B Prev FICFIRF': '22.187.479/0001-50',
  'Kinea Prev Atlas BP FIF MM RL': '37.728.756/0001-61',
  'Absolute Vertex Prev FIM Access': '43.509.130/0001-67',
};

/**
 * Download the CVM monthly ZIP, extract CSV, and parse latest cota values.
 * Returns a map of CNPJ -> latest cota value.
 */
async function fetchCVMCotas(): Promise<Map<string, { date: string; cota: number }>> {
  const result = new Map<string, { date: string; cota: number }>();

  // Try current month first, then previous month as fallback
  const now = new Date();
  const months = [
    `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`,
    // Previous month
    (() => {
      const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return `${prev.getFullYear()}${String(prev.getMonth() + 1).padStart(2, '0')}`;
    })(),
  ];

  const tmpDir = os.tmpdir();
  const targetCNPJs = new Set(Object.values(FUND_CNPJ_MAP));

  for (const month of months) {
    const zipUrl = `https://dados.cvm.gov.br/dados/FI/DOC/INF_DIARIO/DADOS/inf_diario_fi_${month}.zip`;
    const zipPath = path.join(tmpDir, `cvm_fi_${month}.zip`);

    try {
      console.log(`  Downloading CVM data for ${month}...`);
      await httpDownload(zipUrl, zipPath);

      // Extract using unzip command (simpler than using zlib for zip files)
      const csvPath = path.join(tmpDir, `inf_diario_fi_${month}.csv`);
      const { execSync } = await import('node:child_process');
      execSync(`unzip -o "${zipPath}" -d "${tmpDir}"`, { stdio: 'pipe' });

      // Parse the CSV line by line looking for our CNPJs
      const content = fs.readFileSync(csvPath, 'utf-8');
      const lines = content.split('\n');

      // CSV columns: TP_FUNDO_CLASSE;CNPJ_FUNDO_CLASSE;ID_SUBCLASSE;DT_COMPTC;VL_TOTAL;VL_QUOTA;VL_PATRIM_LIQ;...
      for (const line of lines) {
        const fields = line.split(';');
        const cnpj = fields[1];
        if (!cnpj || !targetCNPJs.has(cnpj)) continue;

        const date = fields[3]; // YYYY-MM-DD
        const cota = Number.parseFloat(fields[5]);
        if (Number.isNaN(cota)) continue;

        // Keep the latest date for each CNPJ
        const existing = result.get(cnpj);
        if (!existing || date > existing.date) {
          result.set(cnpj, { date, cota });
        }
      }

      // Clean up
      fs.unlinkSync(zipPath);
      fs.unlinkSync(csvPath);

      // If we got all CNPJs, no need to try previous month
      if (result.size >= targetCNPJs.size) break;
    } catch (error) {
      console.warn(`  WARN: CVM download failed for ${month} -`, (error as Error).message);
    }
  }

  return result;
}

// ─── USD/BRL Rate ───────────────────────────────────────────────────

async function fetchUsdBrlRate(): Promise<number | null> {
  try {
    const json = await httpGet('https://economia.awesomeapi.com.br/json/last/USD-BRL');
    const data = JSON.parse(json);
    const bid = Number.parseFloat(data.USDBRL?.bid);
    return Number.isNaN(bid) ? null : bid;
  } catch (error) {
    console.warn('  WARN: USD/BRL fetch failed -', (error as Error).message);
    return null;
  }
}

// ─── Fixed Income / Tesouro PU from BTG XLSX ────────────────────────

/**
 * Last known PU (preço unitário) from the BTG consolidated statement.
 * These are mark-to-market values as of the XLSX extraction date (2026-01-31).
 * Updated each time you run the BTG import with a new statement.
 */
const FIXED_INCOME_PU: Record<string, number> = {
  // Tesouro Direto
  'Tesouro Prefixado 2027': 900.72,
  'Tesouro Prefixado 2031': 550.4,
  'Tesouro Prefixado 2032': 481.38,
  'Tesouro IPCA+ 2029': 3644.22,
  'Tesouro IPCA+ 2035': 2415.4,
  'Tesouro IPCA+ 2040': 1718.77,
  'Tesouro Renda+ Aposentadoria Extra 2079': 266.51,
  'Tesouro Renda+ Aposentadoria Extra 2084': 190.94,
  // CDB / LCA / CRI / CRA
  'CDB Banco BTG Pactual IPCA+': 544.3,
  'LCA Banco BTG Pactual': 1008.75,
  'CRI MRV IV': 1139.03,
  "CRI Rede D'Or": 1071.41,
  'CRA BRF': 1103.52,
  'CRA Caramuru Alimentos II': 485.89,
  'CRA Klabin': 1131.52,
  'CRA Minerva': 1112.96,
};

// ─── DB Update Helper ───────────────────────────────────────────────

function updateAssetPrice(assetId: string, price: number) {
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  db.update(assets)
    .set({ current_price: price, updated_at: now })
    .where(eq(assets.id, assetId))
    .run();
}

function updateUsdBrlSetting(rate: number) {
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const existing = db.select().from(settings).where(eq(settings.key, 'usd_brl_rate')).get();
  if (existing) {
    db.update(settings)
      .set({ value: rate.toFixed(4), updated_at: now })
      .where(eq(settings.key, 'usd_brl_rate'))
      .run();
  } else {
    db.insert(settings)
      .values({ key: 'usd_brl_rate', value: rate.toFixed(4), updated_at: now })
      .run();
  }
}

// ─── Main ───────────────────────────────────────────────────────────

async function updatePrices() {
  console.log('=== Price Update ===\n');

  const allAssets = db.select().from(assets).all();
  console.log(`Found ${allAssets.length} assets in database\n`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  // ── 1. USD/BRL Rate ──────────────────────────────────────────────
  console.log('--- USD/BRL Rate (AwesomeAPI) ---');
  const usdBrl = await fetchUsdBrlRate();
  if (usdBrl) {
    updateUsdBrlSetting(usdBrl);
    console.log(`  USD/BRL: ${usdBrl.toFixed(4)}\n`);
  } else {
    console.log('  FAILED: Could not fetch USD/BRL rate\n');
  }

  // ── 2. BR Stocks via Google Finance ──────────────────────────────
  console.log('--- BR Stocks (Google Finance) ---');
  const brStocks = allAssets.filter(
    (a) => a.asset_type === 'STOCK' && a.currency === 'BRL' && a.ticker,
  );

  for (const stock of brStocks) {
    const ticker = stock.ticker ?? '';
    const price = await fetchGoogleFinancePrice(ticker, 'BVMF');
    if (price !== null) {
      updateAssetPrice(stock.id, price);
      console.log(`  ${ticker.padEnd(8)} ${price.toFixed(2).padStart(10)}`);
      updated++;
    } else {
      console.log(`  ${ticker.padEnd(8)} FAILED`);
      failed++;
    }
    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 500));
  }
  console.log();

  // ── 3. US/International ETFs via Google Finance ──────────────────
  console.log('--- ETFs (Google Finance) ---');
  const etfs = allAssets.filter((a) => a.asset_type === 'ETF' && a.ticker);

  for (const etf of etfs) {
    const ticker = etf.ticker ?? '';
    const exchange = US_ETF_EXCHANGES[ticker];
    if (!exchange) {
      console.log(`  ${ticker.padEnd(8)} SKIP (no exchange mapping)`);
      skipped++;
      continue;
    }

    const price = await fetchGoogleFinancePrice(ticker, exchange);
    if (price !== null) {
      updateAssetPrice(etf.id, price);
      console.log(`  ${ticker.padEnd(8)} ${price.toFixed(2).padStart(10)} USD`);
      updated++;
    } else {
      console.log(`  ${ticker.padEnd(8)} FAILED`);
      failed++;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  console.log();

  // ── 4. Funds & Previdência via CVM ───────────────────────────────
  console.log('--- Funds & Previdência (CVM informe diário) ---');
  const cvmCotas = await fetchCVMCotas();

  const fundAssets = allAssets.filter(
    (a) => a.asset_type === 'FUND' || a.asset_type === 'PREVIDENCIA',
  );

  for (const fund of fundAssets) {
    const cnpj = FUND_CNPJ_MAP[fund.name];
    if (!cnpj) {
      console.log(`  ${fund.name.slice(0, 40).padEnd(42)} SKIP (no CNPJ mapping)`);
      skipped++;
      continue;
    }

    const cotaData = cvmCotas.get(cnpj);
    if (cotaData) {
      updateAssetPrice(fund.id, cotaData.cota);
      const label = fund.name.length > 40 ? `${fund.name.slice(0, 37)}...` : fund.name;
      console.log(
        `  ${label.padEnd(42)} ${cotaData.cota.toFixed(6).padStart(14)} (${cotaData.date})`,
      );
      updated++;
    } else {
      const label = fund.name.length > 40 ? `${fund.name.slice(0, 37)}...` : fund.name;
      console.log(`  ${label.padEnd(42)} FAILED (CNPJ: ${cnpj})`);
      failed++;
    }
  }
  console.log();

  // ── 5. Tesouro Direto & Fixed Income (last known PU) ────────────
  console.log('--- Tesouro Direto & Fixed Income (BTG XLSX PU) ---');
  const fixedIncomeTypes = new Set(['TESOURO', 'CDB', 'LCA', 'LCI', 'CRI', 'CRA']);
  const fixedAssets = allAssets.filter((a) => fixedIncomeTypes.has(a.asset_type));

  for (const fi of fixedAssets) {
    const pu = FIXED_INCOME_PU[fi.name];
    if (pu !== undefined) {
      updateAssetPrice(fi.id, pu);
      const label = fi.name.length > 40 ? `${fi.name.slice(0, 37)}...` : fi.name;
      console.log(`  ${label.padEnd(42)} ${pu.toFixed(2).padStart(10)}`);
      updated++;
    } else {
      const label = fi.name.length > 40 ? `${fi.name.slice(0, 37)}...` : fi.name;
      console.log(`  ${label.padEnd(42)} SKIP (no PU mapping)`);
      skipped++;
    }
  }
  console.log();

  // ── Summary ──────────────────────────────────────────────────────
  console.log('=== Summary ===');
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed:  ${failed}`);
  if (usdBrl) {
    console.log(`USD/BRL: ${usdBrl.toFixed(4)}`);
  }
  console.log('\nDone!');
}

updatePrices();
