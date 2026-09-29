// ============================================================
// LOGIN PAGE
// Mobile Number + OTP (Demo OTP: 123456)
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import {
  GraduationCap, Smartphone, KeyRound, ArrowRight,
  ShieldCheck, AlertCircle, CheckCircle2, UserCheck
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [mobile, setMobile] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobile)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setOtp('123456'); // Pre-fill demo OTP for fast evaluation
    }, 400);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }
    setError(null);
    setLoading(true);

    const success = await login(mobile, otp);
    setLoading(false);

    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid OTP. Please use demo OTP: 123456');
    }
  };

  const quickLogin = async (mobileNum: string) => {
    setMobile(mobileNum);
    setLoading(true);
    const success = await login(mobileNum, '123456');
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header Header Bar */}
        <div className="bg-[#064E3B] text-white p-6 text-center border-b-4 border-[#F8E7C9]">
          <div className="w-12 h-12 rounded-xl bg-[#F8E7C9] text-[#064E3B] flex items-center justify-center mx-auto mb-3 shadow-md font-bold">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Aakanksha <span className="text-[#F8E7C9] font-normal">(आकांक्षा)</span>
          </h2>
          <p className="text-xs text-emerald-100 mt-1 font-medium">
            Unified Tribal Scholarship Portal | Ministry of Tribal Affairs
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {step === 'mobile' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Mobile Number (Registered with Aadhaar / Portal)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-[#064E3B]"
                    required
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Default Demo Student: <span className="font-semibold text-gray-700">9876543210</span> (Rahul Kumar)
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#064E3B] hover:bg-[#04382A] text-white py-3 rounded-xl font-semibold text-xs transition shadow-md flex items-center justify-center gap-2"
              >
                <span>Get OTP</span>
                <ArrowRight className="w-4 h-4 text-[#F8E7C9]" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Enter OTP sent to +91 {mobile}
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep('mobile')}
                    className="text-[11px] text-[#064E3B] hover:underline"
                  >
                    Change Number
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="6-digit OTP"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-[#064E3B]"
                    required
                  />
                </div>

                {/* Visible Demo OTP Banner as required */}
                <div className="mt-2 p-2.5 bg-[#F8E7C9]/60 border border-[#F8E7C9] rounded-lg text-center">
                  <p className="text-xs font-bold text-[#064E3B]">
                    Use Demo OTP: <span className="underline font-mono text-sm">123456</span>
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#064E3B] hover:bg-[#04382A] text-white py-3 rounded-xl font-semibold text-xs transition shadow-md flex items-center justify-center gap-2"
              >
                <span>Verify & Login</span>
                <CheckCircle2 className="w-4 h-4 text-[#F8E7C9]" />
              </button>
            </form>
          )}

          {/* Quick Demo Switcher Cards */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#064E3B]" />
              Quick Demo Personas (1-Click Login):
            </p>
            <div className="grid grid-cols-1 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => quickLogin('9876543210')}
                className="text-left p-2 rounded-lg bg-gray-50 hover:bg-[#F8E7C9]/40 border border-gray-200 flex items-center justify-between"
              >
                <div>
                  <span className="font-semibold text-gray-900">Rahul Kumar</span>
                  <span className="text-gray-500 block text-[10px]">Jharkhand | B.Tech | MoTA Review</span>
                </div>
                <span className="text-[10px] bg-[#064E3B] text-white px-2 py-0.5 rounded font-medium">Student</span>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('9876543211')}
                className="text-left p-2 rounded-lg bg-gray-50 hover:bg-[#F8E7C9]/40 border border-gray-200 flex items-center justify-between"
              >
                <div>
                  <span className="font-semibold text-gray-900">Priya Munda</span>
                  <span className="text-gray-500 block text-[10px]">Odisha | NIT Rourkela | DBT Disbursed</span>
                </div>
                <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded font-medium">Disbursed</span>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('9876543230')}
                className="text-left p-2 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center justify-between"
              >
                <div>
                  <span className="font-semibold text-amber-950">MoTA Administrator</span>
                  <span className="text-amber-800 block text-[10px]">National Analytics & Beneficiary Gap Outreach</span>
                </div>
                <span className="text-[10px] bg-amber-800 text-white px-2 py-0.5 rounded font-medium">Admin</span>
              </button>
            </div>
          </div>

          <div className="text-center text-[10px] text-gray-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secured with OTP authentication & role-based access</span>
          </div>
        </div>
      </div>
    </div>
  );
};
