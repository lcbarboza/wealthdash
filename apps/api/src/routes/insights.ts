import type { FastifyInstance } from 'fastify';
import { getAllocationInsights } from '../services/insights-service.js';

export async function insightRoutes(app: FastifyInstance) {
  app.get('/api/insights/allocation', async (_request, reply) => {
    try {
      const result = await getAllocationInsights();
      return result;
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to compute allocation insights',
      });
    }
  });
}
