// ============================================================
// API CLIENT SERVICE
// ============================================================

import {
  StudentProfile, Scheme, Application, ApplicationTimelineEvent,
  Document as UserDocument, VerificationEvent, Payment, NotificationItem,
  GrievanceTicket, EligibilityResult
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem('mota_token');
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

export const api = {
  // Auth
  async login(mobile: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile })
    });
    return res.json();
  },

  async verifyOtp(mobile: string, otp: string) {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, otp })
    });
    return res.json();
  },

  // Student Profile
  async getProfile(): Promise<{ success: boolean; data: StudentProfile }> {
    const res = await fetch(`${API_BASE}/student/profile`, { headers: getAuthHeader() });
    return res.json();
  },

  async updateProfile(updates: Partial<StudentProfile>): Promise<{ success: boolean; data: StudentProfile; message: string }> {
    const res = await fetch(`${API_BASE}/student/profile`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  // Schemes
  async getSchemes(): Promise<{ success: boolean; data: Scheme[] }> {
    const res = await fetch(`${API_BASE}/schemes`, { headers: getAuthHeader() });
    return res.json();
  },

  async getScheme(id: string): Promise<{ success: boolean; data: Scheme }> {
    const res = await fetch(`${API_BASE}/schemes/${id}`, { headers: getAuthHeader() });
    return res.json();
  },

  async checkEligibility(schemeId: string): Promise<{ success: boolean; data: EligibilityResult }> {
    const res = await fetch(`${API_BASE}/schemes/eligibility/${schemeId}`, { headers: getAuthHeader() });
    return res.json();
  },

  // Applications
  async getApplications(): Promise<{ success: boolean; data: Application[] }> {
    const res = await fetch(`${API_BASE}/applications`, { headers: getAuthHeader() });
    return res.json();
  },

  async getApplication(id: string): Promise<{ success: boolean; data: Application }> {
    const res = await fetch(`${API_BASE}/applications/${id}`, { headers: getAuthHeader() });
    return res.json();
  },

  async submitApplication(schemeId: string, formData: any): Promise<{ success: boolean; data: Application; message: string }> {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ schemeId, formData })
    });
    return res.json();
  },

  async getApplicationTimeline(id: string): Promise<{ success: boolean; data: ApplicationTimelineEvent[] }> {
    const res = await fetch(`${API_BASE}/applications/${id}/timeline`, { headers: getAuthHeader() });
    return res.json();
  },

  // Documents
  async getDocuments(): Promise<{ success: boolean; data: UserDocument[] }> {
    const res = await fetch(`${API_BASE}/documents`, { headers: getAuthHeader() });
    return res.json();
  },

  async uploadDocument(name: string, type: string, source?: string): Promise<{ success: boolean; data: UserDocument; message: string }> {
    const res = await fetch(`${API_BASE}/documents`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ name, type, source })
    });
    return res.json();
  },

  async fetchDigiLockerDocs(): Promise<{ success: boolean; data?: any; error?: string; source: string; isSimulated: boolean }> {
    const res = await fetch(`${API_BASE}/documents/digilocker/fetch`, {
      method: 'POST',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Verification
  async getVerification(applicationId: string): Promise<{ success: boolean; data: VerificationEvent[] }> {
    const res = await fetch(`${API_BASE}/verification/${applicationId}`, { headers: getAuthHeader() });
    return res.json();
  },

  // Payments
  async getPayments(): Promise<{ success: boolean; data: Payment[] }> {
    const res = await fetch(`${API_BASE}/payments`, { headers: getAuthHeader() });
    return res.json();
  },

  async getPayment(applicationId: string): Promise<{ success: boolean; data: Payment | null }> {
    const res = await fetch(`${API_BASE}/payments/${applicationId}`, { headers: getAuthHeader() });
    return res.json();
  },

  // Notifications
  async getNotifications(): Promise<{ success: boolean; data: NotificationItem[] }> {
    const res = await fetch(`${API_BASE}/notifications`, { headers: getAuthHeader() });
    return res.json();
  },

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeader()
    });
    return res.json();
  },

  async markAllNotificationsRead(): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PUT',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // JAGO AI Assistant
  async askJago(message: string): Promise<{ success: boolean; data: { response: string; intent: string; toolsUsed: string[]; disclaimer: string; timestamp: string } }> {
    const res = await fetch(`${API_BASE}/jago/chat`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ message })
    });
    return res.json();
  },

  // Grievance / Help
  async getGrievances(): Promise<{ success: boolean; data: GrievanceTicket[] }> {
    const res = await fetch(`${API_BASE}/grievance`, { headers: getAuthHeader() });
    return res.json();
  },

  async submitGrievance(category: string, subject: string, description: string): Promise<{ success: boolean; data: GrievanceTicket; message: string }> {
    const res = await fetch(`${API_BASE}/grievance`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ category, subject, description })
    });
    return res.json();
  },

  // Admin & Demo Controls
  async getAdminAnalytics(): Promise<{ success: boolean; data: any }> {
    const res = await fetch(`${API_BASE}/admin/analytics`, { headers: getAuthHeader() });
    return res.json();
  },

  async getBeneficiaryGap(): Promise<{ success: boolean; data: any }> {
    const res = await fetch(`${API_BASE}/admin/beneficiary-gap`, { headers: getAuthHeader() });
    return res.json();
  },

  async sendOutreach(candidateId: string, channel?: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/admin/outreach`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ candidateId, channel })
    });
    return res.json();
  },

  // Demo Actions
  async simulateStatus(applicationId: string, action: 'verify' | 'approve' | 'sanction' | 'disburse') {
    const res = await fetch(`${API_BASE}/admin/demo/simulate-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId, action })
    });
    return res.json();
  },

  async toggleApiFailure(system: string, fail: boolean) {
    const res = await fetch(`${API_BASE}/admin/demo/toggle-api-failure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system, fail })
    });
    return res.json();
  },

  async getApiStatus() {
    const res = await fetch(`${API_BASE}/admin/demo/api-status`);
    return res.json();
  },

  async resetDemoData() {
    const res = await fetch(`${API_BASE}/admin/demo/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
  }
};
