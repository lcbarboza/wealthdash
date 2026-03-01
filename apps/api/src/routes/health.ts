import type { FastifyInstance } from 'fastify';
import { sqlite } from '../db/index.js';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async () => {
    let database: 'ok' | 'error' = 'error';
    try {
      sqlite.prepare('SELECT 1').get();
      database = 'ok';
    } catch {
      // database remains 'error'
    }

    const status = database === 'ok' ? 'ok' : 'degraded';

    return {
      status,
      uptime: Math.floor(process.uptime()),
      database,
    };
  });
}
