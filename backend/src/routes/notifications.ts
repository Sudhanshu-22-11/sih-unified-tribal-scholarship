// ============================================================
// NOTIFICATION ROUTES
// ============================================================

import { Router, Request, Response } from 'express';
import { getStudentNotifications, markNotificationRead, notifications } from '../data/mockDatabase';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/notifications
router.get('/', authMiddleware, (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const notifs = getStudentNotifications(userId);
  res.json({ success: true, data: notifs });
});

// PUT /api/notifications/:id/read
router.put('/:id/read', authMiddleware, (req: Request, res: Response) => {
  markNotificationRead(req.params.id);
  res.json({ success: true, message: 'Notification marked as read.' });
});

// PUT /api/notifications/read-all
router.put('/read-all', authMiddleware, (req: Request, res: Response) => {
  const userId = req.user!.userId;
  notifications.filter(n => n.userId === userId).forEach(n => n.read = true);
  res.json({ success: true, message: 'All notifications marked as read.' });
});

export default router;
