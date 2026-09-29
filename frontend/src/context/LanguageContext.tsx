// ============================================================
// MULTILINGUAL CONTEXT (English, Hindi, Kannada)
// ============================================================

import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'hi' | 'kn';

interface Translations {
  portalTitle: string;
  ministryName: string;
  home: string;
  scholarships: string;
  applications: string;
  documents: string;
  verification: string;
  payments: string;
  jago: string;
  help: string;
  login: string;
  logout: string;
  checkEligibility: string;
  applyNow: string;
  status: string;
  profile: string;
  admin: string;
  demoMode: string;
}

const translations: Record<Language, Translations> = {
  en: {
    portalTitle: 'Aakanksha — Unified Tribal Scholarship Portal',
    ministryName: 'Ministry of Tribal Affairs, Govt. of India',
    home: 'Home',
    scholarships: 'Scholarships',
    applications: 'Applications',
    documents: 'Document Wallet',
    verification: 'Verification',
    payments: 'Payments & DBT',
    jago: 'Ask JAGO',
    help: 'Grievance & Help',
    login: 'Login',
    logout: 'Logout',
    checkEligibility: 'Check Eligibility',
    applyNow: 'Apply Now',
    status: 'Status',
    profile: 'Profile',
    admin: 'Admin Portal',
    demoMode: 'DEMO MODE',
  },
  hi: {
    portalTitle: 'आकांक्षा — एकीकृत जनजातीय छात्रवृत्ति पोर्टल',
    ministryName: 'जनजातीय कार्य मंत्रालय, भारत सरकार',
    home: 'होम',
    scholarships: 'छात्रवृत्तियां',
    applications: 'आवेदन',
    documents: 'दस्तावेज़ वॉलेट',
    verification: 'सत्यापन',
    payments: 'भुगतान एवं डीबीटी',
    jago: 'जागो से पूछें',
    help: 'शिकायत एवं सहायता',
    login: 'लॉग इन',
    logout: 'लॉग आउट',
    checkEligibility: 'पात्रता जांचें',
    applyNow: 'अभी आवेदन करें',
    status: 'स्थिति',
    profile: 'प्रोफाइल',
    admin: 'व्यवस्थापक पोर्टल',
    demoMode: 'डेमो मोड',
  },
  kn: {
    portalTitle: 'ಆಕಾಂಕ್ಷಾ — ಏಕೀಕೃತ ಬುಡಕಟ್ಟು ವಿದ್ಯಾರ್ಥಿವೇತನ ಪೋರ್ಟಲ್',
    ministryName: 'ಬುಡಕಟ್ಟು ವ್ಯವಹಾರಗಳ ಸಚಿವಾಲಯ, ಭಾರತ ಸರ್ಕಾರ',
    home: 'ಮುಖಪುಟ',
    scholarships: 'ವಿದ್ಯಾರ್ಥಿವೇತನಗಳು',
    applications: 'ಅರ್ಜಿಗಳು',
    documents: 'ದಾಖಲೆ ವಾಲೆಟ್',
    verification: 'ಪರಿಶೀಲನೆ',
    payments: 'ಪಾವತಿಗಳು ಮತ್ತು ಡಿಬಿಟಿ',
    jago: 'ಜಾಗೋ ಕೇಳಿ',
    help: 'ಕುಂದುಕೊರತೆ ಮತ್ತು ಸಹಾಯ',
    login: 'ಲಾಗಿನ್',
    logout: 'ಲಾಗೌಟ್',
    checkEligibility: 'ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ',
    applyNow: 'ಈಗಲೇ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    status: 'ಸ್ಥಿತಿ',
    profile: 'ಪ್ರೊಫೈಲ್',
    admin: 'ಆಡಳಿತ ಪೋರ್ಟಲ್',
    demoMode: 'ಡೆಮೋ ಮೋಡ್',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
