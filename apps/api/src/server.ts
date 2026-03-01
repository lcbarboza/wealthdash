import Fastify from 'fastify';
import { runMigrations } from './db/migrate.js';
import { assetRoutes } from './routes/assets.js';
import { healthRoutes } from './routes/health.js';
import { walletRoutes } from './routes/wallets.js';

export function buildServer() {
  const app = Fastify({
    logger: true,
  });

  app.log.info('Running database migrations...');
  runMigrations();
  app.log.info('Database migrations complete.');

  app.register(healthRoutes);
  app.register(assetRoutes);
  app.register(walletRoutes);

  return app;
}
