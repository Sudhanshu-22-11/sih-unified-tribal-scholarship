// ============================================================
// MOCK GOVERNMENT INTEGRATION ADAPTERS
// ============================================================
// These adapters simulate connections to various government
// systems. In production, replace mock implementations with
// actual API calls using authorised credentials.
// ============================================================

export interface AdapterResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  source: string;
  timestamp: string;
  isSimulated: boolean;
}

// Flag to simulate API failures for demo
let simulateApiFailure: Record<string, boolean> = {};

export function setApiFailure(system: string, shouldFail: boolean): void {
  simulateApiFailure[system] = shouldFail;
}

export function getApiFailureStatus(): Record<string, boolean> {
  return { ...simulateApiFailure };
}

function createResponse<T>(source: string, data?: T, error?: string): AdapterResponse<T> {
  if (simulateApiFailure[source]) {
    return {
      success: false,
      error: `${source} verification service is temporarily unavailable. Please try again later.`,
      source,
      timestamp: new Date().toISOString(),
      isSimulated: true
    };
  }
  return {
    success: !error,
    data,
    error,
    source,
    timestamp: new Date().toISOString(),
    isSimulated: true
  };
}

// ---- NSP Adapter (National Scholarship Portal) ----
export const NSPAdapter = {
  name: 'National Scholarship Portal (NSP)',
  
  async getApplicationStatus(applicationId: string): Promise<AdapterResponse<any>> {
    return createResponse('NSP', {
      applicationId,
      status: 'under_review',
      lastUpdated: '2026-09-27T10:00:00Z',
      remarks: 'Application under departmental review'
    });
  },

  async getScholarshipDetails(schemeId: string): Promise<AdapterResponse<any>> {
    return createResponse('NSP', {
      schemeId,
      schemeName: 'Post-Matric Scholarship for ST',
      portal: 'scholarships.gov.in',
      academicYear: '2026-27'
    });
  },

  async checkExistingBenefits(studentId: string): Promise<AdapterResponse<any>> {
    return createResponse('NSP', {
      studentId,
      existingScholarships: [
        { scheme: 'Post-Matric Scholarship', status: 'Active', academicYear: '2026-27', amount: 18000 }
      ]
    });
  }
};

// ---- SFMP Adapter (Scholarship & Fellowship Management Portal) ----
export const SFMPAdapter = {
  name: 'Scholarship & Fellowship Management Portal (SFMP)',

  async getTopClassStatus(applicationId: string): Promise<AdapterResponse<any>> {
    return createResponse('SFMP', {
      applicationId,
      scheme: 'Top Class Education',
      status: 'sanctioned',
      institutionVerified: true
    });
  },

  async verifyInstitution(institutionCode: string): Promise<AdapterResponse<any>> {
    return createResponse('SFMP', {
      institutionCode,
      isNotified: true,
      category: 'Top Class Institution',
      verifiedAt: '2026-09-15T10:00:00Z'
    });
  }
};

// ---- NFST Adapter ----
export const NFSTAdapter = {
  name: 'National Fellowship for ST (NFST)',

  async getFellowshipStatus(applicationId: string): Promise<AdapterResponse<any>> {
    return createResponse('NFST', {
      applicationId,
      fellowshipType: 'JRF',
      status: 'under_verification',
      university: 'University of Delhi'
    });
  },

  async checkEligibility(studentId: string): Promise<AdapterResponse<any>> {
    return createResponse('NFST', {
      studentId,
      eligible: true,
      reason: 'Meets all criteria for NFST fellowship'
    });
  }
};

// ---- NOS Adapter ----
export const NOSAdapter = {
  name: 'National Overseas Scholarship (NOS)',

  async getScholarshipStatus(applicationId: string): Promise<AdapterResponse<any>> {
    return createResponse('NOS', {
      applicationId,
      status: 'not_applied',
      availableSlots: 20,
      academicYear: '2026-27'
    });
  }
};

