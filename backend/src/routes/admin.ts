// ============================================================
// ADMIN & DEMO MANAGEMENT ROUTES
// ============================================================

import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  getAdminAnalytics, beneficiaryCandidates, applications,
  simulateVerification, simulateApproval, simulateSanction, simulatePayment,
  resetDemoData, addAuditLog, auditLogs
} from '../data/mockDatabase';
import { setApiFailure, getApiFailureStatus } from '../integrations/adapters';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/admin/analytics
router.get('/analytics', authMiddleware, roleMiddleware('admin'), (req: Request, res: Response) => {
  const analytics = getAdminAnalytics();
  res.json({ success: true, data: analytics });
});

// GET /api/admin/beneficiary-gap
router.get('/beneficiary-gap', authMiddleware, roleMiddleware('admin'), (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      stats: {
        studentsAnalysed: 24680,
        potentiallyEligible: 3240,
        alreadyReceivingBenefits: 2610,
        potentiallyUnreached: 630
      },
      sources: ['UDISE+', 'APAAR', 'OTR', 'Scholarship Data (NSP/SFMP)'],
      candidates: beneficiaryCandidates
    }
  });
});

// POST /api/admin/outreach
router.post('/outreach', authMiddleware, roleMiddleware('admin'), (req: Request, res: Response) => {
  const { candidateId, channel } = req.body;
  const candidate = beneficiaryCandidates.find(c => c.id === candidateId);
  
  if (!candidate) {
    res.status(404).json({ error: 'Candidate not found' });
    return;
  }

  candidate.status = 'outreach_sent';

  addAuditLog({
    id: uuidv4(),
    userId: req.user!.userId,
    action: 'OUTREACH_SENT',
    resource: `candidate/${candidateId}`,
    details: `Targeted guidance sent to ${candidate.studentName} via ${channel || 'SMS/WhatsApp'}`,
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    message: `Guidance alert sent to ${candidate.studentName} regarding ${candidate.potentialScheme} scholarship.`,
    candidate
  });
});

// GET /api/admin/audit-logs
router.get('/audit-logs', authMiddleware, roleMiddleware('admin'), (req: Request, res: Response) => {
  res.json({ success: true, data: auditLogs });
});

// ---- DEMO SIMULATION CONTROLS ----
// Accessible for jury presentation & live interactive demo

// POST /api/admin/demo/simulate-status
router.post('/demo/simulate-status', (req: Request, res: Response) => {
  const { applicationId, action } = req.body;

  switch (action) {
    case 'verify':
      simulateVerification(applicationId);
      break;
    case 'approve':
      simulateApproval(applicationId);
      break;
    case 'sanction':
      simulateSanction(applicationId);
      break;
    case 'disburse':
      simulatePayment(applicationId);
      break;
    default:
      res.status(400).json({ error: 'Invalid demo simulation action' });
      return;
  }

  res.json({ success: true, message: `Application ${applicationId} status updated to: ${action}` });
});

// POST /api/admin/demo/toggle-api-failure
router.post('/demo/toggle-api-failure', (req: Request, res: Response) => {
  const { system, fail } = req.body;
  if (!system) {
    res.status(400).json({ error: 'System name is required (e.g. UDISE+, DigiLocker, e-District)' });
    return;
  }

  setApiFailure(system, !!fail);
  res.json({
    success: true,
    message: `${system} API failure simulation set to: ${fail}`,
    currentStatus: getApiFailureStatus()
  });
});

// GET /api/admin/demo/api-status
router.get('/demo/api-status', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: getApiFailureStatus()
  });
});

// POST /api/admin/demo/reset
router.post('/demo/reset', (_req: Request, res: Response) => {
  resetDemoData();
  res.json({ success: true, message: 'Demo data reset successfully to initial state.' });
});

export default router;
