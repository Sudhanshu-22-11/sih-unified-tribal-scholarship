// ============================================================
// SCHEME ROUTES
// ============================================================

import { Router, Request, Response } from 'express';
import { schemes, getSchemeById, getSchemeStatusForStudent, getStudentProfile, getStudentApplications } from '../data/mockDatabase';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/schemes
router.get('/', authMiddleware, (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const schemeStatuses = getSchemeStatusForStudent(userId);
  
  const schemesWithStatus = schemes.map(s => ({
    ...s,
    studentStatus: schemeStatuses[s.id] || { status: 'not_applied' }
  }));

  res.json({ success: true, data: schemesWithStatus });
});

// GET /api/schemes/:id
router.get('/:id', authMiddleware, (req: Request, res: Response) => {
  const scheme = getSchemeById(req.params.id);
  
  if (!scheme) {
    res.status(404).json({ error: 'Scheme not found' });
    return;
  }

  const userId = req.user!.userId;
  const schemeStatuses = getSchemeStatusForStudent(userId);

  res.json({
    success: true,
    data: {
      ...scheme,
      studentStatus: schemeStatuses[scheme.id] || { status: 'not_applied' }
    }
  });
});

// GET /api/eligibility/:schemeId
router.get('/eligibility/:schemeId', authMiddleware, (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const profile = getStudentProfile(userId);
  const scheme = getSchemeById(req.params.schemeId);

  if (!profile || !scheme) {
    res.status(404).json({ error: 'Profile or scheme not found' });
    return;
  }

  // Eligibility evaluation
  const checks: { criterion: string; passed: boolean; details: string }[] = [];
  let overallEligible = true;
  let needsMoreInfo = false;

  // ST Status check
  checks.push({
    criterion: 'ST Status',
    passed: !!profile.stCategory,
    details: profile.stCategory ? `Verified ST (${profile.stCategory})` : 'ST status not verified'
  });
  if (!profile.stCategory) overallEligible = false;

  // Income check
  const incomePass = profile.familyIncome <= scheme.eligibility.maxIncome;
  checks.push({
    criterion: 'Income Criteria',
    passed: incomePass,
    details: incomePass
      ? `Family income ₹${profile.familyIncome.toLocaleString()} within limit of ₹${scheme.eligibility.maxIncome.toLocaleString()}`
      : `Family income ₹${profile.familyIncome.toLocaleString()} exceeds limit of ₹${scheme.eligibility.maxIncome.toLocaleString()}`
  });
  if (!incomePass) overallEligible = false;

  // Education level check
  const levelPass = scheme.eligibility.educationLevels.includes(profile.courseLevel);
  checks.push({
    criterion: 'Course Criteria',
    passed: levelPass,
    details: levelPass
      ? `${profile.course} is eligible under this scheme`
      : `${profile.course} (${profile.courseLevel}) is not in eligible education levels`
  });
  if (!levelPass) overallEligible = false;

  // Institution check
  checks.push({
    criterion: 'Institution Criteria',
    passed: !!profile.institution,
    details: profile.institution ? `Enrolled at ${profile.institution}` : 'Institution details not provided'
  });
  if (!profile.institution) needsMoreInfo = true;

  // Existing benefit check
  const existingApps = getStudentApplications(userId);
  const activeApp = existingApps.find(a => ['approved', 'sanctioned', 'disbursed'].includes(a.status) && a.schemeId !== scheme.id);
  if (activeApp) {
    checks.push({
      criterion: 'No Conflicting Scholarship',
      passed: false,
      details: `Currently receiving ${activeApp.schemeName}. Only one scholarship at a time is allowed.`
    });
    overallEligible = false;
  } else {
    checks.push({
      criterion: 'No Conflicting Scholarship',
      passed: true,
      details: 'No conflicting active scholarships found'
    });
  }

  let result: string;
  if (!overallEligible) {
    result = 'NOT_ELIGIBLE';
  } else if (needsMoreInfo) {
    result = 'MORE_INFORMATION_REQUIRED';
  } else {
    result = 'POTENTIALLY_ELIGIBLE';
  }

  res.json({
    success: true,
    data: {
      schemeId: scheme.id,
      schemeName: scheme.name,
      result,
      checks,
      disclaimer: 'Preliminary eligibility based on available profile information. Final eligibility is subject to official verification by the competent authority.'
    }
  });
});

export default router;
