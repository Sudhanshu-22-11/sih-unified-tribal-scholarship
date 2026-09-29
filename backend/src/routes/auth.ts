// ============================================================
// AUTHENTICATION ROUTES
// ============================================================

import { Router, Request, Response } from 'express';
import { getStudentByMobile, users, addAuditLog } from '../data/mockDatabase';
import { generateToken } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Store OTPs in memory (demo)
const otpStore: Record<string, { otp: string; expiresAt: number }> = {};

// POST /api/auth/login - Send OTP
router.post('/login', (req: Request, res: Response) => {
  const { mobile } = req.body;

  if (!mobile || !/^\d{10}$/.test(mobile)) {
    res.status(400).json({ error: 'Invalid mobile number', message: 'Please enter a valid 10-digit mobile number.' });
    return;
  }

  // For demo, always use 123456
  otpStore[mobile] = { otp: '123456', expiresAt: Date.now() + 5 * 60 * 1000 };

  res.json({
    success: true,
    message: 'OTP sent successfully. For demo, use OTP: 123456',
    demoOtp: '123456'
  });
});

// POST /api/auth/verify-otp - Verify OTP and login
router.post('/verify-otp', (req: Request, res: Response) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    res.status(400).json({ error: 'Missing fields', message: 'Mobile number and OTP are required.' });
    return;
  }

  // Demo OTP check
  if (otp !== '123456') {
    res.status(401).json({ error: 'Invalid OTP', message: 'The OTP entered is incorrect. Please try again.' });
    return;
  }

  // Find user by mobile
  let user = users.find(u => u.mobile === mobile);
  
  // If user not found, create a demo student user
  if (!user) {
    user = users.find(u => u.mobile === '9876543210'); // Default to Rahul
  }

  if (!user) {
    res.status(404).json({ error: 'User not found', message: 'No account found. Please register first.' });
    return;
  }

  const token = generateToken({
    userId: user.id,
    role: user.role,
    name: user.name
  });

  addAuditLog({
    id: uuidv4(),
    userId: user.id,
    action: 'LOGIN',
    resource: 'auth',
    details: `${user.role} login via OTP`,
    ipAddress: req.ip || '0.0.0.0',
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      mobile: user.mobile
    }
  });
});

export default router;
