/** Metadata extracted from a report markdown file's frontmatter + filename */
export interface ReportMeta {
  /** Filename without extension, used as unique identifier */
  slug: string;
  /** Report title (from frontmatter) */
  title: string;
  /** ISO date string YYYY-MM-DD (from filename prefix) */
  date: string;
  /** File size in bytes */
  size: number;
}

/** Full report including markdown body */
export interface Report extends ReportMeta {
  /** Raw markdown content (without frontmatter) */
  content: string;
}
