// ============================================================
// MULTI-STEP APPLICATION FORM
// Enter Once, Reuse Everywhere Architecture
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDemo } from '../context/DemoContext';
import { api } from '../services/api';
import { Scheme, StudentProfile } from '../types';
import {
  CheckCircle2, ArrowRight, ArrowLeft, Save, Sparkles,
  User, GraduationCap, Building, CreditCard, FileText,
  ShieldCheck, AlertCircle, Check
} from 'lucide-react';

const STEPS = [
  'Personal Details',
  'Academic Details',
  'Scheme Details',
  'Income Details',
  'Bank Details',
  'Documents',
  'Review',
  'Submit'
];

export const ApplicationFormPage: React.FC = () => {
  const { schemeId } = useParams<{ schemeId: string }>();
  const { user } = useAuth();
  const { triggerRefresh } = useDemo();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const [profRes, schemeRes] = await Promise.all([
          api.getProfile(),
          schemeId ? api.getScheme(schemeId) : api.getScheme('SCH002')
        ]);

        if (profRes.success && profRes.data) {
          setProfile(profRes.data);
          // Pre-fill from profile
          setFormData({
            name: profRes.data.name,
            dob: profRes.data.dateOfBirth,
            gender: profRes.data.gender,
            mobile: profRes.data.mobile,
            email: profRes.data.email,
            stCategory: profRes.data.stCategory,
            isPVTG: profRes.data.isPVTG,
            state: profRes.data.state,
            district: profRes.data.district,
            village: profRes.data.village,
            institution: profRes.data.institution,
            institutionCode: profRes.data.institutionCode,
            course: profRes.data.course,
            academicYear: profRes.data.academicYear,
            familyIncome: profRes.data.familyIncome,
            incomeCertNo: 'INC-JH-2026-45821',
            bankName: profRes.data.bankName,
            accountMasked: profRes.data.bankAccountMasked,
            ifsc: profRes.data.ifscCode,
            hostellerStatus: 'Day Scholar',
            declaration: true
          });
        }
        if (schemeRes.success && schemeRes.data) {
          setScheme(schemeRes.data);
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [schemeId, user]);

  const handleSaveDraft = () => {
    localStorage.setItem(`draft_${scheme?.id}`, JSON.stringify(formData));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheme) return;
    setSubmitting(true);
    try {
      const res = await api.submitApplication(scheme.id, formData);
      if (res.success && res.data) {
        triggerRefresh();
        navigate(`/applications/${res.data.id}`);
      }
    } catch {
      alert('Application submission error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-gray-500">
        <Sparkles className="w-6 h-6 text-[#064E3B] animate-spin mx-auto mb-2" />
        Preparing pre-filled multi-step application form...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#064E3B] bg-[#F8E7C9] px-2.5 py-0.5 rounded">
            Pre-Filled MoTA Application Form
          </span>
          <h1 className="text-xl font-bold text-gray-900 mt-1">
            Apply: {scheme?.name}
          </h1>
          <p className="text-xs text-gray-500">
            Reusing profile and DigiLocker certified information.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {draftSaved && (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Draft Saved
            </span>
          )}
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>
        </div>
      </div>

      {/* Progress Bar & Steps Indicator */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-gray-800">
            Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1]}
          </span>
          <span className="text-gray-500 font-medium">
            {Math.round((currentStep / STEPS.length) * 100)}% Completed
          </span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-[#064E3B] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          ></div>
        </div>

        {/* Steps Bubbles */}
        <div className="hidden sm:flex items-center justify-between pt-1 overflow-x-auto text-[10px]">
          {STEPS.map((s, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div key={idx} className="flex flex-col items-center">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold mb-1 transition-colors ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-[#064E3B] text-[#F8E7C9] ring-2 ring-[#F8E7C9]'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3" /> : stepNum}
                </span>
                <span className={`text-center max-w-[70px] truncate ${isCurrent ? 'font-bold text-[#064E3B]' : 'text-gray-500'}`}>
                  {s}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Step Body */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
        {/* Step 1: Personal Details */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
              1. Personal & Contact Details (Pre-filled from Profile)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  disabled
                  value={formData.name || ''}
                  className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-xl font-medium text-gray-800 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Date of Birth</label>
                <input
                  type="text"
                  disabled
                  value={formData.dob || ''}
                  className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Gender</label>
                <input
                  type="text"
                  disabled
                  value={formData.gender || ''}
                  className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Mobile Number</label>
                <input
                  type="text"
                  disabled
                  value={formData.mobile || ''}
                  className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">ST Category</label>
                <input
                  type="text"
                  disabled
                  value={formData.stCategory || ''}
                  className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">State & District</label>
                <input
                  type="text"
                  disabled
                  value={`${formData.district || ''}, ${formData.state || ''}`}
                  className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Academic Details */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
              2. Academic & Enrollment Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-semibold mb-1">Enrolled Institution</label>
                <input
                  type="text"
                  value={formData.institution || ''}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Course / Degree</label>
                <input
                  type="text"
                  value={formData.course || ''}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Academic Year</label>
                <input
                  type="text"
                  value={formData.academicYear || ''}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Scholar Type</label>
                <select
                  value={formData.hostellerStatus || 'Day Scholar'}
                  onChange={(e) => setFormData({ ...formData, hostellerStatus: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                >
                  <option value="Day Scholar">Day Scholar</option>
                  <option value="Hosteller">Hosteller</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Scheme Details */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
              3. Scheme Application Specifics
            </h3>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-2">
              <span className="font-bold text-[#064E3B]">{scheme?.name}</span>
              <p className="text-gray-700 leading-relaxed">{scheme?.description}</p>
              <div className="pt-2 text-[11px] text-gray-600">
                Source Administration System: <span className="font-bold">{scheme?.sourceSystem}</span>
              </div>
            </div>
            <div className="text-xs">
              <label className="block text-gray-700 font-semibold mb-1">Admission Quota / Category</label>
              <input
                type="text"
                defaultValue="ST Reserved Seat - Merit Admission"
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
              />
            </div>
          </div>
        )}

        {/* Step 4: Income Details */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
              4. Income & Economic Criteria
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Annual Family Income (₹)</label>
                <input
                  type="number"
                  value={formData.familyIncome || 0}
                  onChange={(e) => setFormData({ ...formData, familyIncome: Number(e.target.value) })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Income Certificate Certificate No.</label>
                <input
                  type="text"
                  value={formData.incomeCertNo || ''}
                  onChange={(e) => setFormData({ ...formData, incomeCertNo: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-mono"
                />
              </div>
            </div>
            <p className="text-[11px] text-gray-500">
              * Income limit for {scheme?.shortName} is ₹{scheme?.eligibility.maxIncome.toLocaleString()} / year.
            </p>
          </div>
        )}

        {/* Step 5: Bank Details */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
              5. Direct Benefit Transfer (DBT) Bank Account
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Bank Name</label>
                <input
                  type="text"
                  disabled
                  value={formData.bankName || ''}
                  className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-xl cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Account Number (Masked)</label>
                <input
                  type="text"
                  disabled
                  value={formData.accountMasked || ''}
                  className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-xl font-mono cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">IFSC Code</label>
                <input
                  type="text"
                  disabled
                  value={formData.ifsc || ''}
                  className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-xl font-mono cursor-not-allowed"
                />
              </div>
              <div className="flex items-center pt-5">
                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Aadhaar Seeded & PFMS Validated
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Documents */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
              6. Attached Verification Documents
            </h3>
            <p className="text-xs text-gray-600">
              The following digital documents are mapped from your Document Wallet:
            </p>
            <div className="space-y-2 text-xs">
              {['ST Caste Certificate', 'Income Certificate', 'Aadhaar Verification', 'Previous Marksheet', 'Bonafide Certificate'].map((d, i) => (
                <div key={i} className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                  <span className="font-medium text-gray-800">{d}</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Attached & Verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 7: Review */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
              7. Final Review Before Submission
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-gray-500">Applicant:</span> <span className="font-semibold">{formData.name}</span></div>
                <div><span className="text-gray-500">Scheme:</span> <span className="font-semibold">{scheme?.shortName}</span></div>
                <div><span className="text-gray-500">Course:</span> <span className="font-semibold">{formData.course}</span></div>
                <div><span className="text-gray-500">Institution:</span> <span className="font-semibold">{formData.institution}</span></div>
                <div><span className="text-gray-500">Income:</span> <span className="font-semibold">₹{formData.familyIncome?.toLocaleString()}</span></div>
                <div><span className="text-gray-500">Bank:</span> <span className="font-semibold">{formData.bankName}</span></div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.declaration}
                  onChange={(e) => setFormData({ ...formData, declaration: e.target.checked })}
                  className="mt-0.5 rounded text-[#064E3B]"
                />
                <span>
                  I declare that the information provided is correct and that I am not in receipt of any conflicting government scholarship for this academic term.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Step 8: Submit Confirmation */}
        {currentStep === 8 && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-emerald-700" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Ready to Submit Application</h3>
            <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
              Upon submission, your application will be routed to the institution verification desk and the MoTA Smart Verification Engine.
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-semibold transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div></div>}

          {currentStep < STEPS.length ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="flex items-center gap-1.5 bg-[#064E3B] hover:bg-[#04382A] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F8E7C9]" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-[#064E3B] hover:bg-[#04382A] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition"
            >
              <Sparkles className="w-4 h-4 text-[#F8E7C9]" />
              <span>{submitting ? 'Submitting...' : 'Submit Application Now'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
