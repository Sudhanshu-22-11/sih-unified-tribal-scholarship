// ============================================================
// APPLICATIONS LIST PAGE
// All Student Applications with Status Filters
// ============================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDemo } from '../context/DemoContext';
import { api } from '../services/api';
import { Application } from '../types';
import {
  FileText, Clock, CheckCircle2, AlertTriangle, ArrowRight,
  Eye, Calendar, Filter, Sparkles
} from 'lucide-react';

export const ApplicationsListPage: React.FC = () => {
  const { user } = useAuth();
  const { refreshKey } = useDemo();

  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getApplications()
      .then(res => {
        if (res.success && res.data) setApplications(res.data);
      })
      .finally(() => setLoading(false));
  }, [user, refreshKey]);

  const filteredApps = applications.filter(app => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['approved', 'sanctioned', 'disbursed'].includes(app.status);
    if (filter === 'pending') return ['submitted', 'under_verification', 'institution_verified', 'state_verified', 'mota_review'].includes(app.status);
    if (filter === 'completed') return app.status === 'disbursed';
    if (filter === 'action') return app.status === 'action_required' || app.deficiencies.length > 0;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'mota_review':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded text-[11px]">MoTA Review</span>;
      case 'state_verified':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded text-[11px]">State Verified</span>;
      case 'institution_verified':
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 font-bold px-2 py-0.5 rounded text-[11px]">Institution Verified</span>;
      case 'disbursed':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded text-[11px]">DBT Disbursed</span>;
      case 'sanctioned':
        return <span className="bg-teal-100 text-teal-900 border border-teal-300 font-bold px-2 py-0.5 rounded text-[11px]">Sanctioned</span>;
      case 'approved':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded text-[11px]">Approved</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 border border-gray-300 font-bold px-2 py-0.5 rounded text-[11px] capitalize">{status.replace('_', ' ')}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Unified Application Tracking</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Single view tracking across all 5 MoTA scholarship schemes.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-gray-100 p-1.5 rounded-xl text-xs">
          {['all', 'active', 'pending', 'completed', 'action'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition ${
                filter === f
                  ? 'bg-white text-[#064E3B] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {f === 'action' ? 'Action Required' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center text-xs text-gray-500">
          <Sparkles className="w-6 h-6 text-[#064E3B] animate-spin mx-auto mb-2" />
          Loading your scholarship applications...
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center space-y-3">
          <FileText className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-bold text-sm text-gray-800">No applications match this filter</h3>
          <p className="text-xs text-gray-500">Check eligible schemes and start a new application.</p>
          <Link
            to="/schemes"
            className="inline-flex items-center gap-1.5 bg-[#064E3B] text-white px-4 py-2 rounded-xl text-xs font-semibold"
          >
            Explore Schemes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 hover:border-[#064E3B] transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded">
                    {app.id}
                  </span>
                  {getStatusBadge(app.status)}
                  <span className="text-[11px] text-gray-400">
                    AY: {app.academicYear}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900">
                  {app.schemeName}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    Applied: {new Date(app.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span>
                    Last Updated: {new Date(app.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {app.deficiencies.length > 0 && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>Deficiency: {app.deficiencies.join(', ')}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/verification/${app.id}`}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition"
                >
                  Verification Matrix
                </Link>

                <Link
                  to={`/applications/${app.id}`}
                  className="bg-[#064E3B] hover:bg-[#04382A] text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-sm flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-[#F8E7C9]" />
                  <span>View Timeline</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
