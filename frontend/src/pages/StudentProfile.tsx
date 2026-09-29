// ============================================================
// STUDENT PROFILE PAGE
// Comprehensive Profile with Masked Identifiers & MoTA Attributes
// ============================================================

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDemo } from '../context/DemoContext';
import { api } from '../services/api';
import { StudentProfile } from '../types';
import {
  User, ShieldCheck, CheckCircle2, Edit3, Save, X,
  Building, GraduationCap, MapPin, CreditCard, Sparkles,
  AlertCircle, Fingerprint, Award
} from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { refreshKey, triggerRefresh } = useDemo();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<StudentProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.getProfile()
      .then(res => {
        if (res.success && res.data) {
          setProfile(res.data);
          setFormData({
            email: res.data.email,
            village: res.data.village,
            familyIncome: res.data.familyIncome,
            course: res.data.course,
            institution: res.data.institution,
            academicYear: res.data.academicYear
          });
        }
      })
      .finally(() => setLoading(false));
  }, [user, refreshKey]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updateProfile(formData);
      if (res.success && res.data) {
        setProfile(res.data);
        setEditing(false);
        setSuccessMsg('Profile updated successfully.');
        triggerRefresh();
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center text-sm text-gray-500">
        <Sparkles className="w-6 h-6 text-[#064E3B] animate-spin mx-auto mb-2" />
        Loading student profile...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#064E3B] text-[#F8E7C9] flex items-center justify-center font-bold text-2xl shadow-md border-2 border-[#F8E7C9]">
            {profile?.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">{profile?.name}</h1>
              <span className="bg-emerald-100 text-emerald-900 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                Aadhaar Verified
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Scheduled Tribe: <span className="font-semibold text-gray-800">{profile?.stCategory} Community</span>
              {profile?.isPVTG && (
                <span className="ml-2 bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold text-[10px]">
                  PVTG Community
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 bg-[#064E3B] hover:bg-[#04382A] text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#F8E7C9]" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl text-xs font-semibold transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Editing Form or Static View */}
      {editing ? (
        <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
            Update Student Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#064E3B]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Village / Locality</label>
              <input
                type="text"
                value={formData.village || ''}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#064E3B]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Annual Family Income (₹)</label>
              <input
                type="number"
                value={formData.familyIncome || 0}
                onChange={(e) => setFormData({ ...formData, familyIncome: Number(e.target.value) })}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#064E3B]"
              />
              <span className="text-[10px] text-gray-500">Subject to verification via e-District / income certificate.</span>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Course Name</label>
              <input
                type="text"
                value={formData.course || ''}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#064E3B]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Institution Name</label>
              <input
                type="text"
                value={formData.institution || ''}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#064E3B]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Academic Year</label>
              <input
                type="text"
                value={formData.academicYear || ''}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#064E3B]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-[#064E3B] hover:bg-[#04382A] text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-[#F8E7C9]" />
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Identity & National IDs */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Fingerprint className="w-4 h-4 text-[#064E3B]" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900">
                National Identity & Identifiers
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Aadhaar (Masked):</span>
                <span className="font-mono font-semibold text-gray-900">{profile?.aadhaarMasked}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">APAAR ID (Edu):</span>
                <span className="font-mono font-semibold text-[#064E3B]">{profile?.apaarId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">One Time Reg (OTR):</span>
                <span className="font-mono font-semibold text-gray-900">{profile?.otrId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Date of Birth:</span>
                <span className="font-semibold text-gray-800">{profile?.dateOfBirth}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Gender:</span>
                <span className="font-semibold text-gray-800">{profile?.gender}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Mobile (Linked):</span>
                <span className="font-semibold text-gray-800">+91 {profile?.mobile}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Domicile & Tribal Demographics */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <MapPin className="w-4 h-4 text-[#064E3B]" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900">
                Domicile & Tribal Category
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">State:</span>
                <span className="font-semibold text-gray-800">{profile?.state}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">District:</span>
                <span className="font-semibold text-gray-800">{profile?.district}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Village / Town:</span>
                <span className="font-semibold text-gray-800">{profile?.village}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">ST Category:</span>
                <span className="font-semibold text-[#064E3B]">{profile?.stCategory}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">PVTG Group:</span>
                <span className="font-semibold text-gray-800">{profile?.isPVTG ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Academic & Institution Details */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <GraduationCap className="w-4 h-4 text-[#064E3B]" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900">
                Academic & Institution
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Institution:</span>
                <span className="font-semibold text-gray-800 text-right max-w-[200px] truncate">{profile?.institution}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">AISHE / UDISE Code:</span>
                <span className="font-mono font-semibold text-gray-800">{profile?.institutionCode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Course / Discipline:</span>
                <span className="font-semibold text-gray-800">{profile?.course}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Academic Year:</span>
                <span className="font-semibold text-gray-800">{profile?.academicYear}</span>
              </div>
            </div>
          </div>

          {/* Card 4: Financial & DBT Bank Verification */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <CreditCard className="w-4 h-4 text-[#064E3B]" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900">
                Income & DBT Bank Details
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Annual Family Income:</span>
                <span className="font-bold text-gray-900">₹{profile?.familyIncome?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Bank Name:</span>
                <span className="font-semibold text-gray-800">{profile?.bankName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Account (Masked):</span>
                <span className="font-mono font-semibold text-gray-800">{profile?.bankAccountMasked}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">IFSC Code:</span>
                <span className="font-mono font-semibold text-gray-800">{profile?.ifscCode}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">DBT / Aadhaar Seeding:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active & Seeded
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
