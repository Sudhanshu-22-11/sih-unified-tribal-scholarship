// ============================================================
// GRIEVANCE / HELP TICKET ROUTES
// ============================================================

import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getStudentGrievances, addGrievance, grievances } from '../data/mockDatabase';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/grievance
router.get('/', authMiddleware, (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const list = getStudentGrievances(userId);
  res.json({ success: true, data: list });
});

// POST /api/grievance
router.post('/', authMiddleware, (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { category, subject, description } = req.body;

  if (!category || !subject || !description) {
    res.status(400).json({ error: 'All fields are required (category, subject, description).' });
    return;
  }

  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const ticketId = `GRV-2026-${randomNum}`;
  const now = new Date().toISOString();

  const newTicket = {
    id: uuidv4(),
    ticketId,
    userId,
    category,
    subject,
    description,
    status: 'open' as const,
    createdAt: now,
    updatedAt: now
  };

  addGrievance(newTicket);

  res.status(201).json({
    success: true,
    data: newTicket,
    message: `Grievance registered successfully with Ticket ID: ${ticketId}`
  });
});

export default router;
