/** Input DTO for creating a wallet */
export interface CreateWalletInput {
  name: string;
  description?: string | null;
}

/** Input DTO for updating a wallet (all fields optional) */
export interface UpdateWalletInput {
  name?: string;
  description?: string | null;
}
