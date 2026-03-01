import type { ApiError } from '../../types/asset';
import type {
  CreateTransactionInput,
  Position,
  Transaction,
  UpdateTransactionInput,
} from '../../types/transaction';

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

export async function listTransactions(walletId: string): Promise<Transaction[]> {
  return apiFetch<Transaction[]>(`/api/wallets/${walletId}/transactions`);
}

export async function getTransaction(walletId: string, id: string): Promise<Transaction> {
  return apiFetch<Transaction>(`/api/wallets/${walletId}/transactions/${id}`);
}

export async function createTransaction(
  walletId: string,
  input: CreateTransactionInput,
): Promise<Transaction> {
  return apiFetch<Transaction>(`/api/wallets/${walletId}/transactions`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateTransaction(
  walletId: string,
  id: string,
  input: UpdateTransactionInput,
): Promise<Transaction> {
  return apiFetch<Transaction>(`/api/wallets/${walletId}/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export async function deleteTransaction(walletId: string, id: string): Promise<Transaction> {
  return apiFetch<Transaction>(`/api/wallets/${walletId}/transactions/${id}`, {
    method: 'DELETE',
  });
}

export async function getPositions(walletId: string): Promise<Position[]> {
  return apiFetch<Position[]>(`/api/wallets/${walletId}/positions`);
}

export { ApiRequestError };
