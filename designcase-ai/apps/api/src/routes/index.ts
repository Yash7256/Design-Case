import { Router } from 'express';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Placeholder endpoints
router.get('/projects', (_req, res) => {
  res.json({ projects: [] });
});

router.post('/projects', (_req, res) => {
  res.status(201).json({ id: 'project-1', name: 'New Project' });
});

router.post('/upload', (_req, res) => {
  res.status(201).json({ fileId: 'file-1', uploadedAt: new Date() });
});

export default router;
