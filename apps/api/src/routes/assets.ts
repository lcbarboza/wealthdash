import type { FastifyInstance } from 'fastify';
import {
  AssetConflictError,
  AssetNotFoundError,
  AssetValidationError,
  createAsset,
  deleteAsset,
  getAssetById,
  listAssets,
  updateAsset,
} from '../services/asset-service.js';
import type { AssetFilters, CreateAssetInput, UpdateAssetInput } from '../types/asset.js';

export async function assetRoutes(app: FastifyInstance) {
  app.post<{ Body: CreateAssetInput }>('/api/assets', async (request, reply) => {
    try {
      const asset = await createAsset(request.body);
      return reply.status(201).send(asset);
    } catch (error) {
      if (error instanceof AssetValidationError) {
        return reply.status(400).send({
          error: 'Validation Error',
          message: error.message,
          fields: error.fields,
        });
      }
      if (error instanceof AssetConflictError) {
        return reply.status(409).send({
          error: 'Conflict',
          message: error.message,
        });
      }
      throw error;
    }
  });

  app.get<{ Querystring: AssetFilters }>('/api/assets', async (request) => {
    const filters: AssetFilters = {};
    const query = request.query;

    if (query.asset_type) filters.asset_type = query.asset_type;
    if (query.asset_class) filters.asset_class = query.asset_class;
    if (query.currency) filters.currency = query.currency;

    return listAssets(filters);
  });

  app.get<{ Params: { id: string } }>('/api/assets/:id', async (request, reply) => {
    try {
      return await getAssetById(request.params.id);
    } catch (error) {
      if (error instanceof AssetNotFoundError) {
        return reply.status(404).send({
          error: 'Not Found',
          message: error.message,
        });
      }
      throw error;
    }
  });

  app.put<{ Params: { id: string }; Body: UpdateAssetInput }>(
    '/api/assets/:id',
    async (request, reply) => {
      try {
        return await updateAsset(request.params.id, request.body);
      } catch (error) {
        if (error instanceof AssetValidationError) {
          return reply.status(400).send({
            error: 'Validation Error',
            message: error.message,
            fields: error.fields,
          });
        }
        if (error instanceof AssetNotFoundError) {
          return reply.status(404).send({
            error: 'Not Found',
            message: error.message,
          });
        }
        if (error instanceof AssetConflictError) {
          return reply.status(409).send({
            error: 'Conflict',
            message: error.message,
          });
        }
        throw error;
      }
    },
  );

  app.delete<{ Params: { id: string } }>('/api/assets/:id', async (request, reply) => {
    try {
      const deleted = await deleteAsset(request.params.id);
      return reply.status(200).send(deleted);
    } catch (error) {
      if (error instanceof AssetNotFoundError) {
        return reply.status(404).send({
          error: 'Not Found',
          message: error.message,
        });
      }
      throw error;
    }
  });
}
