// ============================================================
// PAYMENT & DBT TRACKING PAGE
// Direct Benefit Transfer Status via PFMS
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDemo } from '../context/DemoContext';
import { api } from '../services/api';
import { Payment } from '../types';
import {
  CreditCard, CheckCircle2, Clock, AlertCircle, ArrowRight,
  ShieldCheck, Landmark, Receipt, Sparkles, ChevronLeft
} from 'lucide-react';

export const PaymentTrackingPage: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const { user } = useAuth();
  const { refreshKey } = useDemo();

  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (applicationId) {
      api.getPayment(applicationId)
        .then(res => {
          if (res.success && res.data) setPayment(res.data);
        })
        .finally(() => setLoading(false));
    } else {
      api.getPayments()
        .then(res => {
          if (res.success && res.data && res.data.length > 0) {
            setPayment(res.data[0]);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [applicationId, user, refreshKey]);

  if (loading && !payment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-gray-500">
        <Sparkles className="w-6 h-6 text-[#064E3B] animate-spin mx-auto mb-2" />
        Connecting to PFMS & DBT payment records...
      </div>
    );
  }

  const isDisbursed = payment?.status === 'bank_credit';

  const stages = [
    { title: 'Sanctioned', desc: 'MoTA sanction order issued', completed: true },
    { title: 'Payment Processing', desc: 'PFMS payment file generated', completed: true },
    { title: 'DBT Initiated', desc: 'Disbursement sent via NPCI mapper', completed: isDisbursed || payment?.status === 'dbt_initiated' },
    { title: 'Bank Credit', desc: 'Direct credit to student account', completed: isDisbursed }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <Link
          to="/applications"
          className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-[#064E3B] font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </Link>
      </div>

      {/* Payment Summary Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#064E3B] bg-[#F8E7C9] px-2.5 py-0.5 rounded">
            DBT Payment Information
          </span>
          <span className="text-xs font-mono text-gray-500">
            System: PFMS / DBT Bharat
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {payment?.schemeName || 'Post-Matric Scholarship'}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Beneficiary: <span className="font-semibold text-gray-800">{user?.name}</span> • DBT Transaction ID: <span className="font-mono font-bold text-[#064E3B]">{payment?.transactionId}</span>
            </p>
          </div>

          <div className="text-left sm:text-right bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
              Sanctioned Amount
            </span>
            <span className="text-2xl font-bold text-[#064E3B]">
              ₹{payment?.sanctionAmount?.toLocaleString() || '18,000'}
            </span>
          </div>
        </div>

        {/* DBT Disbursement Stages */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700">
            Disbursement Milestones
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {stages.map((st, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs space-y-1 transition ${
                  st.completed
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-gray-900">
                  {st.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                  <span>{st.title}</span>
                </div>
                <p className="text-[11px] text-gray-600">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bank Account Verification Details */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-gray-500 block text-[11px]">Credited Bank:</span>
            <span className="font-semibold text-gray-900 flex items-center gap-1 mt-0.5">
              <Landmark className="w-3.5 h-3.5 text-[#064E3B]" />
              {payment?.bankName || 'State Bank of India'}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block text-[11px]">Account (Masked):</span>
            <span className="font-mono font-semibold text-gray-900 block mt-0.5">
              {payment?.accountMasked || 'XXXX XXXX 7842'}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block text-[11px]">Credit Status:</span>
            <span className="font-semibold text-emerald-800 block mt-0.5">
              {isDisbursed ? 'Credited to Account' : 'Processing for Release'}
            </span>
          </div>
        </div>

        {/* Simulation Notice */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[10px] text-amber-900 text-center">
          Prototype Demo Notice: The transaction ID and PFMS records shown are simulated for Smart India Hackathon 2026. Live disbursements utilize the PFMS-NPCI direct gateway with official treasury approvals.
        </div>
      </div>
    </div>
  );
};
