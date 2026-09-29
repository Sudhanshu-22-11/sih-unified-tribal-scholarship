// ============================================================
// ELIGIBILITY ENGINE PAGE
// Rule-Based Evaluation & Conflict Checking
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDemo } from '../context/DemoContext';
import { api } from '../services/api';
import { Scheme, EligibilityResult } from '../types';
import {
  CheckCircle2, XCircle, AlertCircle, ArrowRight, ShieldCheck,
  Sparkles, Info, RefreshCw, FileText
} from 'lucide-react';

export const EligibilityPage: React.FC = () => {
  const { schemeId } = useParams<{ schemeId: string }>();
  const { user } = useAuth();
  const { refreshKey } = useDemo();
  const navigate = useNavigate();

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(schemeId || 'SCH002');
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getSchemes().then(res => {
      if (res.success && res.data) {
        setSchemes(res.data);
      }
    });
  }, [user, refreshKey]);

  useEffect(() => {
    if (schemeId) {
      setSelectedSchemeId(schemeId);
    }
  }, [schemeId]);

  useEffect(() => {
    if (selectedSchemeId) {
      setLoading(true);
      api.checkEligibility(selectedSchemeId)
        .then(res => {
          if (res.success && res.data) {
            setResult(res.data);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [selectedSchemeId, user, refreshKey]);

  const getResultBadge = (resType: string) => {
    switch (resType) {
      case 'POTENTIALLY_ELIGIBLE':
      case 'ELIGIBLE':
        return (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-700" />
              <div>
                <h4 className="font-bold text-sm text-emerald-900">Potentially Eligible</h4>
                <p className="text-xs text-emerald-700">All core criteria match your student profile.</p>
              </div>
            </div>
            <Link
              to={`/apply/${selectedSchemeId}`}
              className="bg-[#064E3B] hover:bg-[#04382A] text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-sm flex items-center gap-1.5 transition"
            >
              <span>Start Application</span>
              <ArrowRight className="w-4 h-4 text-[#F8E7C9]" />
            </Link>
          </div>
        );
      case 'NOT_ELIGIBLE':
        return (
          <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl flex items-center gap-3">
            <XCircle className="w-6 h-6 text-rose-700 shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-rose-900">Not Eligible</h4>
              <p className="text-xs text-rose-700">One or more criteria do not match the scheme parameters.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-700 shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-amber-900">More Information Required</h4>
              <p className="text-xs text-amber-700">Please update your profile details to evaluate eligibility.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#064E3B]" />
          <h1 className="text-xl font-bold text-gray-900">
            Scholarship Eligibility Engine
          </h1>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          The rule engine cross-evaluates your profile against official MoTA scheme criteria and checks existing active benefits to ensure no conflicting awards.
        </p>

        {/* Scheme Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Select Scholarship Scheme to Evaluate:
          </label>
          <select
            value={selectedSchemeId}
            onChange={(e) => {
              setSelectedSchemeId(e.target.value);
              navigate(`/eligibility/${e.target.value}`);
            }}
            className="w-full sm:w-80 p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 focus:ring-1 focus:ring-[#064E3B]"
          >
            {schemes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.sourceSystem})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Evaluation Results Card */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center text-xs text-gray-500">
          <RefreshCw className="w-6 h-6 text-[#064E3B] animate-spin mx-auto mb-2" />
          Evaluating criteria across profile records...
        </div>
      ) : result ? (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                Evaluation Target
              </span>
              <h3 className="text-base font-bold text-gray-900">{result.schemeName}</h3>
            </div>
            <span className="text-xs bg-[#F8E7C9] text-[#064E3B] px-2.5 py-1 rounded font-bold">
              Automated Check
            </span>
          </div>

          {/* Criteria Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Rule-By-Rule Verification Breakdown
            </h4>

            <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden text-xs">
              {result.checks.map((chk, idx) => (
                <div key={idx} className="p-3.5 flex items-start justify-between gap-4 bg-white hover:bg-gray-50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {chk.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span className="font-semibold text-gray-900">{chk.criterion}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 pl-6">{chk.details}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                    chk.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {chk.passed ? 'PASSED' : 'FLAGGED'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Outcome Banner */}
          {getResultBadge(result.result)}

          {/* Mandatory Government Disclaimer */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-2.5 text-[11px] text-gray-600">
            <Info className="w-4 h-4 text-[#064E3B] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-semibold text-gray-800">Mandatory Government Notice: </span>
              {result.disclaimer}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};
