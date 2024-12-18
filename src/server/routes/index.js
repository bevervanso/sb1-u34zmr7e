import { downloadRouter } from './download.js';

export function setupRoutes(app) {
  app.use('/api', downloadRouter);
}