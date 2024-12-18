import express from 'express';
import { downloadController } from '../controllers/download.js';
import { validateInstagramUrl } from '../middleware/validators.js';

const router = express.Router();

router.post('/download', validateInstagramUrl, downloadController);

export { router as downloadRouter };