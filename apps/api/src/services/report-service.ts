import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Report, ReportMeta } from '../types/report.js';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = resolve(__dirname, '..', '..', '..', '..', 'data', 'reports');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parse YAML-ish frontmatter delimited by `---`.
 * We only need `title` so we keep it dead-simple -- no YAML library required.
 */
function parseFrontmatter(raw: string): { title: string; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { title: '', body: raw };
  }

  const frontmatter = match[1];
  const body = match[2];

  let title = '';
  for (const line of frontmatter.split('\n')) {
    const m = line.match(/^title:\s*(.+)$/);
    if (m) {
      title = m[1].replace(/^["']|["']$/g, '').trim();
      break;
    }
  }

  return { title, body };
}

/**
 * Extract date prefix from filename. Expected format: `YYYY-MM-DD-slug.md`
 */
function extractDate(filename: string): string {
  const m = filename.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : '';
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export class ReportNotFoundError extends Error {
  constructor(slug: string) {
    super(`Report not found: ${slug}`);
    this.name = 'ReportNotFoundError';
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * List all reports (metadata only), sorted by date descending (newest first).
 */
export function listReports(): ReportMeta[] {
  let files: string[];
  try {
    files = readdirSync(REPORTS_DIR);
  } catch {
    return [];
  }

  const reports: ReportMeta[] = [];

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const filePath = join(REPORTS_DIR, file);
    const stat = statSync(filePath);
    const raw = readFileSync(filePath, 'utf-8');
    const { title } = parseFrontmatter(raw);
    const slug = file.replace(/\.md$/, '');
    const date = extractDate(file);

    reports.push({
      slug,
      title: title || slug,
      date,
      size: stat.size,
    });
  }

  // Sort by date descending, then by filename descending for same date
  reports.sort((a, b) => b.slug.localeCompare(a.slug));

  return reports;
}

/**
 * Get a single report by slug (filename without .md extension).
 */
export function getReport(slug: string): Report {
  // Prevent path traversal
  const safeName = slug.replace(/[^a-zA-Z0-9_-]/g, '');
  const filePath = join(REPORTS_DIR, `${safeName}.md`);

  let raw: string;
  try {
    raw = readFileSync(filePath, 'utf-8');
  } catch {
    throw new ReportNotFoundError(slug);
  }

  const stat = statSync(filePath);
  const { title, body } = parseFrontmatter(raw);
  const date = extractDate(safeName);

  return {
    slug: safeName,
    title: title || safeName,
    date,
    size: stat.size,
    content: body,
  };
}
