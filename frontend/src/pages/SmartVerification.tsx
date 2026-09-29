// ============================================================
// SMART VERIFICATION MATRIX
// Cross-System Verification Layer & Mismatch Exception Handling
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDemo } from '../context/DemoContext';
import { api } from '../services/api';
import { VerificationEvent } from '../types';
import {
  ShieldCheck, CheckCircle2, AlertTriangle, AlertCircle,
  Clock, ArrowRight, RefreshCw, HelpCircle, ExternalLink,
  Info, Check, Sparkles
} from 'lucide-react';

export const SmartVerificationPage: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const appId = applicationId || 'APP001';
  const { user } = useAuth();
  const { refreshKey, apiFailureStatus } = useDemo();

  const [verifications, setVerifications] = useState<VerificationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestRaised, setRequestRaised] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getVerification(appId)
      .then(res => {
        if (res.success && res.data) setVerifications(res.data);
      })
      .finally(() => setLoading(false));
  }, [appId, user, refreshKey]);

  const handleRaiseRequest = () => {
    setRequestRaised(true);
    setTimeout(() => setRequestRaised(false), 3500);
  };

  const isUdiseDown = !!apiFailureStatus['UDISE+'];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#064E3B] bg-[#F8E7C9] px-2.5 py-0.5 rounded">
              Verification Layer
            </span>
            <span className="text-xs text-gray-400 font-mono">Ref: {appId}</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mt-1">
            Smart Verification Engine
          </h1>
          <p className="text-xs text-gray-500">
            Multi-source automated data matching across authoritative government repositories.
          </p>
        </div>

        <Link
          to={`/applications/${appId}`}
          className="text-xs text-[#064E3B] font-semibold hover:underline flex items-center gap-1"
        >
          <span>View Progress Timeline</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Simulated External API Failure Banner (When toggled in demo controls) */}
      {isUdiseDown && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl space-y-2 text-xs text-rose-900">
          <div className="flex items-center gap-2 font-bold text-rose-800">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>External System Outage: UDISE+ verification service is temporarily unavailable.</span>
          </div>
          <p className="text-[11px] leading-relaxed pl-7 text-rose-700">
            Official rule applied: The system never fabricates successful verification. When an external data provider is offline, the process gracefully flags for manual review or resumes when connected.
          </p>
          <div className="pl-7 flex items-center gap-2 pt-1">
            <button
              onClick={() => alert('Retrying UDISE+ service handshake...')}
              className="bg-rose-700 hover:bg-rose-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
            >
              Retry Connection
            </button>
            <button
              onClick={() => alert('Marked for manual verification by Institution Desk.')}
              className="bg-white border border-rose-300 hover:bg-rose-100 text-rose-900 px-3 py-1.5 rounded-lg text-xs font-semibold"
            >
              Route to Manual Review
            </button>
          </div>
        </div>
      )}

      {/* Notice on Mismatch Handling */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold">Human-Centered Verification Principle</h4>
          <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
            Data discrepancies (such as income variances between student input and municipal records) do <span className="font-bold">NOT</span> result in automatic rejection. Instead, the portal triggers a <span className="font-bold">"Manual Review Required"</span> flag with the option to raise an expedited verification ticket.
          </p>
        </div>
      </div>

      {requestRaised && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Verification review request raised successfully (Ticket GRV-2026-00421 updated).</span>
        </div>
      )}

      {/* Verification Matrix Cards */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between text-xs">
          <span className="font-bold text-gray-700 uppercase tracking-wider">
            Automated Cross-Verification Checklist
          </span>
          <span className="text-gray-500 font-medium">
            Sources: DigiLocker, APAAR, UDISE+, AISHE, e-District, PFMS
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {verifications.map((v) => {
            const isMismatch = v.status === 'mismatch';
            const isVerified = v.status === 'verified';

            return (
              <div
                key={v.id}
                className={`p-5 transition ${isMismatch ? 'bg-amber-50/40' : 'hover:bg-gray-50'}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">{v.category} Verification</span>
                      <span className="text-[10px] font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                        Source: {v.source}
                      </span>
                      {isVerified && (
                        <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Verified
                        </span>
                      )}
                      {isMismatch && (
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-amber-300">
                          <AlertTriangle className="w-3 h-3 text-amber-700" /> Mismatch Detected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{v.details}</p>
                  </div>

                  {v.verifiedAt && (
                    <span className="text-[10px] font-mono text-gray-400 shrink-0">
                      {new Date(v.verifiedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>

                {/* Specific Mismatch Details Display */}
                {isMismatch && v.mismatchDetails && (
                  <div className="mt-3.5 p-3.5 bg-white border border-amber-300 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-900 border-b border-amber-100 pb-1.5">
                      <span>Conflict Analysis: {v.mismatchDetails.field}</span>
                      <span className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold">
                        Manual Review Required
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <span className="text-gray-500 block text-[10px]">Student Profile Input:</span>
                        <span className="font-bold text-gray-900">{v.mismatchDetails.profileValue}</span>
                      </div>
                      <div className="p-2 bg-amber-50 rounded-lg border border-amber-200">
                        <span className="text-amber-800 block text-[10px]">{v.source} Record:</span>
                        <span className="font-bold text-amber-950">{v.mismatchDetails.sourceValue}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <p className="text-[10px] text-gray-500">
                        Difference within normal verification tolerance range.
                      </p>
                      <button
                        onClick={handleRaiseRequest}
                        className="bg-[#064E3B] hover:bg-[#04382A] text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition"
                      >
                        Raise Verification Request
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
