// ============================================================
// DOCUMENT ROUTES
// ============================================================

import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getStudentDocuments, addDocument, documents } from '../data/mockDatabase';
import { DigiLockerAdapter } from '../integrations/adapters';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/documents
router.get('/', authMiddleware, (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const docs = getStudentDocuments(userId);
  res.json({ success: true, data: docs });
});

// POST /api/documents
router.post('/', authMiddleware, (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { name, type, source } = req.body;

  const doc = {
    id: uuidv4(),
    studentId: userId,
    name,
    type,
    status: 'pending' as const,
    source: source || 'Manual Upload',
    uploadedAt: new Date().toISOString(),
    issuingAuthority: ''
  };

  addDocument(doc);
  res.status(201).json({ success: true, data: doc, message: 'Document uploaded successfully.' });
});

// GET /api/documents/:id
router.get('/:id', authMiddleware, (req: Request, res: Response) => {
  const doc = documents.find(d => d.id === req.params.id);
  if (!doc) {
    res.status(404).json({ error: 'Document not found' });
    return;
  }
  res.json({ success: true, data: doc });
});

// POST /api/documents/digilocker/fetch
router.post('/digilocker/fetch', authMiddleware, (req: Request, res: Response) => {
  (async () => {
    try {
      const result = await DigiLockerAdapter.fetchDocuments('XXXX');
      
      if (!result.success) {
        res.status(503).json({
          success: false,
          error: result.error,
          source: 'DigiLocker',
          isSimulated: true
        });
        return;
      }

      res.json({
        success: true,
        data: result.data,
        source: 'DigiLocker',
        isSimulated: true,
        message: 'Documents fetched from DigiLocker (Demo Integration)'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch from DigiLocker' });
    }
  })();
});

export default router;
