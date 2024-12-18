import express from 'express';
import cors from 'cors';
import { setupMiddleware } from './middleware/setup.js';
import { setupRoutes } from './routes/index.js';

const app = express();

// Setup middleware
setupMiddleware(app);

// Setup routes
setupRoutes(app);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app };