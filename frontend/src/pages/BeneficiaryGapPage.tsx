// ============================================================
// BENEFICIARY GAP DETECTION & PROACTIVE OUTREACH
// Cross-System Data Matching to Reach the Unreached
// ============================================================

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDemo } from '../context/DemoContext';
import { api } from '../services/api';
import { BeneficiaryCandidate } from '../types';
import {
  Users, Search, Send, CheckCircle2, ArrowRight, ShieldCheck,
  Database, Network, Sparkles, Filter, ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const BeneficiaryGapPage: React.FC = () => {
  const { user } = useAuth();
  const { refreshKey } = useDemo();

  const [candidates, setCandidates] = useState<BeneficiaryCandidate[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [outreachSuccess, setOutreachSuccess] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.getBeneficiaryGap()
      .then(res => {
        if (res.success && res.data) {
          setCandidates(res.data.candidates);
          setStats(res.data.stats);
        }
      })
      .finally(() => setLoading(false));
  }, [user, refreshKey]);

  const handleSendGuidance = async (candidateId: string, studentName: string) => {
    try {
      const res = await api.sendOutreach(candidateId, 'SMS / WhatsApp Bot');
      if (res.success) {
        setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status: 'outreach_sent' } : c));
        setOutreachSuccess(`Targeted scholarship guidance dispatched to ${studentName} via SMS & WhatsApp.`);
        setTimeout(() => setOutreachSuccess(null), 3500);
      }
    } catch {
      alert('Failed to send outreach');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div>
        <Link
          to="/admin"
          className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-[#064E3B] font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Operations Dashboard</span>
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#064E3B] bg-[#F8E7C9] px-2.5 py-0.5 rounded">
            MoTA Proactive Inclusion
          </span>
          <span className="text-xs text-gray-400">Zero Exclusion Engine</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Beneficiary Gap Detection & Outreach
        </h1>
        <p className="text-xs text-gray-600 max-w-3xl leading-relaxed">
          Cross-matching school/higher education enrollment records against scholarship beneficiaries to identify tribal students who are potentially eligible but have not yet applied.
        </p>
      </div>

      {/* Cross-Matching Topology Card */}
      <div className="bg-[#064E3B] text-white rounded-2xl p-6 border border-[#F8E7C9]/30 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#F8E7C9] flex items-center gap-1.5">
          <Network className="w-4 h-4" />
          Cross-System Ingestion & Matching Pipeline
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono pt-2">
          <div className="bg-emerald-950 p-2.5 rounded-lg border border-emerald-700 text-center flex-1 min-w-[120px]">
            <span className="text-[#F8E7C9] font-bold block">UDISE+</span>
            <span className="text-[10px] text-gray-300">School Enrollment</span>
          </div>
          <span className="text-[#F8E7C9] font-bold">+</span>
          <div className="bg-emerald-950 p-2.5 rounded-lg border border-emerald-700 text-center flex-1 min-w-[120px]">
            <span className="text-[#F8E7C9] font-bold block">APAAR</span>
            <span className="text-[10px] text-gray-300">Student ID Registry</span>
          </div>
          <span className="text-[#F8E7C9] font-bold">+</span>
          <div className="bg-emerald-950 p-2.5 rounded-lg border border-emerald-700 text-center flex-1 min-w-[120px]">
            <span className="text-[#F8E7C9] font-bold block">OTR / AISHE</span>
            <span className="text-[10px] text-gray-300">Higher Ed Records</span>
          </div>
          <span className="text-[#F8E7C9] font-bold">+</span>
          <div className="bg-emerald-950 p-2.5 rounded-lg border border-emerald-700 text-center flex-1 min-w-[120px]">
            <span className="text-[#F8E7C9] font-bold block">NSP / SFMP</span>
            <span className="text-[10px] text-gray-300">Active Beneficiaries</span>
          </div>
        </div>

        <div className="text-center pt-1 text-xs text-emerald-200">
          ↓ Cross-matched via Automated Fuzzy Matching & Category Mapping ↓
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Students Analysed</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {stats?.studentsAnalysed?.toLocaleString() || '24,680'}
          </p>
          <span className="text-[10px] text-gray-400">Total UDISE+ / APAAR records</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Potentially Eligible</span>
          <p className="text-2xl font-bold text-emerald-800 mt-1">
            {stats?.potentiallyEligible?.toLocaleString() || '3,240'}
          </p>
          <span className="text-[10px] text-emerald-600">Meets income & ST category</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Already Benefited</span>
          <p className="text-2xl font-bold text-blue-800 mt-1">
            {stats?.alreadyReceivingBenefits?.toLocaleString() || '2,610'}
          </p>
          <span className="text-[10px] text-blue-600">Active NSP / State scholarship</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-amber-300 bg-amber-50/50 shadow-sm">
          <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">Potentially Unreached</span>
          <p className="text-2xl font-bold text-amber-900 mt-1">
            {stats?.potentiallyUnreached?.toLocaleString() || '630'}
          </p>
          <span className="text-[10px] text-amber-700 font-semibold">Priority target for outreach</span>
        </div>
      </div>

      {outreachSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{outreachSuccess}</span>
        </div>
      )}

      {/* Candidate Outreach Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-bold text-sm text-gray-900">
              Identified Tribal Candidates (Sample Batch)
            </h3>
            <p className="text-xs text-gray-500">
              Filtered for students with zero recorded scholarship benefits in current academic cycle.
            </p>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            Showing {candidates.length} Priority Candidates
          </span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">State / District</th>
                <th className="py-3 px-3">Education Level</th>
                <th className="py-3 px-3">Data Source</th>
                <th className="py-3 px-3">Potential Scheme</th>
                <th className="py-3 px-3">Current Benefit</th>
                <th className="py-3 px-3 text-right">Outreach Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {candidates.map((c) => {
                const isSent = c.status === 'outreach_sent';

                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="py-3 px-3 font-semibold text-gray-900">{c.studentName}</td>
                    <td className="py-3 px-3 text-gray-600">{c.state} ({c.district})</td>
                    <td className="py-3 px-3">{c.educationLevel}</td>
                    <td className="py-3 px-3 font-mono text-[10px] text-gray-500">{c.dataSource}</td>
                    <td className="py-3 px-3 font-semibold text-[#064E3B]">{c.potentialScheme}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.currentBenefit === 'None' ? 'bg-amber-100 text-amber-900' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {c.currentBenefit}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {isSent ? (
                        <span className="text-[11px] text-emerald-700 font-bold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Guidance Sent
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSendGuidance(c.id, c.studentName)}
                          className="bg-[#064E3B] hover:bg-[#04382A] text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1 ml-auto"
                        >
                          <Send className="w-3 h-3 text-[#F8E7C9]" />
                          <span>Send Guidance</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
