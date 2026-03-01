/** Full wallet record as returned by the API */
export interface Wallet {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

/** Input DTO for creating a wallet */
export interface CreateWalletInput {
  name: string;
  description?: string | null;
}

/** Input DTO for updating a wallet */
export interface UpdateWalletInput {
  name?: string;
  description?: string | null;
}
