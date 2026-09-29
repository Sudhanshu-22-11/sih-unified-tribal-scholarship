// ============================================================
// GRIEVANCE & HELP DESK PAGE
// Student Support & Issue Ticketing
// ============================================================

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDemo } from '../context/DemoContext';
import { api } from '../services/api';
import { GrievanceTicket } from '../types';
import {
  HelpCircle, Send, CheckCircle2, Clock, AlertCircle,
  FileQuestion, Ticket, ChevronRight, MessageSquare
} from 'lucide-react';

export const GrievancePage: React.FC = () => {
  const { user } = useAuth();
  const { refreshKey, triggerRefresh } = useDemo();

  const [tickets, setTickets] = useState<GrievanceTicket[]>([]);
  const [category, setCategory] = useState('Verification Issue');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successTicket, setSuccessTicket] = useState<string | null>(null);

  useEffect(() => {
    api.getGrievances().then(res => {
      if (res.success && res.data) setTickets(res.data);
    });
  }, [user, refreshKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;
    setSubmitting(true);
    try {
      const res = await api.submitGrievance(category, subject, description);
      if (res.success && res.data) {
        setTickets(prev => [res.data, ...prev]);
        setSuccessTicket(res.data.ticketId);
        setSubject('');
        setDescription('');
        triggerRefresh();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#064E3B]" />
          <h1 className="text-xl font-bold text-gray-900">Grievance & Help Desk</h1>
        </div>
        <p className="text-xs text-gray-500">
          Submit queries, report discrepancies, or request manual review for your scholarship applications.
        </p>
      </div>

      {successTicket && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Ticket Registered Successfully</p>
              <p className="text-[11px] text-emerald-700">Ticket ID: <span className="font-mono font-bold">{successTicket}</span></p>
            </div>
          </div>
          <button onClick={() => setSuccessTicket(null)} className="text-xs text-emerald-800 font-semibold underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Ticket Creation Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
          Submit New Support Ticket
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Issue Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
            >
              <option value="Application Issue">Application Issue</option>
              <option value="Document Issue">Document Issue</option>
              <option value="Verification Issue">Verification Issue</option>
              <option value="Payment Issue">Payment Issue</option>
              <option value="Eligibility Query">Eligibility Query</option>
              <option value="Technical Issue">Technical Issue</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Subject / Summary</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Income certificate mismatch clarification"
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-gray-700 mb-1">Detailed Description</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide specific details about your query or the documents involved..."
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
            ></textarea>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#064E3B] hover:bg-[#04382A] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition"
          >
            <Send className="w-3.5 h-3.5 text-[#F8E7C9]" />
            <span>{submitting ? 'Registering...' : 'Register Grievance'}</span>
          </button>
        </div>
      </form>

      {/* Existing Tickets List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-4">
        <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-3">
          Your Registered Grievances ({tickets.length})
        </h3>

        {tickets.length === 0 ? (
          <p className="text-xs text-gray-400 py-4 text-center">No active grievances logged.</p>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {t.ticketId}
                    </span>
                    <span className="font-bold text-gray-900">{t.subject}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    t.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {t.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-gray-600 text-[11px] leading-relaxed">{t.description}</p>
                <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-gray-200/50">
                  <span>Category: {t.category}</span>
                  <span>Logged: {new Date(t.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
