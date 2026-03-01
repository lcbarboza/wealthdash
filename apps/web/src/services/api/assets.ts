import type { ApiError, Asset, CreateAssetInput, UpdateAssetInput } from '../../types/asset';

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

export async function listAssets(): Promise<Asset[]> {
  return apiFetch<Asset[]>('/api/assets');
}

export async function getAsset(id: string): Promise<Asset> {
  return apiFetch<Asset>(`/api/assets/${id}`);
}

export async function createAsset(input: CreateAssetInput): Promise<Asset> {
  return apiFetch<Asset>('/api/assets', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateAsset(id: string, input: UpdateAssetInput): Promise<Asset> {
  return apiFetch<Asset>(`/api/assets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export async function deleteAsset(id: string): Promise<Asset> {
  return apiFetch<Asset>(`/api/assets/${id}`, {
    method: 'DELETE',
  });
}

export { ApiRequestError };
