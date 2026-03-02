import Fastify from 'fastify';
import { runMigrations } from './db/migrate.js';
import { assetRoutes } from './routes/assets.js';
import { healthRoutes } from './routes/health.js';
import { insightRoutes } from './routes/insights.js';
import { portfolioRoutes } from './routes/portfolio.js';
import { settingRoutes } from './routes/settings.js';
import { walletRoutes } from './routes/wallets.js';
import { ensureDefaults } from './services/setting-service.js';

export function buildServer() {
  const app = Fastify({
    logger: true,
  });

  app.log.info('Running database migrations...');
  runMigrations();
  app.log.info('Database migrations complete.');

  app.log.info('Ensuring default settings...');
  ensureDefaults();

  app.register(healthRoutes);
  app.register(assetRoutes);
  app.register(walletRoutes);
  app.register(settingRoutes);
  app.register(portfolioRoutes);
  app.register(insightRoutes);

  return app;
}
