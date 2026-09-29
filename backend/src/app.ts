// ============================================================
// EXPRESS APP CONFIGURATION
// Unified Scholarship Portal for Tribal Students - MoTA
// ============================================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import studentRoutes from './routes/student';
import schemeRoutes from './routes/schemes';
import applicationRoutes from './routes/applications';
import documentRoutes from './routes/documents';
import verificationRoutes from './routes/verification';
import paymentRoutes from './routes/payments';
import notificationRoutes from './routes/notifications';
import jagoRoutes from './routes/jago';
import adminRoutes from './routes/admin';
import grievanceRoutes from './routes/grievance';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging for audit simulation
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/jago', jagoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/grievance', grievanceRoutes);

// System Health & Integration Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Aakanksha (आकांक्षा) — MoTA Unified Tribal Scholarship Platform API Gateway',
    version: '1.0.0-PROTOTYPE',
    timestamp: new Date().toISOString(),
    connectedAdapters: [
      'NSPAdapter',
      'SFMPAdapter',
      'NFSTAdapter',
      'NOSAdapter',
      'DigiLockerAdapter',
      'UDISEAdapter',
      'APAARAdapter',
      'AISHEAdapter',
      'EDistrictAdapter',
      'DBTAdapter'
    ]
  });
});

export default app;
export { app };
