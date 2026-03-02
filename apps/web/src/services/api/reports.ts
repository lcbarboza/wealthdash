import type { ApiError } from '../../types/asset';
import type { Report, ReportMeta } from '../../types/report';

class ApiRequestError extends Error {
  status: number;
  body: ApiError;

  constructor(status: number, body: ApiError) {
    super(body.message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.body = body;
  }
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { ...(options?.headers as Record<string, string>) };
  if (options?.body) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(path, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const body = (await response.json()) as ApiError;
    throw new ApiRequestError(response.status, body);
  }

  return response.json() as Promise<T>;
}

export async function listReports(): Promise<ReportMeta[]> {
  return apiFetch<ReportMeta[]>('/api/reports');
}

export async function getReport(slug: string): Promise<Report> {
  return apiFetch<Report>(`/api/reports/${encodeURIComponent(slug)}`);
}

export { ApiRequestError };
