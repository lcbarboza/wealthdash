/** Metadata for a report (returned by list endpoint) */
export interface ReportMeta {
  slug: string;
  title: string;
  date: string;
  size: number;
}

/** Full report including markdown body */
export interface Report extends ReportMeta {
  content: string;
}
