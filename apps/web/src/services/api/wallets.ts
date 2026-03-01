import type { ApiError } from '../../types/asset';
import type { CreateWalletInput, UpdateWalletInput, Wallet } from '../../types/wallet';

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

export async function listWallets(): Promise<Wallet[]> {
  return apiFetch<Wallet[]>('/api/wallets');
}

export async function getWallet(id: string): Promise<Wallet> {
  return apiFetch<Wallet>(`/api/wallets/${id}`);
}

export async function createWallet(input: CreateWalletInput): Promise<Wallet> {
  return apiFetch<Wallet>('/api/wallets', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateWallet(id: string, input: UpdateWalletInput): Promise<Wallet> {
  return apiFetch<Wallet>(`/api/wallets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export async function deleteWallet(id: string): Promise<Wallet> {
  return apiFetch<Wallet>(`/api/wallets/${id}`, {
    method: 'DELETE',
  });
}

export { ApiRequestError };
