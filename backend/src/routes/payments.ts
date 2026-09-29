// ============================================================
// PAYMENT ROUTES
// ============================================================

import { Router, Request, Response } from 'express';
import { getPaymentByApplication, getStudentPayments } from '../data/mockDatabase';
import { DBTAdapter } from '../integrations/adapters';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/payments
router.get('/', authMiddleware, (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const pymts = getStudentPayments(userId);
  res.json({ success: true, data: pymts });
});

// GET /api/payments/:applicationId
router.get('/:applicationId', authMiddleware, (req: Request, res: Response) => {
  const payment = getPaymentByApplication(req.params.applicationId);
  if (!payment) {
    res.json({ success: true, data: null, message: 'No payment information available for this application.' });
    return;
  }
  res.json({ success: true, data: payment });
});

export default router;
