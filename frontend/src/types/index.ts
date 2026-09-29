// ============================================================
// FRONTEND TYPES & INTERFACES
// ============================================================

export type Role = 'student' | 'institution' | 'admin';

export interface User {
  id: string;
  name: string;
  role: Role;
  mobile: string;
}

export interface StudentProfile {
  userId: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  mobile: string;
  email: string;
  state: string;
  district: string;
  village: string;
  stCategory: string;
  isPVTG: boolean;
  aadhaarVerified: boolean;
  aadhaarMasked: string;
  apaarId: string;
  otrId: string;
  institution: string;
  institutionCode: string;
  course: string;
  courseLevel: string;
  academicYear: string;
  familyIncome: number;
  bankVerified: boolean;
  bankAccountMasked: string;
  bankName: string;
  ifscCode: string;
  profileCompletion: number;
  photoUrl: string;
}

export interface Scheme {
  id: string;
  name: string;
  shortName: string;
  description: string;
  detailedDescription: string;
  sourceSystem: string;
  eligibility: {
    educationLevels: string[];
    maxIncome: number;
    minPercentage?: number;
    courseTypes?: string[];
    additionalCriteria: string[];
  };
  benefits: {
    description: string;
    amounts: { category: string; amount: number }[];
  };
  requiredDocuments: string[];
  importantDates: { label: string; date: string }[];
  icon: string;
  color: string;
  studentStatus?: {
    status: string;
    applicationId?: string;
  };
}

export interface Application {
  id: string;
  studentId: string;
  schemeId: string;
  schemeName: string;
  status: 'draft' | 'submitted' | 'under_verification' | 'institution_verified' | 'state_verified' | 'mota_review' | 'approved' | 'sanctioned' | 'payment_processing' | 'disbursed' | 'rejected' | 'action_required';
  appliedDate: string;
  lastUpdated: string;
  academicYear: string;
  formData: Record<string, any>;
  deficiencies: string[];
  currentStep: number;
}

export interface ApplicationTimelineEvent {
  id: string;
  applicationId: string;
  status: string;
  label: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface Document {
  id: string;
  studentId: string;
  name: string;
  type: string;
  status: 'verified' | 'pending' | 'expired' | 'missing' | 'needs_review';
  source: string;
  uploadedAt: string;
  verifiedAt?: string;
  expiresAt?: string;
  fileUrl?: string;
  issuingAuthority?: string;
}

export interface VerificationEvent {
  id: string;
  applicationId: string;
  category: string;
  source: string;
  status: 'verified' | 'pending' | 'mismatch' | 'failed' | 'unavailable';
  details: string;
  verifiedAt?: string;
  mismatchDetails?: {
    field: string;
    profileValue: string;
    sourceValue: string;
  };
}

export interface Payment {
  id: string;
  applicationId: string;
  studentId: string;
  schemeName: string;
  sanctionAmount: number;
  disbursedAmount: number;
  status: 'sanctioned' | 'payment_processing' | 'dbt_initiated' | 'bank_credit' | 'failed';
  transactionId: string;
  sanctionDate: string;
  paymentDate?: string;
  bankName: string;
  accountMasked: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'action';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface GrievanceTicket {
  id: string;
  ticketId: string;
  userId: string;
  category: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface BeneficiaryCandidate {
  id: string;
  studentName: string;
  state: string;
  district: string;
  educationLevel: string;
  potentialScheme: string;
  currentBenefit: string;
  status: 'identified' | 'outreach_sent' | 'applied' | 'not_interested';
  dataSource: string;
}

export interface EligibilityResult {
  schemeId: string;
  schemeName: string;
  result: 'ELIGIBLE' | 'POTENTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE' | 'MORE_INFORMATION_REQUIRED';
  checks: { criterion: string; passed: boolean; details: string }[];
  disclaimer: string;
}
