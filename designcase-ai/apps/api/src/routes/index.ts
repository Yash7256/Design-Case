import { Router } from 'express';
import uploadsRouter from './uploads.js';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Upload routes
router.use('/uploads', uploadsRouter);

// Placeholder endpoints
router.get('/projects', (_req, res) => {
  res.json({ projects: [] });
});

router.post('/projects', (_req, res) => {
  res.status(201).json({ id: 'project-1', name: 'New Project' });
});

export default router;
