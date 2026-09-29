// ============================================================
// MAIN EXPRESS SERVER (STANDALONE)
// Unified Scholarship Portal for Tribal Students - MoTA
// ============================================================

import path from 'path';
import express from 'express';
import app from './app';

const PORT = process.env.PORT || 5001;

// Serve frontend static build if available
const frontendDist = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendDist, 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`🚀 MoTA Unified Scholarship API Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
});
