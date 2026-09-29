// ============================================================
// GOVERNMENT PORTAL FOOTER
// ============================================================

import React from 'react';
import { ExternalLink, ShieldCheck, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#032B20] text-gray-300 text-xs border-t border-[#F8E7C9]/20 pt-8 pb-12 mt-16 no-print">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm tracking-wide">
              Aakanksha (आकांक्षा) — Unified Tribal Scholarship Portal
            </span>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            An initiative under the Ministry of Tribal Affairs (MoTA), Government of India, to provide one unified profile, one dashboard, and one verification layer for tribal scholars.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-[#F8E7C9]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Smart India Hackathon 2026 Working Prototype</span>
          </div>
        </div>

        {/* Col 2: Schemes */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-[#F8E7C9]">
            Scholarship Schemes
          </h4>
          <ul className="space-y-1.5 text-[11px]">
            <li className="hover:text-white transition cursor-pointer">1. Pre-Matric Scholarship for ST</li>
            <li className="hover:text-white transition cursor-pointer">2. Post-Matric Scholarship for ST</li>
            <li className="hover:text-white transition cursor-pointer">3. Top Class Education for ST</li>
            <li className="hover:text-white transition cursor-pointer">4. National Fellowship for ST (NFST)</li>
            <li className="hover:text-white transition cursor-pointer">5. National Overseas Scholarship (NOS)</li>
          </ul>
        </div>

        {/* Col 3: Connected Systems (Simulated) */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-[#F8E7C9]">
            Integrated Systems (Simulated)
          </h4>
          <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">NSP <ExternalLink className="w-2.5 h-2.5 opacity-60" /></span>
            <span className="flex items-center gap-1">DigiLocker <ExternalLink className="w-2.5 h-2.5 opacity-60" /></span>
            <span className="flex items-center gap-1">SFMP <ExternalLink className="w-2.5 h-2.5 opacity-60" /></span>
            <span className="flex items-center gap-1">UDISE+ <ExternalLink className="w-2.5 h-2.5 opacity-60" /></span>
            <span className="flex items-center gap-1">NFST <ExternalLink className="w-2.5 h-2.5 opacity-60" /></span>
            <span className="flex items-center gap-1">APAAR <ExternalLink className="w-2.5 h-2.5 opacity-60" /></span>
            <span className="flex items-center gap-1">NOS <ExternalLink className="w-2.5 h-2.5 opacity-60" /></span>
            <span className="flex items-center gap-1">DBT / PFMS <ExternalLink className="w-2.5 h-2.5 opacity-60" /></span>
          </div>
        </div>

        {/* Col 4: Prototype Notice */}
        <div className="space-y-3 bg-[#022119] p-3.5 rounded-lg border border-[#F8E7C9]/10">
          <h4 className="font-semibold text-[#F8E7C9] text-xs flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            Hackathon Notice
          </h4>
          <p className="text-[10px] text-gray-400 leading-normal">
            This platform acts as an orchestration & integration layer over existing government systems. It uses mock adapter services and simulated data for demonstration purposes. Authorised API credentials and government approvals are required for production integration.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2">
        <p>© 2026 Ministry of Tribal Affairs (MoTA), Government of India. All rights reserved.</p>
        <p className="text-[#F8E7C9]">Designed with Emerald Ink (#064E3B) & Champagne (#F8E7C9) Palette</p>
      </div>
    </footer>
  );
};
