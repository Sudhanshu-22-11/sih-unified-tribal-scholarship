// ============================================================
// MOCK DATABASE - In-Memory Data Store
// ============================================================
// This module provides a complete in-memory data store that
// simulates a PostgreSQL database. In production, replace with
// actual database queries using an ORM like Prisma or TypeORM.
// ============================================================

import { v4 as uuidv4 } from 'uuid';

// ---- TYPE DEFINITIONS ----

export interface User {
  id: string;
  mobile: string;
  role: 'student' | 'institution' | 'admin';
  name: string;
  createdAt: string;
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
  applicationUrl?: string;
  icon: string;
  color: string;
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

export interface Notification {
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

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

// ---- MOCK DATA ----

export const users: User[] = [
  { id: 'STU001', mobile: '9876543210', role: 'student', name: 'Rahul Kumar', createdAt: '2026-08-15T10:00:00Z' },
  { id: 'STU002', mobile: '9876543211', role: 'student', name: 'Priya Munda', createdAt: '2026-08-16T10:00:00Z' },
  { id: 'STU003', mobile: '9876543212', role: 'student', name: 'Amit Oraon', createdAt: '2026-08-17T10:00:00Z' },
  { id: 'STU004', mobile: '9876543213', role: 'student', name: 'Sunita Bhil', createdAt: '2026-08-18T10:00:00Z' },
  { id: 'STU005', mobile: '9876543214', role: 'student', name: 'Vikash Gond', createdAt: '2026-08-19T10:00:00Z' },
  { id: 'INST001', mobile: '9876543220', role: 'institution', name: 'Dr. Sharma (GEC)', createdAt: '2026-07-01T10:00:00Z' },
  { id: 'ADM001', mobile: '9876543230', role: 'admin', name: 'MoTA Admin', createdAt: '2026-06-01T10:00:00Z' },
];

export const studentProfiles: Record<string, StudentProfile> = {
  'STU001': {
    userId: 'STU001',
    name: 'Rahul Kumar',
    dateOfBirth: '2004-03-15',
    gender: 'Male',
    mobile: '9876543210',
    email: 'rahul.kumar@email.com',
    state: 'Jharkhand',
    district: 'West Singhbhum',
    village: 'Chaibasa',
    stCategory: 'Ho',
    isPVTG: false,
    aadhaarVerified: true,
    aadhaarMasked: 'XXXX XXXX 4821',
    apaarId: 'AP-XXXX-4582',
    otrId: 'OTR-2026-78421',
    institution: 'Government Engineering College, Chaibasa',
    institutionCode: 'GEC-JSR-042',
    course: 'B.Tech Computer Science',
    courseLevel: 'undergraduate',
    academicYear: '2026-27',
    familyIncome: 180000,
    bankVerified: true,
    bankAccountMasked: 'XXXX XXXX 7842',
    bankName: 'State Bank of India',
    ifscCode: 'SBIN0001234',
    profileCompletion: 92,
    photoUrl: '',
  },
  'STU002': {
    userId: 'STU002',
    name: 'Priya Munda',
    dateOfBirth: '2005-07-22',
    gender: 'Female',
    mobile: '9876543211',
    email: 'priya.munda@email.com',
    state: 'Odisha',
    district: 'Sundargarh',
    village: 'Rourkela',
    stCategory: 'Munda',
    isPVTG: false,
    aadhaarVerified: true,
    aadhaarMasked: 'XXXX XXXX 5612',
    apaarId: 'AP-XXXX-5612',
    otrId: 'OTR-2026-85612',
    institution: 'NIT Rourkela',
    institutionCode: 'NIT-RKL-001',
    course: 'B.Tech Electrical Engineering',
    courseLevel: 'undergraduate',
    academicYear: '2026-27',
    familyIncome: 220000,
    bankVerified: true,
    bankAccountMasked: 'XXXX XXXX 3421',
    bankName: 'Punjab National Bank',
    ifscCode: 'PUNB0004567',
    profileCompletion: 88,
    photoUrl: '',
  },
  'STU003': {
    userId: 'STU003',
    name: 'Amit Oraon',
    dateOfBirth: '2003-11-08',
    gender: 'Male',
    mobile: '9876543212',
    email: 'amit.oraon@email.com',
    state: 'Jharkhand',
    district: 'Ranchi',
    village: 'Kanke',
    stCategory: 'Oraon',
    isPVTG: false,
    aadhaarVerified: true,
    aadhaarMasked: 'XXXX XXXX 9034',
    apaarId: 'AP-XXXX-9034',
    otrId: 'OTR-2026-69034',
    institution: 'IIT Dhanbad',
    institutionCode: 'IIT-DHN-001',
    course: 'M.Tech Mining Engineering',
    courseLevel: 'postgraduate',
    academicYear: '2026-27',
    familyIncome: 350000,
    bankVerified: true,
    bankAccountMasked: 'XXXX XXXX 1256',
    bankName: 'Bank of India',
    ifscCode: 'BKID0001234',
    profileCompletion: 95,
    photoUrl: '',
  },
  'STU004': {
    userId: 'STU004',
    name: 'Sunita Bhil',
    dateOfBirth: '2006-01-30',
    gender: 'Female',
    mobile: '9876543213',
    email: 'sunita.bhil@email.com',
    state: 'Rajasthan',
    district: 'Banswara',
    village: 'Kushalgarh',
    stCategory: 'Bhil',
    isPVTG: false,
    aadhaarVerified: false,
    aadhaarMasked: 'XXXX XXXX 7890',
    apaarId: 'AP-XXXX-7890',
    otrId: 'OTR-2026-47890',
    institution: 'Government Girls School, Banswara',
    institutionCode: 'GGS-BNS-012',
    course: 'Class 10',
    courseLevel: 'pre-matric',
    academicYear: '2026-27',
    familyIncome: 120000,
    bankVerified: false,
    bankAccountMasked: '',
    bankName: '',
    ifscCode: '',
    profileCompletion: 65,
    photoUrl: '',
  },
  'STU005': {
    userId: 'STU005',
    name: 'Vikash Gond',
    dateOfBirth: '2000-05-12',
    gender: 'Male',
    mobile: '9876543214',
    email: 'vikash.gond@email.com',
    state: 'Madhya Pradesh',
    district: 'Mandla',
    village: 'Niwas',
    stCategory: 'Gond',
    isPVTG: false,
    aadhaarVerified: true,
    aadhaarMasked: 'XXXX XXXX 2345',
    apaarId: 'AP-XXXX-2345',
    otrId: 'OTR-2026-52345',
    institution: 'University of Delhi',
    institutionCode: 'DU-001',
    course: 'PhD Anthropology',
    courseLevel: 'doctoral',
    academicYear: '2026-27',
    familyIncome: 280000,
    bankVerified: true,
    bankAccountMasked: 'XXXX XXXX 6789',
    bankName: 'Central Bank of India',
    ifscCode: 'CBIN0001234',
    profileCompletion: 90,
    photoUrl: '',
  }
};

export const schemes: Scheme[] = [
  {
    id: 'SCH001',
    name: 'Pre-Matric Scholarship for ST Students',
    shortName: 'Pre-Matric',
    description: 'Financial assistance for ST students studying in Classes 9 and 10.',
    detailedDescription: 'The Pre-Matric Scholarship Scheme provides financial assistance to Scheduled Tribe students studying in Classes 9 and 10 to reduce dropout rates and promote education among tribal communities. The scholarship covers maintenance allowance, books, and ad-hoc grants.',
    sourceSystem: 'NSP',
    eligibility: {
      educationLevels: ['pre-matric'],
      maxIncome: 250000,
      minPercentage: 50,
      courseTypes: ['Class 9', 'Class 10'],
      additionalCriteria: [
        'Must belong to Scheduled Tribe category',
        'Must be studying in a Government or recognized school',
        'Family annual income should not exceed ₹2,50,000',
        'Must have secured at least 50% marks in previous examination'
      ]
    },
    benefits: {
      description: 'Day scholars and hostellers receive different amounts',
      amounts: [
        { category: 'Day Scholar - Class 9-10', amount: 3500 },
        { category: 'Hosteller - Class 9-10', amount: 7000 },
        { category: 'Books & Ad-hoc Grant', amount: 1000 }
      ]
    },
    requiredDocuments: ['ST Certificate', 'Income Certificate', 'Previous Marksheet', 'School Bonafide Certificate', 'Aadhaar Card', 'Bank Account Details'],
    importantDates: [
      { label: 'Application Start', date: '2026-07-01' },
      { label: 'Application Deadline', date: '2026-10-31' },
      { label: 'Verification Deadline', date: '2026-11-30' },
      { label: 'Disbursement Start', date: '2027-01-15' }
    ],
    icon: 'BookOpen',
    color: '#064E3B'
  },
  {
    id: 'SCH002',
    name: 'Post-Matric Scholarship for ST Students',
    shortName: 'Post-Matric',
    description: 'Financial assistance for ST students pursuing post-matric education up to PhD level.',
    detailedDescription: 'The Post-Matric Scholarship Scheme provides financial support to ST students for pursuing higher education from Class 11 onwards up to PhD level. It covers tuition fees, maintenance allowance, and other educational expenses to ensure tribal students can access quality education.',
    sourceSystem: 'NSP',
    eligibility: {
      educationLevels: ['post-matric', 'undergraduate', 'postgraduate', 'doctoral'],
      maxIncome: 250000,
      minPercentage: 40,
      courseTypes: ['Class 11', 'Class 12', 'ITI', 'Diploma', 'Graduation', 'Post-Graduation', 'Professional Courses'],
      additionalCriteria: [
        'Must belong to Scheduled Tribe category',
        'Must be enrolled in a recognized institution',
        'Family annual income should not exceed ₹2,50,000',
        'Must have passed the previous qualifying examination',
        'Not receiving any other scholarship for the same purpose'
      ]
    },
    benefits: {
      description: 'Amounts vary by course group and scholar type',
      amounts: [
        { category: 'Group I (Professional) - Maintenance', amount: 12000 },
        { category: 'Group II (Non-Professional) - Maintenance', amount: 8200 },
        { category: 'Group III (Certificate) - Maintenance', amount: 5700 },
        { category: 'Tuition Fee', amount: 18000 }
      ]
    },
    requiredDocuments: ['ST Certificate', 'Income Certificate', 'Previous Marksheet', 'Institution Bonafide Certificate', 'Aadhaar Card', 'Bank Account Details', 'Fee Receipt'],
    importantDates: [
      { label: 'Application Start', date: '2026-08-01' },
      { label: 'Application Deadline', date: '2026-11-30' },
      { label: 'Verification Deadline', date: '2026-12-31' },
      { label: 'Disbursement Start', date: '2027-02-01' }
    ],
    icon: 'GraduationCap',
    color: '#064E3B'
  },
  {
    id: 'SCH003',
    name: 'Top Class Education for ST Students',
    shortName: 'Top Class',
    description: 'Full support for ST students in top-tier institutions like IITs, IIMs, NITs, AIIMS.',
    detailedDescription: 'The Top Class Education Scheme provides comprehensive financial support to meritorious ST students admitted to notified top-tier institutions including IITs, NITs, IIMs, AIIMS, NLUs, and other premier institutions. The scheme covers full tuition fees, living expenses, books, and a computer allowance.',
    sourceSystem: 'SFMP',
    eligibility: {
      educationLevels: ['undergraduate', 'postgraduate', 'doctoral'],
      maxIncome: 600000,
      courseTypes: ['B.Tech', 'M.Tech', 'MBA', 'MBBS', 'LLB', 'PhD'],
      additionalCriteria: [
        'Must belong to Scheduled Tribe category',
        'Must be admitted to a notified top-class institution',
        'Family annual income should not exceed ₹6,00,000',
        'Only 2 children per family can avail the scheme',
        'Must maintain satisfactory academic progress'
      ]
    },
    benefits: {
      description: 'Comprehensive support including fees, maintenance, and allowances',
      amounts: [
        { category: 'Full Tuition Fee', amount: 200000 },
        { category: 'Living Expenses', amount: 48000 },
        { category: 'Books & Stationery', amount: 5000 },
        { category: 'Computer/Laptop (one-time)', amount: 45000 }
      ]
    },
    requiredDocuments: ['ST Certificate', 'Income Certificate', 'Admission Letter', 'Institution Bonafide Certificate', 'Aadhaar Card', 'Bank Account Details', 'Fee Structure', 'Previous Academic Records'],
    importantDates: [
      { label: 'Application Start', date: '2026-09-01' },
      { label: 'Application Deadline', date: '2026-12-15' },
      { label: 'Verification Deadline', date: '2027-01-31' },
      { label: 'Disbursement Start', date: '2027-03-01' }
    ],
    icon: 'Award',
    color: '#B45309'
  },
  {
    id: 'SCH004',
    name: 'National Fellowship for ST Students (NFST)',
    shortName: 'NFST',
    description: 'Fellowship for ST students pursuing M.Phil and PhD in recognized universities.',
    detailedDescription: 'The National Fellowship for Scheduled Tribe Students (NFST) provides financial assistance in the form of fellowship to ST students for pursuing M.Phil and PhD degrees in sciences, humanities, social sciences, and engineering. This is aligned with UGC fellowship norms and covers JRF and SRF stipends.',
    sourceSystem: 'NFST',
    eligibility: {
      educationLevels: ['doctoral'],
      maxIncome: 600000,
      courseTypes: ['M.Phil', 'PhD'],
      additionalCriteria: [
        'Must belong to Scheduled Tribe category',
        'Must be registered for M.Phil or PhD in a UGC-recognized university',
        'Selected through a merit-based process',
        'Must have qualified NET/SET or equivalent examination',
        'Age limit as per UGC norms'
      ]
    },
    benefits: {
      description: 'Fellowship as per UGC norms',
      amounts: [
        { category: 'JRF (first 2 years)', amount: 370000 },
        { category: 'SRF (remaining years)', amount: 420000 },
        { category: 'HRA', amount: 36000 },
        { category: 'Contingency (Humanities)', amount: 10000 },
        { category: 'Contingency (Sciences)', amount: 12000 }
      ]
    },
    requiredDocuments: ['ST Certificate', 'PhD Registration Certificate', 'NET/SET Qualification', 'University Bonafide', 'Aadhaar Card', 'Bank Account Details', 'Research Proposal'],
    importantDates: [
      { label: 'Application Window', date: '2026-07-15' },
      { label: 'Application Deadline', date: '2026-09-30' },
      { label: 'Selection Process', date: '2026-11-15' },
      { label: 'Fellowship Start', date: '2027-01-01' }
    ],
    icon: 'Microscope',
    color: '#7C3AED'
  },
  {
    id: 'SCH005',
    name: 'National Overseas Scholarship for ST Students (NOS)',
    shortName: 'NOS',
    description: 'Financial support for ST students pursuing Masters and PhD abroad.',
    detailedDescription: 'The National Overseas Scholarship scheme provides financial assistance to selected ST students for pursuing Masters and PhD level courses abroad in accredited institutions. The scheme covers tuition fees, maintenance allowance, visa fees, and other expenses related to studying abroad.',
    sourceSystem: 'NOS',
    eligibility: {
      educationLevels: ['postgraduate', 'doctoral'],
      maxIncome: 600000,
      courseTypes: ['Masters Abroad', 'PhD Abroad'],
      additionalCriteria: [
        'Must belong to Scheduled Tribe category',
        'Must have secured admission in a top-500 ranked foreign university',
        'Family annual income should not exceed ₹6,00,000',
        'Age should not exceed 35 years',
        'Must have completed graduation with minimum 55% marks',
        'Only one child per family can avail the scheme'
      ]
    },
    benefits: {
      description: 'Comprehensive overseas education support',
      amounts: [
        { category: 'Tuition Fee (per year)', amount: 1537000 },
        { category: 'Maintenance Allowance (per year)', amount: 940000 },
        { category: 'Visa Fee', amount: 25000 },
        { category: 'Air Passage', amount: 150000 },
        { category: 'Contingency (per year)', amount: 75000 }
      ]
    },
    requiredDocuments: ['ST Certificate', 'Income Certificate', 'Admission Letter from Foreign University', 'Passport', 'Visa', 'Aadhaar Card', 'Bank Account Details', 'Academic Records', 'English Proficiency Score'],
    importantDates: [
      { label: 'Application Start', date: '2026-06-01' },
      { label: 'Application Deadline', date: '2026-08-31' },
      { label: 'Interview/Selection', date: '2026-10-15' },
      { label: 'Award Notification', date: '2026-11-30' }
    ],
    icon: 'Globe',
    color: '#0369A1'
  }
];

// Student-scheme status mapping
export const studentSchemeStatus: Record<string, Record<string, { status: string; applicationId?: string }>> = {
  'STU001': {
    'SCH001': { status: 'not_applicable' },
    'SCH002': { status: 'under_verification', applicationId: 'APP001' },
    'SCH003': { status: 'potentially_eligible' },
    'SCH004': { status: 'not_applicable' },
    'SCH005': { status: 'not_applied' }
  },
  'STU002': {
    'SCH001': { status: 'not_applicable' },
    'SCH002': { status: 'active', applicationId: 'APP002' },
    'SCH003': { status: 'eligible' },
    'SCH004': { status: 'not_applicable' },
    'SCH005': { status: 'not_applied' }
  },
  'STU003': {
    'SCH001': { status: 'not_applicable' },
    'SCH002': { status: 'not_applicable' },
    'SCH003': { status: 'active', applicationId: 'APP003' },
    'SCH004': { status: 'potentially_eligible' },
    'SCH005': { status: 'not_applied' }
  },
  'STU004': {
    'SCH001': { status: 'eligible' },
    'SCH002': { status: 'not_applicable' },
    'SCH003': { status: 'not_applicable' },
    'SCH004': { status: 'not_applicable' },
    'SCH005': { status: 'not_applicable' }
  },
  'STU005': {
    'SCH001': { status: 'not_applicable' },
    'SCH002': { status: 'not_applicable' },
    'SCH003': { status: 'not_applicable' },
    'SCH004': { status: 'under_verification', applicationId: 'APP005' },
    'SCH005': { status: 'potentially_eligible' }
  }
};

export let applications: Application[] = [
  {
    id: 'APP001',
    studentId: 'STU001',
    schemeId: 'SCH002',
    schemeName: 'Post-Matric Scholarship',
    status: 'mota_review',
    appliedDate: '2026-09-01T10:30:00Z',
    lastUpdated: '2026-09-27T10:30:00Z',
    academicYear: '2026-27',
    formData: {
      personalDetails: { name: 'Rahul Kumar', dob: '2004-03-15', gender: 'Male', mobile: '9876543210' },
      academicDetails: { institution: 'Government Engineering College, Chaibasa', course: 'B.Tech Computer Science', year: '2nd Year' },
      incomeDetails: { familyIncome: 180000, certificateNo: 'INC-JH-2026-45821' },
      bankDetails: { bankName: 'State Bank of India', accountMasked: 'XXXX XXXX 7842', ifsc: 'SBIN0001234' }
    },
    deficiencies: [],
    currentStep: 8
  },
  {
    id: 'APP002',
    studentId: 'STU002',
    schemeId: 'SCH002',
    schemeName: 'Post-Matric Scholarship',
    status: 'disbursed',
    appliedDate: '2026-07-15T09:00:00Z',
    lastUpdated: '2026-09-20T14:00:00Z',
    academicYear: '2026-27',
    formData: {},
    deficiencies: [],
    currentStep: 8
  },
  {
    id: 'APP003',
    studentId: 'STU003',
    schemeId: 'SCH003',
    schemeName: 'Top Class Education',
    status: 'sanctioned',
    appliedDate: '2026-09-05T11:00:00Z',
    lastUpdated: '2026-09-25T16:00:00Z',
    academicYear: '2026-27',
    formData: {},
    deficiencies: [],
    currentStep: 8
  },
  {
    id: 'APP005',
    studentId: 'STU005',
    schemeId: 'SCH004',
    schemeName: 'National Fellowship (NFST)',
    status: 'under_verification',
    appliedDate: '2026-09-10T08:00:00Z',
    lastUpdated: '2026-09-26T12:00:00Z',
    academicYear: '2026-27',
    formData: {},
    deficiencies: ['Research proposal needs revision'],
    currentStep: 5
  }
];

export const applicationTimelines: Record<string, ApplicationTimelineEvent[]> = {
  'APP001': [
    { id: 'TL001', applicationId: 'APP001', status: 'submitted', label: 'Application Submitted', description: 'Your application has been successfully submitted.', timestamp: '2026-09-01T10:30:00Z', completed: true, current: false },
    { id: 'TL002', applicationId: 'APP001', status: 'document_verification', label: 'Document Verification', description: 'All uploaded documents have been verified.', timestamp: '2026-09-08T14:20:00Z', completed: true, current: false },
    { id: 'TL003', applicationId: 'APP001', status: 'institution_verified', label: 'Institution Verification', description: 'Your institution has verified your enrollment details.', timestamp: '2026-09-15T11:00:00Z', completed: true, current: false },
    { id: 'TL004', applicationId: 'APP001', status: 'state_verified', label: 'State Verification', description: 'State-level verification completed by Jharkhand Tribal Welfare Department.', timestamp: '2026-09-22T09:45:00Z', completed: true, current: false },
    { id: 'TL005', applicationId: 'APP001', status: 'mota_review', label: 'MoTA Review', description: 'Your application is under review by the Ministry of Tribal Affairs.', timestamp: '2026-09-27T10:30:00Z', completed: false, current: true },
    { id: 'TL006', applicationId: 'APP001', status: 'sanction', label: 'Sanction', description: 'Pending approval and sanction.', timestamp: '', completed: false, current: false },
    { id: 'TL007', applicationId: 'APP001', status: 'payment_processing', label: 'Payment Processing', description: 'Payment will be processed after sanction.', timestamp: '', completed: false, current: false },
    { id: 'TL008', applicationId: 'APP001', status: 'dbt_disbursement', label: 'DBT Disbursement', description: 'Direct benefit transfer to your bank account.', timestamp: '', completed: false, current: false }
  ],
  'APP002': [
    { id: 'TL010', applicationId: 'APP002', status: 'submitted', label: 'Application Submitted', description: 'Application submitted successfully.', timestamp: '2026-07-15T09:00:00Z', completed: true, current: false },
    { id: 'TL011', applicationId: 'APP002', status: 'document_verification', label: 'Document Verification', description: 'Documents verified.', timestamp: '2026-07-22T10:00:00Z', completed: true, current: false },
    { id: 'TL012', applicationId: 'APP002', status: 'institution_verified', label: 'Institution Verification', description: 'Institution verified.', timestamp: '2026-08-01T11:00:00Z', completed: true, current: false },
    { id: 'TL013', applicationId: 'APP002', status: 'state_verified', label: 'State Verification', description: 'State verification completed.', timestamp: '2026-08-10T14:00:00Z', completed: true, current: false },
    { id: 'TL014', applicationId: 'APP002', status: 'mota_review', label: 'MoTA Review', description: 'Reviewed and approved.', timestamp: '2026-08-20T09:00:00Z', completed: true, current: false },
    { id: 'TL015', applicationId: 'APP002', status: 'sanctioned', label: 'Sanctioned', description: 'Scholarship sanctioned.', timestamp: '2026-09-01T10:00:00Z', completed: true, current: false },
    { id: 'TL016', applicationId: 'APP002', status: 'payment_processing', label: 'Payment Processing', description: 'Payment processed via DBT.', timestamp: '2026-09-10T11:00:00Z', completed: true, current: false },
    { id: 'TL017', applicationId: 'APP002', status: 'dbt_disbursement', label: 'DBT Disbursement', description: 'Amount credited to bank account.', timestamp: '2026-09-20T14:00:00Z', completed: true, current: false }
  ]
};

export let documents: Document[] = [
  { id: 'DOC001', studentId: 'STU001', name: 'ST Certificate', type: 'st_certificate', status: 'verified', source: 'e-District', uploadedAt: '2026-08-20T10:00:00Z', verifiedAt: '2026-08-21T11:00:00Z', issuingAuthority: 'District Collector, West Singhbhum' },
  { id: 'DOC002', studentId: 'STU001', name: 'Income Certificate', type: 'income_certificate', status: 'verified', source: 'e-District', uploadedAt: '2026-08-20T10:05:00Z', verifiedAt: '2026-08-21T11:30:00Z', issuingAuthority: 'Tehsildar, Chaibasa' },
  { id: 'DOC003', studentId: 'STU001', name: 'Aadhaar Verification', type: 'aadhaar', status: 'verified', source: 'DigiLocker', uploadedAt: '2026-08-20T10:10:00Z', verifiedAt: '2026-08-20T10:15:00Z', issuingAuthority: 'UIDAI' },
  { id: 'DOC004', studentId: 'STU001', name: 'Academic Marksheet (Class 12)', type: 'marksheet', status: 'verified', source: 'DigiLocker', uploadedAt: '2026-08-20T10:15:00Z', verifiedAt: '2026-08-21T12:00:00Z', issuingAuthority: 'JAC Board' },
  { id: 'DOC005', studentId: 'STU001', name: 'Bonafide Certificate', type: 'bonafide', status: 'verified', source: 'Institution', uploadedAt: '2026-08-25T09:00:00Z', verifiedAt: '2026-08-26T10:00:00Z', issuingAuthority: 'Government Engineering College, Chaibasa' },
  { id: 'DOC006', studentId: 'STU001', name: 'Bank Passbook', type: 'bank_details', status: 'verified', source: 'Manual Upload', uploadedAt: '2026-08-25T09:05:00Z', verifiedAt: '2026-08-26T10:30:00Z', issuingAuthority: 'State Bank of India' },
  { id: 'DOC007', studentId: 'STU001', name: 'Fee Receipt', type: 'fee_receipt', status: 'pending', source: 'Manual Upload', uploadedAt: '2026-09-15T14:00:00Z', issuingAuthority: 'Government Engineering College, Chaibasa' },
  { id: 'DOC008', studentId: 'STU001', name: 'Domicile Certificate', type: 'domicile', status: 'missing', source: '', uploadedAt: '', issuingAuthority: '' },
];

export const verificationEvents: Record<string, VerificationEvent[]> = {
  'APP001': [
    { id: 'VER001', applicationId: 'APP001', category: 'Identity', source: 'DigiLocker', status: 'verified', details: 'Aadhaar-based identity verification completed', verifiedAt: '2026-09-05T10:00:00Z' },
    { id: 'VER002', applicationId: 'APP001', category: 'ST Status', source: 'e-District', status: 'verified', details: 'ST Certificate verified from district records', verifiedAt: '2026-09-06T11:00:00Z' },
    { id: 'VER003', applicationId: 'APP001', category: 'Income', source: 'e-District', status: 'mismatch', details: 'Income value mismatch detected between sources', verifiedAt: '2026-09-07T14:00:00Z', mismatchDetails: { field: 'Family Annual Income', profileValue: '₹1,80,000', sourceValue: '₹1,95,000' } },
    { id: 'VER004', applicationId: 'APP001', category: 'Academic', source: 'APAAR / AISHE', status: 'verified', details: 'Academic records verified through APAAR and AISHE databases', verifiedAt: '2026-09-08T09:00:00Z' },
    { id: 'VER005', applicationId: 'APP001', category: 'Institution', source: 'UDISE+ / AISHE', status: 'verified', details: 'Institution details verified', verifiedAt: '2026-09-10T10:00:00Z' },
    { id: 'VER006', applicationId: 'APP001', category: 'Bank', source: 'PFMS', status: 'verified', details: 'Bank account verified for DBT', verifiedAt: '2026-09-11T11:00:00Z' }
  ]
};

export const payments: Payment[] = [
  {
    id: 'PAY001',
    applicationId: 'APP002',
    studentId: 'STU002',
    schemeName: 'Post-Matric Scholarship',
    sanctionAmount: 18000,
    disbursedAmount: 18000,
    status: 'bank_credit',
    transactionId: 'DBT-2026-784521',
    sanctionDate: '2026-09-01T10:00:00Z',
    paymentDate: '2026-09-20T14:00:00Z',
    bankName: 'Punjab National Bank',
    accountMasked: 'XXXX XXXX 3421'
  },
  {
    id: 'PAY002',
    applicationId: 'APP001',
    studentId: 'STU001',
    schemeName: 'Post-Matric Scholarship',
    sanctionAmount: 18000,
    disbursedAmount: 0,
    status: 'sanctioned',
    transactionId: 'DBT-2026-784522',
    sanctionDate: '',
    bankName: 'State Bank of India',
    accountMasked: 'XXXX XXXX 7842'
  }
];

export let notifications: Notification[] = [
  { id: 'NOT001', userId: 'STU001', title: 'Application Under Review', message: 'Your Post-Matric Scholarship application is now under MoTA review.', type: 'info', read: false, createdAt: '2026-09-27T10:30:00Z', actionUrl: '/applications/APP001' },
  { id: 'NOT002', userId: 'STU001', title: 'Verification Complete', message: 'Your institution verification has been completed successfully.', type: 'success', read: true, createdAt: '2026-09-22T09:45:00Z', actionUrl: '/applications/APP001' },
  { id: 'NOT003', userId: 'STU001', title: 'Income Mismatch Detected', message: 'A mismatch was found in your income details. Manual review required.', type: 'warning', read: false, createdAt: '2026-09-07T14:00:00Z', actionUrl: '/verification/APP001' },
  { id: 'NOT004', userId: 'STU001', title: 'Document Missing', message: 'Please upload your Domicile Certificate to complete your document wallet.', type: 'action', read: false, createdAt: '2026-09-15T10:00:00Z', actionUrl: '/documents' },
  { id: 'NOT005', userId: 'STU001', title: 'Eligibility Alert', message: 'You may be eligible for the Top Class Education Scheme. Check eligibility now.', type: 'info', read: false, createdAt: '2026-09-25T08:00:00Z', actionUrl: '/schemes/SCH003' },
  { id: 'NOT006', userId: 'STU002', title: 'Payment Credited', message: 'Your Post-Matric Scholarship amount of ₹18,000 has been credited to your bank account.', type: 'success', read: false, createdAt: '2026-09-20T14:00:00Z', actionUrl: '/payments/APP002' },
];

export let grievances: GrievanceTicket[] = [
  { id: 'G001', ticketId: 'GRV-2026-00421', userId: 'STU001', category: 'Verification Issue', subject: 'Income certificate mismatch', description: 'My income certificate shows different amount than e-District records.', status: 'in_progress', createdAt: '2026-09-08T10:00:00Z', updatedAt: '2026-09-10T14:00:00Z' }
];

export const beneficiaryCandidates: BeneficiaryCandidate[] = [
  { id: 'BC001', studentName: 'Mangal Singh', state: 'Jharkhand', district: 'Gumla', educationLevel: 'Class 10', potentialScheme: 'Pre-Matric', currentBenefit: 'None', status: 'identified', dataSource: 'UDISE+' },
  { id: 'BC002', studentName: 'Lakshmi Baiga', state: 'Madhya Pradesh', district: 'Dindori', educationLevel: 'Class 12', potentialScheme: 'Post-Matric', currentBenefit: 'None', status: 'identified', dataSource: 'APAAR' },
  { id: 'BC003', studentName: 'Ratan Mina', state: 'Rajasthan', district: 'Dungarpur', educationLevel: 'B.A.', potentialScheme: 'Post-Matric', currentBenefit: 'None', status: 'outreach_sent', dataSource: 'OTR' },
  { id: 'BC004', studentName: 'Phoolwati Tharu', state: 'Uttarakhand', district: 'Udham Singh Nagar', educationLevel: 'B.Sc', potentialScheme: 'Post-Matric', currentBenefit: 'State Scholarship', status: 'identified', dataSource: 'AISHE' },
  { id: 'BC005', studentName: 'Budhu Sabar', state: 'Odisha', district: 'Mayurbhanj', educationLevel: 'Class 9', potentialScheme: 'Pre-Matric', currentBenefit: 'None', status: 'identified', dataSource: 'UDISE+' },
  { id: 'BC006', studentName: 'Kamla Bharia', state: 'Madhya Pradesh', district: 'Chhindwara', educationLevel: 'M.Sc', potentialScheme: 'Top Class', currentBenefit: 'Post-Matric', status: 'identified', dataSource: 'AISHE' },
  { id: 'BC007', studentName: 'Deepak Murmu', state: 'West Bengal', district: 'Jhargram', educationLevel: 'B.Tech', potentialScheme: 'Top Class', currentBenefit: 'None', status: 'outreach_sent', dataSource: 'APAAR' },
  { id: 'BC008', studentName: 'Sushila Kondh', state: 'Odisha', district: 'Kandhamal', educationLevel: 'Class 10', potentialScheme: 'Pre-Matric', currentBenefit: 'None', status: 'identified', dataSource: 'UDISE+' },
];

export let auditLogs: AuditLog[] = [
  { id: 'AUD001', userId: 'STU001', action: 'LOGIN', resource: 'auth', details: 'Student login via OTP', ipAddress: '192.168.1.100', timestamp: '2026-09-27T10:00:00Z' },
  { id: 'AUD002', userId: 'STU001', action: 'VIEW', resource: 'dashboard', details: 'Viewed scholarship dashboard', ipAddress: '192.168.1.100', timestamp: '2026-09-27T10:01:00Z' },
  { id: 'AUD003', userId: 'ADM001', action: 'VIEW', resource: 'admin/analytics', details: 'Admin viewed analytics dashboard', ipAddress: '10.0.0.50', timestamp: '2026-09-27T09:00:00Z' },
];

// ---- HELPER FUNCTIONS ----

export function getStudentByMobile(mobile: string): User | undefined {
  return users.find(u => u.mobile === mobile);
}

export function getStudentProfile(userId: string): StudentProfile | undefined {
  return studentProfiles[userId];
}

export function getSchemeById(id: string): Scheme | undefined {
  return schemes.find(s => s.id === id);
}

export function getStudentApplications(studentId: string): Application[] {
  return applications.filter(a => a.studentId === studentId);
}

export function getApplicationById(id: string): Application | undefined {
  return applications.find(a => a.id === id);
}

export function getApplicationTimeline(applicationId: string): ApplicationTimelineEvent[] {
  return applicationTimelines[applicationId] || [];
}

export function getStudentDocuments(studentId: string): Document[] {
  return documents.filter(d => d.studentId === studentId);
}

export function getVerificationByApplication(applicationId: string): VerificationEvent[] {
  return verificationEvents[applicationId] || [];
}

export function getStudentPayments(studentId: string): Payment[] {
  return payments.filter(p => p.studentId === studentId);
}

export function getPaymentByApplication(applicationId: string): Payment | undefined {
  return payments.find(p => p.applicationId === applicationId);
}

export function getStudentNotifications(userId: string): Notification[] {
  return notifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getStudentGrievances(userId: string): GrievanceTicket[] {
  return grievances.filter(g => g.userId === userId);
}

export function getSchemeStatusForStudent(studentId: string): Record<string, { status: string; applicationId?: string }> {
  return studentSchemeStatus[studentId] || {};
}

export function addApplication(app: Application): void {
  applications.push(app);
}

export function updateApplication(id: string, updates: Partial<Application>): Application | undefined {
  const idx = applications.findIndex(a => a.id === id);
  if (idx !== -1) {
    applications[idx] = { ...applications[idx], ...updates };
    return applications[idx];
  }
  return undefined;
}

export function addNotification(notif: Notification): void {
  notifications.push(notif);
}

export function markNotificationRead(id: string): void {
  const notif = notifications.find(n => n.id === id);
  if (notif) notif.read = true;
}

export function addDocument(doc: Document): void {
  documents.push(doc);
}

export function addGrievance(ticket: GrievanceTicket): void {
  grievances.push(ticket);
}

export function addAuditLog(log: AuditLog): void {
  auditLogs.push(log);
}

// Admin analytics helpers
export function getAdminAnalytics() {
  const totalApplications = applications.length;
  const pendingVerification = applications.filter(a => ['submitted', 'under_verification'].includes(a.status)).length;
  const approved = applications.filter(a => a.status === 'approved').length;
  const sanctioned = applications.filter(a => a.status === 'sanctioned').length;
  const disbursed = applications.filter(a => a.status === 'disbursed').length;
  const actionRequired = applications.filter(a => a.status === 'action_required' || a.deficiencies.length > 0).length;

  const byScheme = schemes.map(s => ({
    name: s.shortName,
    count: applications.filter(a => a.schemeId === s.id).length
  }));

  const byStatus = [
    { name: 'Submitted', count: applications.filter(a => a.status === 'submitted').length },
    { name: 'Under Verification', count: applications.filter(a => ['under_verification', 'institution_verified', 'state_verified'].includes(a.status)).length },
    { name: 'MoTA Review', count: applications.filter(a => a.status === 'mota_review').length },
    { name: 'Approved', count: applications.filter(a => a.status === 'approved').length },
    { name: 'Sanctioned', count: applications.filter(a => a.status === 'sanctioned').length },
    { name: 'Disbursed', count: applications.filter(a => a.status === 'disbursed').length },
    { name: 'Rejected', count: applications.filter(a => a.status === 'rejected').length },
  ];

  const byState = [
    { name: 'Jharkhand', applications: 2, approved: 1, disbursed: 0 },
    { name: 'Odisha', applications: 1, approved: 1, disbursed: 1 },
    { name: 'Madhya Pradesh', applications: 1, approved: 0, disbursed: 0 },
    { name: 'Rajasthan', applications: 0, approved: 0, disbursed: 0 },
    { name: 'Chhattisgarh', applications: 3, approved: 2, disbursed: 1 },
    { name: 'Maharashtra', applications: 2, approved: 1, disbursed: 1 },
  ];

  return {
    totalApplications,
    pendingVerification,
    approved,
    sanctioned,
    disbursed,
    actionRequired,
    byScheme,
    byStatus,
    byState,
    totalStudents: Object.keys(studentProfiles).length,
    beneficiaryCandidatesCount: beneficiaryCandidates.length
  };
}

// Demo simulation functions
export function simulateVerification(applicationId: string): void {
  const app = getApplicationById(applicationId);
  if (app) {
    app.status = 'state_verified';
    app.lastUpdated = new Date().toISOString();
    
    if (!applicationTimelines[applicationId]) {
      applicationTimelines[applicationId] = [];
    }
  }
}

export function simulateApproval(applicationId: string): void {
  const app = getApplicationById(applicationId);
  if (app) {
    app.status = 'approved';
    app.lastUpdated = new Date().toISOString();
  }
}

export function simulateSanction(applicationId: string): void {
  const app = getApplicationById(applicationId);
  if (app) {
    app.status = 'sanctioned';
    app.lastUpdated = new Date().toISOString();
  }
}

export function simulatePayment(applicationId: string): void {
  const app = getApplicationById(applicationId);
  if (app) {
    app.status = 'disbursed';
    app.lastUpdated = new Date().toISOString();
    
    const existingPayment = getPaymentByApplication(applicationId);
    if (existingPayment) {
      existingPayment.status = 'bank_credit';
      existingPayment.paymentDate = new Date().toISOString();
      existingPayment.disbursedAmount = existingPayment.sanctionAmount;
    }
  }
}

export function resetDemoData(): void {
  // Reset applications to initial state
  applications = applications.map(a => {
    if (a.id === 'APP001') return { ...a, status: 'mota_review' as const, lastUpdated: '2026-09-27T10:30:00Z' };
    return a;
  });
  
  // Reset notifications
  notifications = notifications.map(n => ({ ...n, read: false }));
}
