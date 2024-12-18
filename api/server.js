import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { setupRoutes } from './routes/index.js';
import rateLimit from 'express-rate-limit';
import { RATE_LIMIT } from './utils/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit(RATE_LIMIT);
app.use('/api', limiter);

// Setup API routes
setupRoutes(app);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  
  // Handle client-side routing
  app.get('*', (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app };