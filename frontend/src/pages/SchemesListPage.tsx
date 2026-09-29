// ============================================================
// SCHEMES DIRECTORY PAGE
// Comprehensive Browse & Compare for 5 MoTA Schemes
// ============================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDemo } from '../context/DemoContext';
import { api } from '../services/api';
import { Scheme } from '../types';
import {
  GraduationCap, BookOpen, Award, Microscope, Globe,
  ArrowRight, Sparkles, Filter, Search
} from 'lucide-react';

export const SchemesListPage: React.FC = () => {
  const { user } = useAuth();
  const { refreshKey } = useDemo();

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    api.getSchemes()
      .then(res => {
        if (res.success && res.data) setSchemes(res.data);
      })
      .finally(() => setLoading(false));
  }, [user, refreshKey]);

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

  const filteredSchemes = schemes.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#064E3B] bg-[#F8E7C9] px-2.5 py-0.5 rounded">
            Central Sector Schemes
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
            Ministry of Tribal Affairs Scholarship Schemes
          </h1>
          <p className="text-xs text-gray-500">
            Official guidelines, criteria, and online applications for Scheduled Tribe scholars.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search schemes or courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-1 focus:ring-[#064E3B]"
          />
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => {
          const Icon = getSchemeIcon(scheme.shortName);
          return (
            <div
              key={scheme.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between hover:border-[#064E3B] transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#064E3B] text-[#F8E7C9] flex items-center justify-center font-bold">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    Admin: {scheme.sourceSystem}
                  </span>
                </div>

                <h3 className="font-bold text-base text-gray-900 mb-2 leading-tight">
                  {scheme.name}
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {scheme.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-gray-100 text-xs">
                <div className="flex justify-between py-1 text-[11px] text-gray-600">
                  <span>Income Ceiling:</span>
                  <span className="font-bold text-gray-900">₹{scheme.eligibility.maxIncome.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/schemes/${scheme.id}`}
                    className="flex-1 text-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-2 rounded-xl border border-gray-200 transition"
                  >
                    View Details
                  </Link>

                  <Link
                    to={`/eligibility/${scheme.id}`}
                    className="flex-1 text-center bg-[#064E3B] hover:bg-[#04382A] text-white font-semibold py-2 rounded-xl shadow-sm transition flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#F8E7C9]" />
                    <span>Eligible?</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
