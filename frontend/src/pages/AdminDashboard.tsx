// ============================================================
// ADMIN DASHBOARD
// National MoTA Analytics, Verification Pipeline & Monitoring
// ============================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDemo } from '../context/DemoContext';
import { api } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Shield, Users, FileText, CheckCircle2, Clock, AlertTriangle,
  IndianRupee, Filter, ArrowUpRight, Search, Sparkles
} from 'lucide-react';

const COLORS = ['#064E3B', '#059669', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#EF4444'];

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { refreshKey } = useDemo();

  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedScheme, setSelectedScheme] = useState('all');
  const [selectedState, setSelectedState] = useState('all');

  useEffect(() => {
    setLoading(true);
    api.getAdminAnalytics()
      .then(res => {
        if (res.success && res.data) setAnalytics(res.data);
      })
      .finally(() => setLoading(false));
  }, [user, refreshKey]);

  if (loading && !analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-gray-500">
        <Sparkles className="w-6 h-6 text-[#064E3B] animate-spin mx-auto mb-2" />
        Aggregating national MoTA analytics & verification streams...
      </div>
    );
  }

  const kpis = [
    { label: 'Total Applications', value: analytics?.totalApplications || 5, color: 'text-gray-900', icon: FileText },
    { label: 'Pending Verification', value: analytics?.pendingVerification || 2, color: 'text-amber-800', icon: Clock },
    { label: 'Approved by MoTA', value: analytics?.approved || 1, color: 'text-emerald-800', icon: CheckCircle2 },
    { label: 'Sanctioned Orders', value: analytics?.sanctioned || 1, color: 'text-teal-800', icon: Shield },
    { label: 'DBT Disbursed', value: analytics?.disbursed || 1, color: 'text-[#064E3B]', icon: IndianRupee },
    { label: 'Action Required', value: analytics?.actionRequired || 1, color: 'text-rose-800', icon: AlertTriangle },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#064E3B] bg-[#F8E7C9] px-2.5 py-0.5 rounded">
              MoTA Headquarters Admin Portal
            </span>
            <span className="text-xs text-gray-400">National Real-Time View</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
            Scholarship Operations & Analytics
          </h1>
          <p className="text-xs text-gray-500">
            Monitoring Pre-Matric, Post-Matric, Top Class, NFST, and NOS cross-system processing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/beneficiary-gap"
            className="bg-[#064E3B] hover:bg-[#04382A] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition"
          >
            <Users className="w-4 h-4 text-[#F8E7C9]" />
            <span>Beneficiary Gap Detection</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#F8E7C9]" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-bold uppercase tracking-wider">{k.label}</span>
                <Icon className="w-4 h-4 text-gray-400" />
              </div>
              <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Applications by Scheme */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700">
              Applications by Scheme
            </h3>
            <span className="text-[11px] text-gray-500 font-mono">Real-Time Distribution</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.byScheme || []}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#064E3B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: State-Wise Performance */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700">
              State-Wise Applications & Disbursals
            </h3>
            <span className="text-[11px] text-gray-500 font-mono">Sample Focus States</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.byState || []}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                <Bar dataKey="applications" fill="#0F52BA" radius={[6, 6, 0, 0]} name="Applications" />
                <Bar dataKey="disbursed" fill="#064E3B" radius={[6, 6, 0, 0]} name="Disbursed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Exception & Verification Management Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden space-y-3 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-bold text-sm text-gray-900">
              Recent Verification Exceptions & Status
            </h3>
            <p className="text-xs text-gray-500">
              Identified discrepancies requiring departmental or institutional officer review.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              aria-label="Filter by State"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="p-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs"
            >
              <option value="all">All States</option>
              <option value="jharkhand">Jharkhand</option>
              <option value="odisha">Odisha</option>
              <option value="mp">Madhya Pradesh</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-3">Application ID</th>
                <th className="py-3 px-3">Scholar Name</th>
                <th className="py-3 px-3">Scheme</th>
                <th className="py-3 px-3">State / District</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Exception Note</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-3 font-mono font-bold text-[#064E3B]">APP001</td>
                <td className="py-3 px-3 font-semibold text-gray-900">Rahul Kumar</td>
                <td className="py-3 px-3">Post-Matric</td>
                <td className="py-3 px-3">Jharkhand (W. Singhbhum)</td>
                <td className="py-3 px-3">
                  <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                    MoTA Review
                  </span>
                </td>
                <td className="py-3 px-3 text-amber-800">Income mismatch (₹1.80L vs ₹1.95L)</td>
                <td className="py-3 px-3 text-right">
                  <Link
                    to="/verification/APP001"
                    className="text-[#064E3B] font-bold hover:underline"
                  >
                    Review
                  </Link>
                </td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="py-3 px-3 font-mono font-bold text-[#064E3B]">APP002</td>
                <td className="py-3 px-3 font-semibold text-gray-900">Priya Munda</td>
                <td className="py-3 px-3">Post-Matric</td>
                <td className="py-3 px-3">Odisha (Sundargarh)</td>
                <td className="py-3 px-3">
                  <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">
                    Disbursed
                  </span>
                </td>
                <td className="py-3 px-3 text-emerald-800">None — Verified via DigiLocker</td>
                <td className="py-3 px-3 text-right">
                  <Link
                    to="/applications/APP002"
                    className="text-[#064E3B] font-bold hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="py-3 px-3 font-mono font-bold text-[#064E3B]">APP005</td>
                <td className="py-3 px-3 font-semibold text-gray-900">Vikash Gond</td>
                <td className="py-3 px-3">NFST (Fellowship)</td>
                <td className="py-3 px-3">Madhya Pradesh (Mandla)</td>
                <td className="py-3 px-3">
                  <span className="bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded text-[10px]">
                    Under Verification
                  </span>
                </td>
                <td className="py-3 px-3 text-rose-800">Research proposal needs revision</td>
                <td className="py-3 px-3 text-right">
                  <Link
                    to="/applications/APP005"
                    className="text-[#064E3B] font-bold hover:underline"
                  >
                    Inspect
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
