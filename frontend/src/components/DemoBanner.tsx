// ============================================================
// DEMO BANNER COMPONENT
// Prominent jury demonstration controls for SIH 2026
// ============================================================

import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { PlayCircle, RefreshCw, AlertTriangle, CheckCircle, Shield, ChevronDown, ChevronUp, UserCheck } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { isDemoMode, simulateStatus, toggleApiFailure, apiFailureStatus, resetDemoData, lastActionMessage } = useDemo();
  const { user, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!isDemoMode) return null;

  return (
    <div className="bg-[#064E3B] text-white border-b border-[#F8E7C9]/20 text-xs">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-[#F8E7C9] text-[#064E3B] font-bold px-2 py-0.5 rounded text-[11px] tracking-wider uppercase flex items-center gap-1 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
            SIH 2026 Demo Mode
          </span>
          <span className="hidden sm:inline text-gray-200">
            Simulated Orchestration Layer (Mock NSP, SFMP, NFST, NOS, DigiLocker, PFMS)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick User Switcher */}
          <div className="flex items-center gap-1 bg-[#065F46] px-2 py-1 rounded border border-[#F8E7C9]/30">
            <UserCheck className="w-3.5 h-3.5 text-[#F8E7C9]" />
            <select
              aria-label="Switch User Profile"
              className="bg-transparent text-white text-[11px] focus:outline-none cursor-pointer"
              value={user?.id || 'STU001'}
              onChange={(e) => switchRole('student', e.target.value)}
            >
              {Object.entries(DEMO_USERS).map(([id, info]) => (
                <option key={id} value={id} className="text-gray-900 bg-white">
                  {info.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 bg-[#F8E7C9] text-[#064E3B] hover:bg-white font-medium px-2.5 py-1 rounded transition-colors"
          >
            <span>Demo Controls</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Jury Controls Drawer */}
      {isOpen && (
        <div className="bg-[#04382A] border-t border-[#F8E7C9]/10 px-4 py-3">
          <div className="max-w-7xl mx-auto space-y-3">
            {lastActionMessage && (
              <div className="p-2 bg-[#065F46] border border-[#F8E7C9]/40 rounded text-[#F8E7C9] flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{lastActionMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Simulation 1: Application Lifecycle */}
              <div className="bg-[#064E3B]/70 p-2.5 rounded border border-white/10">
                <p className="font-semibold text-[#F8E7C9] mb-1.5 flex items-center gap-1.5">
                  <PlayCircle className="w-3.5 h-3.5" />
                  Simulate Lifecycle (APP001 - Rahul)
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => simulateStatus('APP001', 'verify')}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white px-2 py-1 rounded text-[11px]"
                  >
                    1. State Verify
                  </button>
                  <button
                    onClick={() => simulateStatus('APP001', 'approve')}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white px-2 py-1 rounded text-[11px]"
                  >
                    2. MoTA Approve
                  </button>
                  <button
                    onClick={() => simulateStatus('APP001', 'sanction')}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white px-2 py-1 rounded text-[11px]"
                  >
                    3. Sanction ₹18k
                  </button>
                  <button
                    onClick={() => simulateStatus('APP001', 'disburse')}
                    className="bg-[#F8E7C9] text-[#064E3B] font-semibold hover:bg-white px-2 py-1 rounded text-[11px]"
                  >
                    4. DBT Disburse
                  </button>
                </div>
              </div>

              {/* Simulation 2: API Resilience & External Failures */}
              <div className="bg-[#064E3B]/70 p-2.5 rounded border border-white/10">
                <p className="font-semibold text-[#F8E7C9] mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  External API Failure Testing
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => toggleApiFailure('UDISE+')}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                      apiFailureStatus['UDISE+']
                        ? 'bg-rose-600 text-white hover:bg-rose-500'
                        : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-900 border border-white/20'
                    }`}
                  >
                    UDISE+: {apiFailureStatus['UDISE+'] ? '🔴 Failing' : '🟢 Online'}
                  </button>
                  <button
                    onClick={() => toggleApiFailure('DigiLocker')}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                      apiFailureStatus['DigiLocker']
                        ? 'bg-rose-600 text-white hover:bg-rose-500'
                        : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-900 border border-white/20'
                    }`}
                  >
                    DigiLocker: {apiFailureStatus['DigiLocker'] ? '🔴 Failing' : '🟢 Online'}
                  </button>
                  <button
                    onClick={() => toggleApiFailure('e-District')}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                      apiFailureStatus['e-District']
                        ? 'bg-rose-600 text-white hover:bg-rose-500'
                        : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-900 border border-white/20'
                    }`}
                  >
                    e-District: {apiFailureStatus['e-District'] ? '🔴 Failing' : '🟢 Online'}
                  </button>
                </div>
              </div>

              {/* Simulation 3: Reset & Quick Jump */}
              <div className="bg-[#064E3B]/70 p-2.5 rounded border border-white/10 flex flex-col justify-between">
                <div>
                  <p className="font-semibold text-[#F8E7C9] mb-1.5 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    Reset & Presentation Control
                  </p>
                  <p className="text-[10px] text-gray-300">
                    Restores all fictional applications, payments, and notifications to original demo state.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={resetDemoData}
                    className="flex items-center gap-1.5 bg-rose-700 hover:bg-rose-600 text-white px-2.5 py-1 rounded font-medium text-[11px]"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset Demo Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
