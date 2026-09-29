// ============================================================
// VERIFICATION ROUTES
// ============================================================

import { Router, Request, Response } from 'express';
import { getVerificationByApplication } from '../data/mockDatabase';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/verification/:applicationId
router.get('/:applicationId', authMiddleware, (req: Request, res: Response) => {
  const events = getVerificationByApplication(req.params.applicationId);
  res.json({ success: true, data: events });
});

export default router;
