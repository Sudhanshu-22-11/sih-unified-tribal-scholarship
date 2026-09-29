// ============================================================
// APPLICATION TRACKING & VERTICAL TIMELINE
// Transparent Step-by-Step Progress Tracking
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDemo } from '../context/DemoContext';
import { api } from '../services/api';
import { Application, ApplicationTimelineEvent } from '../types';
import {
  CheckCircle2, Clock, Circle, AlertTriangle, ArrowRight,
  ShieldCheck, FileText, CreditCard, Sparkles, Building, ChevronLeft
} from 'lucide-react';

export const ApplicationTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { refreshKey } = useDemo();

  const [application, setApplication] = useState<Application | null>(null);
  const [timeline, setTimeline] = useState<ApplicationTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      Promise.all([
        api.getApplication(id),
        api.getApplicationTimeline(id)
      ])
        .then(([appRes, tlRes]) => {
          if (appRes.success && appRes.data) setApplication(appRes.data);
          if (tlRes.success && tlRes.data) setTimeline(tlRes.data);
        })
        .finally(() => setLoading(false));
    }
  }, [id, user, refreshKey]);

  if (loading && !application) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-gray-500">
        <Sparkles className="w-6 h-6 text-[#064E3B] animate-spin mx-auto mb-2" />
        Loading application progress timeline...
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-2">
        <h2 className="text-base font-bold text-gray-800">Application Not Found</h2>
        <Link to="/applications" className="text-xs text-[#064E3B] underline block">
          Back to Applications List
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/applications"
          className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-[#064E3B] font-medium transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </Link>
      </div>

      {/* Header Application Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#064E3B] bg-emerald-50 px-2.5 py-1 rounded">
              {application.id}
            </span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-600 font-medium">AY {application.academicYear}</span>
          </div>

          <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
            Current Status: {application.status.replace('_', ' ')}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          {application.schemeName}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>Applied: {new Date(application.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <span>Last Updated: {new Date(application.lastUpdated).toLocaleString('en-IN')}</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            to={`/verification/${application.id}`}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-[#064E3B]" />
            <span>Smart Verification Matrix</span>
          </Link>

          <Link
            to={`/payments/${application.id}`}
            className="bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] text-xs font-semibold px-4 py-2 rounded-xl border border-emerald-200 transition flex items-center gap-1.5"
          >
            <CreditCard className="w-4 h-4 text-[#064E3B]" />
            <span>DBT / Payment Tracking</span>
          </Link>
        </div>
      </div>

      {/* Vertical Verification & Disbursement Timeline as required */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="font-bold text-sm text-gray-900 tracking-tight">
            Lifecycle & Verification Timeline
          </h3>
          <span className="text-[11px] text-gray-500 font-medium">
            Multi-tier Government Verification
          </span>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-[19px] sm:before:left-[27px] before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
          {timeline.map((event, index) => {
            const isCompleted = event.completed;
            const isCurrent = event.current;

            return (
              <div key={event.id || index} className="relative flex items-start gap-4">
                {/* Timeline Icon Marker */}
                <div
                  className={`absolute -left-[27px] sm:-left-[35px] w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : isCurrent ? (
                    <Clock className="w-3.5 h-3.5" />
                  ) : (
                    <Circle className="w-2.5 h-2.5" />
                  )}
                </div>

                {/* Event Content */}
                <div className={`p-4 rounded-xl border transition-all w-full ${
                  isCurrent
                    ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                    : isCompleted
                    ? 'bg-white border-gray-200'
                    : 'bg-gray-50/60 border-gray-100 opacity-60'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 flex items-center gap-2">
                      <span>{event.label}</span>
                      {isCompleted && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                          Completed
                        </span>
                      )}
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-200 px-1.5 py-0.2 rounded">
                          Under Processing
                        </span>
                      )}
                    </h4>

                    {event.timestamp && (
                      <span className="text-[10px] font-mono text-gray-400">
                        {new Date(event.timestamp).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
