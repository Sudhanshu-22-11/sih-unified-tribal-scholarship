// ============================================================
// PUBLIC LANDING PAGE
// Unified Access to Tribal Scholarships | MoTA, Govt. of India
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, BookOpen, Award, Microscope, Globe,
  ArrowRight, ShieldCheck, CheckCircle2, UserCheck, FileText,
  Clock, CreditCard, ChevronRight, Sparkles
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const schemes = [
    {
      id: 'SCH001',
      title: 'Pre-Matric Scholarship',
      code: 'Classes 9 & 10',
      desc: 'Financial support to reduce dropout rates and encourage secondary education among tribal students.',
      benefit: 'Up to ₹7,000 / year + allowances',
      icon: BookOpen,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    {
      id: 'SCH002',
      title: 'Post-Matric Scholarship',
      code: 'Class 11 to PhD',
      desc: 'Comprehensive aid for senior secondary, diploma, ITI, degree, and postgraduate tribal scholars.',
      benefit: 'Course fees + ₹12,000 / year allowance',
      icon: GraduationCap,
      color: 'bg-teal-50 text-teal-800 border-teal-200'
    },
    {
      id: 'SCH003',
      title: 'Top Class Education',
      code: 'IITs / NITs / IIMs / AIIMS',
      desc: 'Full financial funding for meritorious ST students admitted to premier notified national institutions.',
      benefit: 'Full Tuition + ₹48,000 living allowance',
      icon: Award,
      color: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      id: 'SCH004',
      title: 'National Fellowship (NFST)',
      code: 'M.Phil & PhD Programs',
      desc: 'Fellowships aligned with UGC norms to support high-level scientific and academic research among tribal youth.',
      benefit: '₹37,000 / month JRF + HRA & Grants',
      icon: Microscope,
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200'
    },
    {
      id: 'SCH005',
      title: 'National Overseas (NOS)',
      code: 'Masters & PhD Abroad',
      desc: 'Enabling tribal youth to attend top-ranked international universities with tuition, visa, and stipend.',
      benefit: 'Tuition + $15,400 / £9,900 annual allowance',
      icon: Globe,
      color: 'bg-sky-50 text-sky-800 border-sky-200'
    }
  ];

  const steps = [
    { num: '1', title: 'Create Profile', desc: 'One-time registration with masked Aadhaar, APAAR ID, and caste verification.', icon: UserCheck },
    { num: '2', title: 'Check Eligibility', desc: 'Smart rule engine checks income, course, and category in real time.', icon: CheckCircle2 },
    { num: '3', title: 'Submit Documents', desc: 'Fetch verified records directly from DigiLocker and state e-District.', icon: FileText },
    { num: '4', title: 'Apply', desc: 'Pre-filled application form. Enter once, reuse across permissible schemes.', icon: GraduationCap },
    { num: '5', title: 'Track', desc: 'Transparent stage-by-stage verification timeline across institution and state.', icon: Clock },
    { num: '6', title: 'Receive Benefits', desc: 'Direct Benefit Transfer (DBT) directly into your Aadhaar-linked bank account.', icon: CreditCard }
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative bg-[#064E3B] text-white pt-16 pb-20 px-4 overflow-hidden border-b-4 border-[#F8E7C9]">
        {/* Subtle geometric background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#F8E7C9_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#F8E7C9] text-[#064E3B] px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            AAKANKSHA (आकांक्षा) — Ministry of Tribal Affairs Initiative
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            One Platform. <br className="hidden sm:inline" />
            Five Scholarship Schemes. <br />
            <span className="text-[#F8E7C9]">One Connected Student Experience.</span>
          </h1>

          <p className="text-sm sm:text-lg text-emerald-100 max-w-3xl mx-auto leading-relaxed font-normal">
            Unified access to tribal scholarships through a secure, student-friendly digital platform. Check your eligibility, manage verified documents, and track DBT disbursements with ease.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/schemes"
              className="w-full sm:w-auto px-7 py-3.5 bg-[#F8E7C9] hover:bg-white text-[#064E3B] font-bold rounded-xl text-sm transition-all duration-200 shadow-lg flex items-center justify-center gap-2 group"
            >
              <span>Check Eligibility</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-7 py-3.5 bg-emerald-800/80 hover:bg-emerald-800 text-white font-semibold rounded-xl text-sm border border-emerald-600 transition shadow-sm flex items-center justify-center gap-2"
            >
              <span>Student / Officer Login</span>
              <ChevronRight className="w-4 h-4 text-[#F8E7C9]" />
            </Link>
          </div>

          {/* Trust points */}
          <div className="pt-8 border-t border-emerald-800/60 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-emerald-200 text-center">
            <div className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#F8E7C9]" />
              <span>Orchestration Layer</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#F8E7C9]" />
              <span>DigiLocker Integrated</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#F8E7C9]" />
              <span>Direct Benefit Transfer</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F8E7C9]" />
              <span>JAGO AI Assistant</span>
            </div>
          </div>
        </div>
      </section>

      {/* The 5 Schemes Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-[#064E3B] tracking-wider uppercase bg-[#F8E7C9] px-2.5 py-1 rounded">
            Integrated Schemes
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            All 5 MoTA Scholarship Schemes
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            A single, coordinated window for tribal school students, college scholars, premier institute entrants, and overseas aspirants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {schemes.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-[#064E3B] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#064E3B] text-[#F8E7C9] flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1.5">
                    {s.code}
                  </span>
                  <h3 className="font-bold text-sm text-gray-900 mb-2 leading-tight">
                    {s.title}
                  </h3>
                  <p className="text-[11px] text-gray-600 leading-relaxed mb-4">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <p className="text-[10px] font-semibold text-gray-800 mb-2">
                    {s.benefit}
                  </p>
                  <Link
                    to={`/schemes/${s.id}`}
                    className="text-xs font-bold text-[#064E3B] hover:underline flex items-center gap-1"
                  >
                    <span>View Scheme</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works - 6 Steps */}
      <section className="bg-white py-14 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-[#064E3B] uppercase tracking-wider bg-[#F8E7C9] px-2.5 py-1 rounded">
              Simplified Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              From profile verification to direct scholarship disbursement in 6 transparent steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {steps.map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.num}
                  className="bg-[#F8F9FA] rounded-xl p-4 border border-gray-200 flex flex-col items-center text-center relative"
                >
                  <span className="w-7 h-7 rounded-full bg-[#064E3B] text-[#F8E7C9] text-xs font-bold flex items-center justify-center mb-3 shadow-sm">
                    {st.num}
                  </span>
                  <Icon className="w-5 h-5 text-[#064E3B] mb-2" />
                  <h4 className="font-bold text-xs text-gray-900 mb-1">
                    {st.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-snug">
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Architectural Value Proposition */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#064E3B] text-white rounded-2xl p-8 sm:p-10 shadow-lg border border-[#F8E7C9]/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F8E7C9] bg-emerald-900 px-3 py-1 rounded-full">
                Architectural Principle
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold leading-tight">
                Not Replacing Existing Systems. <br />
                <span className="text-[#F8E7C9]">Orchestrating Them Seamlessly.</span>
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                Rather than creating yet another siloed scholarship portal, this application establishes a unified student interface and verification gateway over existing platforms including NSP, SFMP, NFST, NOS, DigiLocker, and PFMS.
              </p>
              <div className="flex flex-wrap gap-2 pt-2 text-xs">
                <span className="bg-emerald-900/80 text-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-700">
                  ✓ One Student Profile
                </span>
                <span className="bg-emerald-900/80 text-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-700">
                  ✓ One Scholarship Dashboard
                </span>
                <span className="bg-emerald-900/80 text-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-700">
                  ✓ One Verification Layer
                </span>
              </div>
            </div>

            <div className="bg-[#04382A] rounded-xl p-6 border border-[#F8E7C9]/20 text-xs space-y-3 font-mono">
              <div className="text-[#F8E7C9] font-bold text-xs uppercase border-b border-white/10 pb-2">
                System Integration Topology
              </div>
              <p className="text-gray-300">
                [Tribal Student (Mobile)]
              </p>
              <p className="text-emerald-400">
                &nbsp;&nbsp;↓ API Gateway & Auth
              </p>
              <p className="text-[#F8E7C9]">
                [Aakanksha Core Services (MoTA)]
              </p>
              <p className="text-emerald-400">
                &nbsp;&nbsp;↓ Smart Verification & Orchestration
              </p>
              <p className="text-gray-300">
                [NSP] [SFMP] [NFST] [NOS] [DigiLocker] [PFMS]
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
