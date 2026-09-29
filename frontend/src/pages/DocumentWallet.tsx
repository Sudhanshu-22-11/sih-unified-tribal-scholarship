// ============================================================
// DIGITAL DOCUMENT WALLET
// Secure Repository with DigiLocker Integration
// ============================================================

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDemo } from '../context/DemoContext';
import { api } from '../services/api';
import { Document as UserDocument } from '../types';
import {
  FileText, CheckCircle2, Clock, AlertTriangle, AlertCircle,
  Download, Upload, Eye, RefreshCw, ExternalLink, ShieldCheck,
  Sparkles, X
} from 'lucide-react';

export const DocumentWalletPage: React.FC = () => {
  const { user } = useAuth();
  const { refreshKey, triggerRefresh } = useDemo();

  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingDigiLocker, setFetchingDigiLocker] = useState(false);
  const [digiLockerResult, setDigiLockerResult] = useState<any>(null);
  const [selectedDoc, setSelectedDoc] = useState<UserDocument | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('domicile');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getDocuments()
      .then(res => {
        if (res.success && res.data) setDocuments(res.data);
      })
      .finally(() => setLoading(false));
  }, [user, refreshKey]);

  const handleFetchDigiLocker = async () => {
    setFetchingDigiLocker(true);
    setDigiLockerResult(null);
    try {
      const res = await api.fetchDigiLockerDocs();
      setDigiLockerResult(res);
      if (res.success) {
        // Refresh local documents list
        const updated = await api.getDocuments();
        if (updated.success) setDocuments(updated.data);
      }
    } catch {
      setDigiLockerResult({
        success: false,
        error: 'DigiLocker service communication timeout.'
      });
    } finally {
      setFetchingDigiLocker(false);
    }
  };

  const handleUploadNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) return;
    setUploading(true);
    try {
      const res = await api.uploadDocument(newDocName, newDocType, 'Manual Upload');
      if (res.success) {
        setUploadModalOpen(false);
        setNewDocName('');
        triggerRefresh();
      }
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            Verified
          </span>
        );
      case 'pending':
        return (
          <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-700" />
            Pending Verification
          </span>
        );
      case 'needs_review':
        return (
          <span className="bg-orange-100 text-orange-900 border border-orange-300 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-orange-700" />
            Needs Review
          </span>
        );
      default:
        return (
          <span className="bg-rose-100 text-rose-900 border border-rose-300 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-rose-700" />
            Missing
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#064E3B]" />
            <h1 className="text-xl font-bold text-gray-900">Digital Document Wallet</h1>
          </div>
          <p className="text-xs text-gray-600 max-w-xl">
            Store once, reuse across all MoTA scholarship applications. All documents are digitally cross-verified with issuing authorities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mock DigiLocker Button */}
          <button
            onClick={handleFetchDigiLocker}
            disabled={fetchingDigiLocker}
            className="bg-[#064E3B] hover:bg-[#04382A] text-white px-4 py-2.5 rounded-xl font-semibold text-xs transition shadow-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#F8E7C9]" />
            <span>{fetchingDigiLocker ? 'Fetching...' : 'Fetch from DigiLocker'}</span>
            <span className="bg-[#F8E7C9] text-[#064E3B] text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">
              Demo Integration
            </span>
          </button>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 rounded-xl font-semibold text-xs transition flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* DigiLocker Feedback Banner */}
      {digiLockerResult && (
        <div className={`p-4 rounded-xl border text-xs flex items-start justify-between gap-3 ${
          digiLockerResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          <div>
            <div className="font-bold flex items-center gap-1.5 mb-1">
              {digiLockerResult.success ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>DigiLocker Sync Successful (Demo Integration)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>DigiLocker Sync Notice</span>
                </>
              )}
            </div>
            <p className="text-[11px] leading-relaxed">
              {digiLockerResult.success
                ? `Retrieved ${digiLockerResult.data?.totalDocuments || 5} certified documents (Aadhaar, Caste Certificate, Class 10/12 Marksheets, Income Certificate).`
                : digiLockerResult.error}
            </p>
          </div>

          <button
            onClick={() => setDigiLockerResult(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Documents Grid */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <span className="font-bold text-xs uppercase tracking-wider text-gray-700">
            Document Repository ({documents.length} Records)
          </span>
          <span className="text-[11px] text-gray-500">
            {documents.filter(d => d.status === 'verified').length} Verified
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/70 transition"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xs sm:text-sm text-gray-900">{doc.name}</h3>
                    {getStatusBadge(doc.status)}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Source: <span className="font-medium text-gray-700">{doc.source || 'Manual Upload'}</span>
                    {doc.issuingAuthority && ` • Issuer: ${doc.issuingAuthority}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 flex items-center gap-1 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                {doc.status === 'missing' ? (
                  <button
                    onClick={() => {
                      setNewDocName(doc.name);
                      setNewDocType(doc.type);
                      setUploadModalOpen(true);
                    }}
                    className="bg-[#064E3B] hover:bg-[#04382A] text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1 transition"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#F8E7C9]" />
                    <span>Upload Now</span>
                  </button>
                ) : (
                  <button
                    onClick={() => alert(`Document "${doc.name}" is attached to your active profile.`)}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-semibold border border-emerald-200 transition"
                  >
                    Use in Application
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Document Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-sm text-gray-900">{selectedDoc.name}</h3>
              <button onClick={() => setSelectedDoc(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-gray-700">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Document Type:</span>
                <span className="font-semibold">{selectedDoc.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Verification Status:</span>
                <div>{getStatusBadge(selectedDoc.status)}</div>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Source:</span>
                <span className="font-semibold">{selectedDoc.source}</span>
              </div>
              {selectedDoc.issuingAuthority && (
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Issuing Authority:</span>
                  <span className="font-semibold">{selectedDoc.issuingAuthority}</span>
                </div>
              )}
              {selectedDoc.verifiedAt && (
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Verified Timestamp:</span>
                  <span className="font-mono text-gray-800">
                    {new Date(selectedDoc.verifiedAt).toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedDoc(null)}
                className="bg-[#064E3B] text-white px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUploadNew} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-sm text-gray-900">Upload New Certificate</h3>
              <button type="button" onClick={() => setUploadModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g. Domicile Certificate"
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Document Category</label>
                <select
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                >
                  <option value="domicile">Domicile Certificate</option>
                  <option value="fee_receipt">Fee Receipt</option>
                  <option value="income_certificate">Income Certificate</option>
                  <option value="bonafide">Bonafide Certificate</option>
                  <option value="other">Other Scheme Specific Document</option>
                </select>
              </div>

              <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl text-center">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <p className="text-[11px] text-gray-600">Simulate file selection (PDF, JPEG max 2MB)</p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-5 py-2 bg-[#064E3B] text-white rounded-xl text-xs font-semibold shadow-sm"
              >
                {uploading ? 'Uploading...' : 'Save & Verify'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
