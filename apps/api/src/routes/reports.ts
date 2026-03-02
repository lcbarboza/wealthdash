import type { FastifyInstance } from 'fastify';
import { ReportNotFoundError, getReport, listReports } from '../services/report-service.js';

export async function reportRoutes(app: FastifyInstance) {
  /** List all reports (metadata only) */
  app.get('/api/reports', async (_request, reply) => {
    try {
      const reports = listReports();
      return reports;
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to list reports',
      });
    }
  });

  /** Get a single report by slug */
  app.get<{ Params: { slug: string } }>('/api/reports/:slug', async (request, reply) => {
    try {
      const report = getReport(request.params.slug);
      return report;
    } catch (error) {
      if (error instanceof ReportNotFoundError) {
        return reply.status(404).send({
          error: 'Not Found',
          message: error.message,
        });
      }
      app.log.error(error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to read report',
      });
    }
  });
}
