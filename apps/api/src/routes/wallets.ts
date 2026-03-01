import type { FastifyInstance } from 'fastify';
import {
  TransactionNotFoundError,
  TransactionValidationError,
  createTransaction,
  deleteTransaction,
  getPositionsByWallet,
  getTransactionById,
  listTransactionsByWallet,
  updateTransaction,
} from '../services/transaction-service.js';
import {
  WalletConflictError,
  WalletNotFoundError,
  WalletValidationError,
  createWallet,
  deleteWallet,
  getWalletById,
  listWallets,
  updateWallet,
} from '../services/wallet-service.js';
import type { CreateTransactionInput, UpdateTransactionInput } from '../types/transaction.js';
import type { CreateWalletInput, UpdateWalletInput } from '../types/wallet.js';

export async function walletRoutes(app: FastifyInstance) {
  // --- Wallet CRUD ---

  app.post<{ Body: CreateWalletInput }>('/api/wallets', async (request, reply) => {
    try {
      const wallet = await createWallet(request.body);
      return reply.status(201).send(wallet);
    } catch (error) {
      if (error instanceof WalletValidationError) {
        return reply.status(400).send({
          error: 'Validation Error',
          message: error.message,
          fields: error.fields,
        });
      }
      if (error instanceof WalletConflictError) {
        return reply.status(409).send({
          error: 'Conflict',
          message: error.message,
        });
      }
      throw error;
    }
  });

  app.get('/api/wallets', async () => {
    return listWallets();
  });

  app.get<{ Params: { id: string } }>('/api/wallets/:id', async (request, reply) => {
    try {
      return await getWalletById(request.params.id);
    } catch (error) {
      if (error instanceof WalletNotFoundError) {
        return reply.status(404).send({
          error: 'Not Found',
          message: error.message,
        });
      }
      throw error;
    }
  });

  app.put<{ Params: { id: string }; Body: UpdateWalletInput }>(
    '/api/wallets/:id',
    async (request, reply) => {
      try {
        return await updateWallet(request.params.id, request.body);
      } catch (error) {
        if (error instanceof WalletValidationError) {
          return reply.status(400).send({
            error: 'Validation Error',
            message: error.message,
            fields: error.fields,
          });
        }
        if (error instanceof WalletNotFoundError) {
          return reply.status(404).send({
            error: 'Not Found',
            message: error.message,
          });
        }
        if (error instanceof WalletConflictError) {
          return reply.status(409).send({
            error: 'Conflict',
            message: error.message,
          });
        }
        throw error;
      }
    },
  );

  app.delete<{ Params: { id: string } }>('/api/wallets/:id', async (request, reply) => {
    try {
      const deleted = await deleteWallet(request.params.id);
      return reply.status(200).send(deleted);
    } catch (error) {
      if (error instanceof WalletNotFoundError) {
        return reply.status(404).send({
          error: 'Not Found',
          message: error.message,
        });
      }
      throw error;
    }
  });

  // --- Transaction CRUD (nested under wallets) ---

  app.post<{ Params: { walletId: string }; Body: CreateTransactionInput }>(
    '/api/wallets/:walletId/transactions',
    async (request, reply) => {
      try {
        // Verify wallet exists first
        await getWalletById(request.params.walletId);
        const transaction = await createTransaction(request.params.walletId, request.body);
        return reply.status(201).send(transaction);
      } catch (error) {
        if (error instanceof WalletNotFoundError) {
          return reply.status(404).send({
            error: 'Not Found',
            message: error.message,
          });
        }
        if (error instanceof TransactionValidationError) {
          return reply.status(400).send({
            error: 'Validation Error',
            message: error.message,
            fields: error.fields,
          });
        }
        throw error;
      }
    },
  );

  app.get<{ Params: { walletId: string } }>(
    '/api/wallets/:walletId/transactions',
    async (request, reply) => {
      try {
        await getWalletById(request.params.walletId);
        return await listTransactionsByWallet(request.params.walletId);
      } catch (error) {
        if (error instanceof WalletNotFoundError) {
          return reply.status(404).send({
            error: 'Not Found',
            message: error.message,
          });
        }
        throw error;
      }
    },
  );

  app.get<{ Params: { walletId: string; id: string } }>(
    '/api/wallets/:walletId/transactions/:id',
    async (request, reply) => {
      try {
        await getWalletById(request.params.walletId);
        return await getTransactionById(request.params.walletId, request.params.id);
      } catch (error) {
        if (error instanceof WalletNotFoundError) {
          return reply.status(404).send({
            error: 'Not Found',
            message: error.message,
          });
        }
        if (error instanceof TransactionNotFoundError) {
          return reply.status(404).send({
            error: 'Not Found',
            message: error.message,
          });
        }
        throw error;
      }
    },
  );

  app.put<{ Params: { walletId: string; id: string }; Body: UpdateTransactionInput }>(
    '/api/wallets/:walletId/transactions/:id',
    async (request, reply) => {
      try {
        await getWalletById(request.params.walletId);
        return await updateTransaction(request.params.walletId, request.params.id, request.body);
      } catch (error) {
        if (error instanceof WalletNotFoundError) {
          return reply.status(404).send({
            error: 'Not Found',
            message: error.message,
          });
        }
        if (error instanceof TransactionNotFoundError) {
          return reply.status(404).send({
            error: 'Not Found',
            message: error.message,
          });
        }
        if (error instanceof TransactionValidationError) {
          return reply.status(400).send({
            error: 'Validation Error',
            message: error.message,
            fields: error.fields,
          });
        }
        throw error;
      }
    },
  );

  app.delete<{ Params: { walletId: string; id: string } }>(
    '/api/wallets/:walletId/transactions/:id',
    async (request, reply) => {
      try {
        await getWalletById(request.params.walletId);
        const deleted = await deleteTransaction(request.params.walletId, request.params.id);
        return reply.status(200).send(deleted);
      } catch (error) {
        if (error instanceof WalletNotFoundError) {
          return reply.status(404).send({
            error: 'Not Found',
            message: error.message,
          });
        }
        if (error instanceof TransactionNotFoundError) {
          return reply.status(404).send({
            error: 'Not Found',
            message: error.message,
          });
        }
        throw error;
      }
    },
  );

  // --- Positions (consolidated) ---

  app.get<{ Params: { walletId: string } }>(
    '/api/wallets/:walletId/positions',
    async (request, reply) => {
      try {
        await getWalletById(request.params.walletId);
        return await getPositionsByWallet(request.params.walletId);
      } catch (error) {
        if (error instanceof WalletNotFoundError) {
          return reply.status(404).send({
            error: 'Not Found',
            message: error.message,
          });
        }
        throw error;
      }
    },
  );
}
