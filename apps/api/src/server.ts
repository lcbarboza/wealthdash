import Fastify from 'fastify';
import { runMigrations } from './db/migrate.js';
import { healthRoutes } from './routes/health.js';

export function buildServer() {
  const app = Fastify({
    logger: true,
  });

  app.log.info('Running database migrations...');
  runMigrations();
  app.log.info('Database migrations complete.');

  app.register(healthRoutes);

  return app;
}
