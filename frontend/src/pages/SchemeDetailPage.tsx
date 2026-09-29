// ============================================================
// SCHEME DETAIL PAGE
// Configurable data driven view of MoTA scholarship schemes
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDemo } from '../context/DemoContext';
import { api } from '../services/api';
import { Scheme } from '../types';
import {
  GraduationCap, Calendar, CheckCircle2, FileText, ArrowRight,
  ShieldCheck, AlertCircle, IndianRupee, Clock, Sparkles
} from 'lucide-react';

export const SchemeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { refreshKey } = useDemo();

  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.getScheme(id)
        .then(res => {
          if (res.success && res.data) setScheme(res.data);
        })
        .finally(() => setLoading(false));
    }
  }, [id, user, refreshKey]);

  if (loading && !scheme) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-sm text-gray-500">
        <Sparkles className="w-6 h-6 text-[#064E3B] animate-spin mx-auto mb-2" />
        Loading scheme guidelines...
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-lg font-bold text-gray-800">Scheme Not Found</h2>
        <Link to="/schemes" className="text-xs text-[#064E3B] underline mt-2 block">
          Return to All Schemes
        </Link>
      </div>
    );
  }

  const hasApplied = !!scheme.studentStatus?.applicationId;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="bg-[#064E3B] text-[#F8E7C9] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {scheme.shortName} Scheme
          </span>
          <span className="text-xs text-gray-500 font-mono">
            Administering Source: {scheme.sourceSystem}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          {scheme.name}
        </h1>

        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-3xl">
          {scheme.detailedDescription}
        </p>

        {/* Action strip */}
        <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
          <Link
            to={`/eligibility/${scheme.id}`}
            className="bg-[#F8E7C9] hover:bg-white text-[#064E3B] border border-[#064E3B]/20 font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-[#064E3B]" />
            <span>Check My Eligibility</span>
          </Link>

          {hasApplied ? (
            <Link
              to={`/applications/${scheme.studentStatus?.applicationId}`}
              className="bg-[#064E3B] hover:bg-[#04382A] text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition shadow-sm flex items-center gap-1.5"
            >
              <span>Track Application ({scheme.studentStatus?.applicationId})</span>
              <ArrowRight className="w-4 h-4 text-[#F8E7C9]" />
            </Link>
          ) : (
            <Link
              to={`/apply/${scheme.id}`}
              className="bg-[#064E3B] hover:bg-[#04382A] text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition shadow-sm flex items-center gap-1.5"
            >
              <span>Apply for Scheme</span>
              <ArrowRight className="w-4 h-4 text-[#F8E7C9]" />
            </Link>
          )}
        </div>
      </div>

      {/* Grid: Eligibility & Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Eligibility Criteria */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-[#064E3B]" />
            <h3 className="font-bold text-sm text-gray-900">Who Can Apply</h3>
          </div>

          <ul className="space-y-2.5 text-xs text-gray-700">
            {scheme.eligibility.additionalCriteria.map((crit, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{crit}</span>
              </li>
            ))}
            <li className="flex items-start gap-2 font-medium text-gray-900 pt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Family Annual Income: Up to ₹{scheme.eligibility.maxIncome.toLocaleString()}</span>
            </li>
          </ul>
        </div>

        {/* Benefits & Allowances */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <IndianRupee className="w-5 h-5 text-[#064E3B]" />
            <h3 className="font-bold text-sm text-gray-900">Benefits & Allowances</h3>
          </div>

          <div className="space-y-2">
            {scheme.benefits.amounts.map((b, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-xs"
              >
                <span className="text-gray-700">{b.category}</span>
                <span className="font-bold text-[#064E3B]">₹{b.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-gray-500 pt-1">
            * Amounts are credited directly via DBT to Aadhaar-seeded accounts upon sanction.
          </p>
        </div>
      </div>

      {/* Grid: Required Documents & Important Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Required Documents */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <FileText className="w-5 h-5 text-[#064E3B]" />
            <h3 className="font-bold text-sm text-gray-900">Mandatory Documents</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {scheme.requiredDocuments.map((doc, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-gray-50 border border-gray-100 rounded-lg flex items-center gap-2 text-gray-800"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B]"></span>
                <span>{doc}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              to="/documents"
              className="text-xs text-[#064E3B] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Manage in Digital Document Wallet</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Important Dates */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Calendar className="w-5 h-5 text-[#064E3B]" />
            <h3 className="font-bold text-sm text-gray-900">Timelines & Important Dates</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            {scheme.importantDates.map((d, idx) => (
              <div key={idx} className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-600">{d.label}</span>
                <span className="font-semibold text-gray-900">
                  {new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
