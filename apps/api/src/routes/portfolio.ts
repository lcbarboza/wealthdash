import type { FastifyInstance } from 'fastify';
import { getPortfolioSummary } from '../services/portfolio-service.js';

export async function portfolioRoutes(app: FastifyInstance) {
  app.get('/api/portfolio/summary', async (_request, reply) => {
    try {
      const summary = await getPortfolioSummary();
      return summary;
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to compute portfolio summary',
      });
    }
  });
}
