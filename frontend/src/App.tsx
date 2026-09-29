// ============================================================
// MAIN APPLICATION ROOT & ROUTER
// Unified Tribal Scholarship Platform | SIH 2026
// ============================================================

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { DemoProvider } from './context/DemoContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoBanner } from './components/DemoBanner';
import { JagoAssistant } from './components/JagoAssistant';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { StudentProfilePage } from './pages/StudentProfile';
import { SchemesListPage } from './pages/SchemesListPage';
import { SchemeDetailPage } from './pages/SchemeDetailPage';
import { EligibilityPage } from './pages/EligibilityPage';
import { DocumentWalletPage } from './pages/DocumentWallet';
import { ApplicationFormPage } from './pages/ApplicationForm';
import { ApplicationsListPage } from './pages/ApplicationsList';
import { ApplicationTrackingPage } from './pages/ApplicationTracking';
import { SmartVerificationPage } from './pages/SmartVerification';
import { PaymentTrackingPage } from './pages/PaymentTracking';
import { GrievancePage } from './pages/GrievancePage';
import { AdminDashboardPage } from './pages/AdminDashboard';
import { BeneficiaryGapPage } from './pages/BeneficiaryGapPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#1E293B]">
      <DemoBanner />
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Student Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><StudentProfilePage /></ProtectedRoute>} />
          <Route path="/schemes" element={<ProtectedRoute><SchemesListPage /></ProtectedRoute>} />
          <Route path="/schemes/:id" element={<ProtectedRoute><SchemeDetailPage /></ProtectedRoute>} />
          <Route path="/eligibility" element={<ProtectedRoute><EligibilityPage /></ProtectedRoute>} />
          <Route path="/eligibility/:schemeId" element={<ProtectedRoute><EligibilityPage /></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute><DocumentWalletPage /></ProtectedRoute>} />
          <Route path="/apply/:schemeId" element={<ProtectedRoute><ApplicationFormPage /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><ApplicationsListPage /></ProtectedRoute>} />
          <Route path="/applications/:id" element={<ProtectedRoute><ApplicationTrackingPage /></ProtectedRoute>} />
          <Route path="/verification" element={<ProtectedRoute><SmartVerificationPage /></ProtectedRoute>} />
          <Route path="/verification/:applicationId" element={<ProtectedRoute><SmartVerificationPage /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute><PaymentTrackingPage /></ProtectedRoute>} />
          <Route path="/payments/:applicationId" element={<ProtectedRoute><PaymentTrackingPage /></ProtectedRoute>} />
          <Route path="/grievance" element={<ProtectedRoute><GrievancePage /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/beneficiary-gap" element={<ProtectedRoute><BeneficiaryGapPage /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      {/* Floating JAGO AI Assistant on all pages */}
      <JagoAssistant />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <DemoProvider>
            <AppContent />
          </DemoProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
