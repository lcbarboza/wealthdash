import type { FastifyInstance } from 'fastify';
import {
  SettingNotFoundError,
  SettingValidationError,
  listSettings,
  updateSetting,
} from '../services/setting-service.js';
import type { UpdateSettingInput } from '../types/setting.js';

export async function settingRoutes(app: FastifyInstance) {
  app.get('/api/settings', async () => {
    return listSettings();
  });

  app.put<{ Params: { key: string }; Body: UpdateSettingInput }>(
    '/api/settings/:key',
    async (request, reply) => {
      try {
        return await updateSetting(request.params.key, request.body);
      } catch (error) {
        if (error instanceof SettingValidationError) {
          return reply.status(400).send({
            error: 'Validation Error',
            message: error.message,
            fields: error.fields,
          });
        }
        if (error instanceof SettingNotFoundError) {
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