// ---- DigiLocker Adapter ----
export const DigiLockerAdapter = {
  name: 'DigiLocker',

  async fetchDocuments(aadhaarMasked: string): Promise<AdapterResponse<any>> {
    return createResponse('DigiLocker', {
      documents: [
        { name: 'Aadhaar Card', type: 'aadhaar', issuer: 'UIDAI', issuedDate: '2020-01-15', status: 'verified' },
        { name: 'Class 10 Marksheet', type: 'marksheet_10', issuer: 'CBSE', issuedDate: '2020-05-20', status: 'verified' },
        { name: 'Class 12 Marksheet', type: 'marksheet_12', issuer: 'JAC Board', issuedDate: '2022-06-15', status: 'verified' },
        { name: 'Caste Certificate', type: 'st_certificate', issuer: 'District Administration', issuedDate: '2023-03-10', status: 'verified' },
        { name: 'Income Certificate', type: 'income_certificate', issuer: 'Tehsildar', issuedDate: '2026-04-01', status: 'verified' }
      ],
      totalDocuments: 5,
      lastSynced: new Date().toISOString()
    });
  },

  async verifyDocument(documentId: string): Promise<AdapterResponse<any>> {
    return createResponse('DigiLocker', {
      documentId,
      verified: true,
      verifiedAt: new Date().toISOString()
    });
  }
};

// ---- UDISE+ Adapter ----
export const UDISEAdapter = {
  name: 'UDISE+',

  async getSchoolDetails(schoolCode: string): Promise<AdapterResponse<any>> {
    return createResponse('UDISE+', {
      schoolCode,
      schoolName: 'Government Engineering College, Chaibasa',
      state: 'Jharkhand',
      district: 'West Singhbhum',
      category: 'Government',
      isRecognized: true
    });
  },

  async verifyEnrollment(studentId: string, institutionCode: string): Promise<AdapterResponse<any>> {
    return createResponse('UDISE+', {
      studentId,
      institutionCode,
      enrolled: true,
      academicYear: '2026-27',
      class: 'B.Tech 2nd Year'
    });
  }
};

// ---- APAAR Adapter ----
export const APAARAdapter = {
  name: 'APAAR (One Nation One Student ID)',

  async getStudentRecord(apaarId: string): Promise<AdapterResponse<any>> {
    return createResponse('APAAR', {
      apaarId,
      name: 'Rahul Kumar',
      educationHistory: [
        { level: 'Class 10', year: 2020, school: 'Govt. High School, Chaibasa', percentage: 82 },
        { level: 'Class 12', year: 2022, school: 'Govt. Sr. Sec. School, Chaibasa', percentage: 78 },
        { level: 'B.Tech (ongoing)', year: 2026, institution: 'GEC Chaibasa', semester: '3rd' }
      ]
    });
  }
};

// ---- AISHE Adapter ----
export const AISHEAdapter = {
  name: 'AISHE (All India Survey on Higher Education)',

  async verifyInstitution(institutionCode: string): Promise<AdapterResponse<any>> {
    return createResponse('AISHE', {
      institutionCode,
      institutionName: 'Government Engineering College, Chaibasa',
      type: 'Engineering College',
      state: 'Jharkhand',
      aisheCode: 'C-12345',
      recognized: true,
      accredited: true
    });
  }
};

// ---- e-District Adapter ----
export const EDistrictAdapter = {
  name: 'e-District',

  async verifyCasteCertificate(certificateNo: string): Promise<AdapterResponse<any>> {
    return createResponse('e-District', {
      certificateNo,
      category: 'ST',
      subCategory: 'Ho',
      issuedBy: 'District Collector, West Singhbhum',
      issuedDate: '2023-03-10',
      valid: true
    });
  },

  async verifyIncomeCertificate(certificateNo: string): Promise<AdapterResponse<any>> {
    // Simulates mismatch scenario
    return createResponse('e-District', {
      certificateNo,
      annualIncome: 195000, // Different from profile's 180000
      issuedBy: 'Tehsildar, Chaibasa',
      issuedDate: '2026-04-01',
      valid: true
    });
  }
};

// ---- DBT/PFMS Adapter ----
export const DBTAdapter = {
  name: 'DBT/PFMS',

  async getPaymentStatus(transactionId: string): Promise<AdapterResponse<any>> {
    return createResponse('DBT/PFMS', {
      transactionId,
      status: 'processing',
      amount: 18000,
      beneficiaryBank: 'State Bank of India',
      initiatedDate: '2026-09-25T10:00:00Z'
    });
  },

  async initiatePayment(applicationId: string, amount: number): Promise<AdapterResponse<any>> {
    return createResponse('DBT/PFMS', {
      applicationId,
      transactionId: `DBT-2026-${Math.floor(Math.random() * 900000) + 100000}`,
      amount,
      status: 'initiated',
      initiatedAt: new Date().toISOString()
    });
  },

  async verifyBankAccount(accountNumber: string, ifsc: string): Promise<AdapterResponse<any>> {
    return createResponse('DBT/PFMS', {
      accountValid: true,
      bankName: 'State Bank of India',
      branchName: 'Chaibasa Branch',
      ifscValid: true
    });
  }
};
