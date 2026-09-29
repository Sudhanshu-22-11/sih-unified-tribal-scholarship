// ============================================================
// UNIFIED SCHOLARSHIP DASHBOARD
// Student Main Overview & 5 Scheme Cards
// ============================================================

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDemo } from '../context/DemoContext';
import { api } from '../services/api';
import { StudentProfile, Scheme, Application } from '../types';
import {
  GraduationCap, CheckCircle2, Clock, AlertTriangle, ArrowRight,
  FileText, ShieldCheck, UserCheck, CreditCard, Sparkles, ChevronRight,
  BookOpen, Award, Microscope, Globe, Eye
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { refreshKey } = useDemo();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profRes, schemesRes, appsRes] = await Promise.all([
          api.getProfile(),
          api.getSchemes(),
          api.getApplications()
        ]);
        if (profRes.success) setProfile(profRes.data);
        if (schemesRes.success) setSchemes(schemesRes.data);
        if (appsRes.success) setApplications(appsRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, refreshKey]);

  // Derived counts for the dashboard header
  const underVerificationCount = applications.filter(a =>
    ['submitted', 'under_verification', 'institution_verified', 'state_verified', 'mota_review'].includes(a.status)
  ).length;

  const activeCount = applications.filter(a =>
    ['approved', 'sanctioned', 'disbursed'].includes(a.status)
  ).length;

  const potentiallyEligibleCount = schemes.filter(s =>
    s.studentStatus?.status === 'potentially_eligible' || s.studentStatus?.status === 'eligible'
  ).length;

  const notAppliedCount = schemes.filter(s =>
    !s.studentStatus || s.studentStatus.status === 'not_applied'
  ).length;

  const getStatusBadge = (statusStr: string) => {
    switch (statusStr) {
      case 'mota_review':
      case 'under_verification':
      case 'institution_verified':
      case 'state_verified':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
          <Clock className="w-3 h-3 text-amber-700" />
          Under Verification
        </span>;
      case 'active':
      case 'disbursed':
      case 'sanctioned':
      case 'approved':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
          Active Benefit
        </span>;
      case 'potentially_eligible':
      case 'eligible':
        return <span className="bg-[#F8E7C9] text-[#064E3B] border border-[#E9C274] font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#064E3B]" />
          Potentially Eligible
        </span>;
      case 'not_applicable':
        return <span className="bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded text-[11px]">
          Not Applicable
        </span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
          Not Applied
        </span>;
    }
  };

  const getSchemeIcon = (shortName: string) => {
    switch (shortName) {
      case 'Pre-Matric': return BookOpen;
      case 'Post-Matric': return GraduationCap;
      case 'Top Class': return Award;
      case 'NFST': return Microscope;
      case 'NOS': return Globe;
      default: return GraduationCap;
    }
  };

  if (loading && !profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-sm text-gray-500">
        <Sparkles className="w-6 h-6 text-[#064E3B] animate-spin mx-auto mb-2" />
        Loading unified dashboard records...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#064E3B] to-[#04382A] text-white rounded-2xl p-6 sm:p-8 shadow-md border border-[#F8E7C9]/30 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#F8E7C9] text-[#064E3B] text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                Verified ST Scholar
              </span>
              <span className="text-emerald-200 text-xs">
                APAAR: {profile?.apaarId}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome, {profile?.name || user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              {profile?.institution} • {profile?.course} ({profile?.academicYear})
            </p>
          </div>

          {/* Profile Completion Card */}
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 min-w-[240px] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-100 font-medium">Profile Completion</span>
              <span className="font-bold text-[#F8E7C9] text-sm">{profile?.profileCompletion || 92}%</span>
            </div>
            <div className="w-full bg-emerald-950/60 rounded-full h-2 overflow-hidden border border-white/10">
              <div
                className="bg-[#F8E7C9] h-2 rounded-full transition-all duration-500"
                style={{ width: `${profile?.profileCompletion || 92}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className="text-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                Aadhaar & ST Verified
              </span>
              <Link to="/profile" className="text-[#F8E7C9] hover:underline font-semibold">
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Status Strip as requested */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Active Benefits</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-emerald-800">{activeCount} Active</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Under Verification</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-amber-800">{underVerificationCount} Review</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Potentially Eligible</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#064E3B]">{potentiallyEligibleCount} Schemes</span>
            <Sparkles className="w-5 h-5 text-[#064E3B]" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Not Applied</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-gray-700">{notAppliedCount} Schemes</span>
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Cross-System Existing Benefit Check Banner */}
      <div className="bg-[#F8E7C9]/40 border border-[#F8E7C9] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#064E3B] text-[#F8E7C9] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-gray-900 block text-xs">
              Existing Benefit Check Active
            </span>
            <p className="text-gray-600 text-[11px]">
              Cross-system lookup across NSP, SFMP, and State portals confirms your current records to prevent conflicting applications.
            </p>
          </div>
        </div>
        <Link
          to="/applications"
          className="text-xs font-bold text-[#064E3B] bg-white border border-[#064E3B]/20 hover:bg-[#064E3B] hover:text-white px-3 py-1.5 rounded-lg transition shrink-0"
        >
          View Benefit Audit
        </Link>
      </div>

      {/* The 5 Scheme Cards Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Tribal Scholarship Schemes Overview
            </h2>
            <p className="text-xs text-gray-500">
              One unified window across all 5 Government of India schemes for ST scholars.
            </p>
          </div>
          <Link
            to="/schemes"
            className="text-xs font-semibold text-[#064E3B] hover:underline flex items-center gap-1"
          >
            <span>Compare Schemes</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schemes.map((scheme) => {
            const Icon = getSchemeIcon(scheme.shortName);
            const statusInfo = scheme.studentStatus?.status || 'not_applied';
            const hasApplication = !!scheme.studentStatus?.applicationId;

            return (
              <div
                key={scheme.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between hover:border-[#064E3B] transition-all"
              >
                <div>
                  {/* Top Bar with Icon & Status */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#064E3B] text-[#F8E7C9] flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>{getStatusBadge(statusInfo)}</div>
                  </div>

                  <span className="text-[10px] text-gray-500 font-mono">
                    System: {scheme.sourceSystem}
                  </span>

                  <h3 className="font-bold text-sm text-gray-900 mt-1 mb-1.5 leading-snug">
                    {scheme.name}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                    {scheme.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-2.5">
                  <div className="text-[11px] text-gray-700 flex justify-between">
                    <span className="text-gray-500">Income Limit:</span>
                    <span className="font-semibold">₹{scheme.eligibility.maxIncome.toLocaleString()} / year</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      to={`/eligibility/${scheme.id}`}
                      className="flex-1 text-center bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-semibold py-2 px-3 rounded-lg border border-gray-200 transition"
                    >
                      Check Eligibility
                    </Link>

                    {hasApplication ? (
                      <Link
                        to={`/applications/${scheme.studentStatus?.applicationId}`}
                        className="flex-1 text-center bg-[#064E3B] hover:bg-[#04382A] text-white text-xs font-semibold py-2 px-3 rounded-lg transition shadow-sm flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#F8E7C9]" />
                        <span>Track</span>
                      </Link>
                    ) : statusInfo !== 'not_applicable' ? (
                      <Link
                        to={`/apply/${scheme.id}`}
                        className="flex-1 text-center bg-[#064E3B] hover:bg-[#04382A] text-white text-xs font-semibold py-2 px-3 rounded-lg transition shadow-sm flex items-center justify-center gap-1"
                      >
                        <span>Apply</span>
                        <ArrowRight className="w-3 h-3 text-[#F8E7C9]" />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="flex-1 text-center bg-gray-100 text-gray-400 text-xs font-medium py-2 px-3 rounded-lg cursor-not-allowed"
                      >
                        Ineligible
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <Link
          to="/documents"
          className="bg-white p-4 rounded-xl border border-gray-200 hover:border-emerald-700 shadow-sm flex items-center gap-3 transition group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-gray-900 group-hover:text-[#064E3B]">
              Digital Document Wallet
            </h4>
            <p className="text-[11px] text-gray-500">
              Fetch from DigiLocker & manage 8 certificates
            </p>
          </div>
        </Link>

        <Link
          to="/verification"
          className="bg-white p-4 rounded-xl border border-gray-200 hover:border-emerald-700 shadow-sm flex items-center gap-3 transition group"
        >
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-gray-900 group-hover:text-[#064E3B]">
              Smart Verification Matrix
            </h4>
            <p className="text-[11px] text-gray-500">
              Cross-checked with APAAR, UDISE+ & e-District
            </p>
          </div>
        </Link>

        <Link
          to="/payments"
          className="bg-white p-4 rounded-xl border border-gray-200 hover:border-emerald-700 shadow-sm flex items-center gap-3 transition group"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-gray-900 group-hover:text-[#064E3B]">
              Payment & DBT Tracker
            </h4>
            <p className="text-[11px] text-gray-500">
              PFMS sanction orders & bank credit receipts
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};
