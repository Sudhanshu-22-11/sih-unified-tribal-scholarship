// ============================================================
// STUDENT ROUTES
// ============================================================

import { Router, Request, Response } from 'express';
import { getStudentProfile, studentProfiles } from '../data/mockDatabase';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/student/profile
router.get('/profile', authMiddleware, (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const profile = getStudentProfile(userId);

  if (!profile) {
    res.status(404).json({ error: 'Profile not found', message: 'Student profile not found.' });
    return;
  }

  res.json({ success: true, data: profile });
});

// PUT /api/student/profile
router.put('/profile', authMiddleware, (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const profile = getStudentProfile(userId);

  if (!profile) {
    res.status(404).json({ error: 'Profile not found' });
    return;
  }

  const allowedFields = ['email', 'village', 'familyIncome', 'course', 'institution', 'academicYear'];
  const updates = req.body;

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      (profile as any)[field] = updates[field];
    }
  }

  // Recalculate profile completion
  const fields = Object.values(profile);
  const filled = fields.filter(v => v !== '' && v !== null && v !== undefined && v !== false).length;
  profile.profileCompletion = Math.round((filled / fields.length) * 100);

  studentProfiles[userId] = profile;

  res.json({ success: true, data: profile, message: 'Profile updated successfully.' });
});

export default router;
