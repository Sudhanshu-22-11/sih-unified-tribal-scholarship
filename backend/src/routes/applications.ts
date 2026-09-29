// ============================================================
// APPLICATION ROUTES
// ============================================================

import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  getStudentApplications, getApplicationById, addApplication, updateApplication,
  getApplicationTimeline, applicationTimelines, addNotification,
  getSchemeById, studentSchemeStatus, getStudentProfile
} from '../data/mockDatabase';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/applications
router.get('/', authMiddleware, (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const apps = getStudentApplications(userId);
  res.json({ success: true, data: apps });
});

// POST /api/applications
router.post('/', authMiddleware, (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { schemeId, formData } = req.body;

  const scheme = getSchemeById(schemeId);
  if (!scheme) {
    res.status(404).json({ error: 'Scheme not found' });
    return;
  }

  const profile = getStudentProfile(userId);
  if (!profile) {
    res.status(404).json({ error: 'Profile not found' });
    return;
  }

  const appId = `APP-${Date.now().toString(36).toUpperCase()}`;
  const now = new Date().toISOString();

  const newApp = {
    id: appId,
    studentId: userId,
    schemeId,
    schemeName: scheme.name,
    status: 'submitted' as const,
    appliedDate: now,
    lastUpdated: now,
    academicYear: '2026-27',
    formData: formData || {
      personalDetails: { name: profile.name, dob: profile.dateOfBirth, gender: profile.gender, mobile: profile.mobile },
      academicDetails: { institution: profile.institution, course: profile.course },
      incomeDetails: { familyIncome: profile.familyIncome },
      bankDetails: { bankName: profile.bankName, accountMasked: profile.bankAccountMasked, ifsc: profile.ifscCode }
    },
    deficiencies: [],
    currentStep: 8
  };

  addApplication(newApp);

  // Update scheme status
  if (!studentSchemeStatus[userId]) {
    studentSchemeStatus[userId] = {};
  }
  studentSchemeStatus[userId][schemeId] = { status: 'submitted', applicationId: appId };

  // Create timeline
  applicationTimelines[appId] = [
    { id: uuidv4(), applicationId: appId, status: 'submitted', label: 'Application Submitted', description: 'Your application has been successfully submitted.', timestamp: now, completed: true, current: true },
    { id: uuidv4(), applicationId: appId, status: 'document_verification', label: 'Document Verification', description: 'Documents will be verified.', timestamp: '', completed: false, current: false },
    { id: uuidv4(), applicationId: appId, status: 'institution_verified', label: 'Institution Verification', description: 'Pending institution verification.', timestamp: '', completed: false, current: false },
    { id: uuidv4(), applicationId: appId, status: 'state_verified', label: 'State Verification', description: 'Pending state-level verification.', timestamp: '', completed: false, current: false },
    { id: uuidv4(), applicationId: appId, status: 'mota_review', label: 'MoTA Review', description: 'Pending MoTA review.', timestamp: '', completed: false, current: false },
    { id: uuidv4(), applicationId: appId, status: 'sanction', label: 'Sanction', description: 'Pending sanction.', timestamp: '', completed: false, current: false },
    { id: uuidv4(), applicationId: appId, status: 'payment_processing', label: 'Payment Processing', description: 'Pending payment processing.', timestamp: '', completed: false, current: false },
    { id: uuidv4(), applicationId: appId, status: 'dbt_disbursement', label: 'DBT Disbursement', description: 'Pending DBT disbursement.', timestamp: '', completed: false, current: false }
  ];

  // Add notification
  addNotification({
    id: uuidv4(),
    userId,
    title: 'Application Submitted',
    message: `Your ${scheme.shortName} Scholarship application has been successfully submitted. Application ID: ${appId}`,
    type: 'success',
    read: false,
    createdAt: now,
    actionUrl: `/applications/${appId}`
  });

  res.status(201).json({ success: true, data: newApp, message: 'Application submitted successfully.' });
});

// GET /api/applications/:id
router.get('/:id', authMiddleware, (req: Request, res: Response) => {
  const app = getApplicationById(req.params.id);
  if (!app) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }
  res.json({ success: true, data: app });
});

// PUT /api/applications/:id
router.put('/:id', authMiddleware, (req: Request, res: Response) => {
  const updated = updateApplication(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

// GET /api/applications/:id/timeline
router.get('/:id/timeline', authMiddleware, (req: Request, res: Response) => {
  const timeline = getApplicationTimeline(req.params.id);
  res.json({ success: true, data: timeline });
});

export default router;
