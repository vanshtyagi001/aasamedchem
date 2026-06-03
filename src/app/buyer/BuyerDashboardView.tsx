'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, ShoppingBag, Send, Landmark, Edit2, ShieldAlert } from 'lucide-react';

interface BuyerDashboardViewProps {
  userEmail: string;
  isVerified: boolean;
  initialProfile: any;
  metrics: {
    activeOrders: number;
    pendingEnquiries: number;
    totalSourced: number;
  };
}

export default function BuyerDashboardView({
  userEmail,
  isVerified,
  initialProfile,
  metrics,
}: BuyerDashboardViewProps) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name || '',
    designation: profile.designation || '',
    contactNumber: profile.contactNumber || '',
    companyName: profile.companyName || '',
    gstNumber: profile.gstNumber || '',
    licenseNumber: profile.licenseNumber || '',
    establishedIn: profile.establishedIn || '',
    employees: profile.employees || '',
    linkedinUrl: profile.linkedinUrl || '',
    pincode: profile.pincode || '',
    district: profile.district || '',
    state: profile.state || '',
    country: profile.country || 'India',
    companyAddress: profile.companyAddress || '',
    companyDescription: profile.companyDescription || '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const data = await res.json();
      setProfile(data.profile);
      setIsEditing(false);
      router.refresh();
    } else {
      alert('Failed to save profile credentials');
    }
  };

  const isProfileSkeleton = !profile.name || !profile.contactNumber || !profile.companyAddress;

  return (
    <div className="space-y-6">
      
      {/* 1. VERIFICATION STRIP BANNER */}
      {!isVerified && (
        <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-lg p-4 font-semibold text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span>
              {isProfileSkeleton 
                ? 'Your buyer profile information is incomplete. Complete your profile details to submit for verification.' 
                : 'Your profile has been submitted. Sourcing and checkout features will unlock once verified.'}
            </span>
          </div>
          {isProfileSkeleton && !isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-xs font-bold text-blue-700 underline hover:text-blue-800 transition"
            >
              Configure Now
            </button>
          )}
        </div>
      )}

      {/* 2. PROFILE DETAILS / FORM TOGGLE CARD */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        {!isEditing ? (
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            
            {/* Left Column: Details Grid */}
            <div className="flex-1 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile.companyName || "Unnamed Procurement Organization"}
                  </h2>
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                    isVerified 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {isVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-gray-500 mt-2">
                  <span className="flex items-center gap-1.5 font-medium">
                    <User className="w-4 h-4 text-gray-400" /> {profile.name || 'Unnamed Buyer'}
                  </span>
                  <span>&bull;</span>
                  <span>{userEmail}</span>
                  <span>&bull;</span>
                  <span>{profile.contactNumber || 'No number available'}</span>
                </div>
              </div>

              {/* Grid Layout Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t border-gray-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-0.5">GST No</span>
                  <p className="text-sm font-semibold text-gray-800 font-mono">{profile.gstNumber || 'NA'}</p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-0.5">License No</span>
                  <p className="text-sm font-semibold text-gray-800 font-mono">{profile.licenseNumber || 'NA'}</p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Established</span>
                  <p className="text-sm font-semibold text-gray-800">{profile.establishedIn || 'NA'}</p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Employees</span>
                  <p className="text-sm font-semibold text-gray-800">{profile.employees || 'NA'}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Company Address</span>
                  <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                    {profile.companyAddress 
                      ? `${profile.companyAddress}, ${profile.district}, ${profile.state} - ${profile.pincode}` 
                      : 'No address available. Please click Edit Profile to add.'
                    }
                  </p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Company Description</span>
                  <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                    {profile.companyDescription || 'No description available. Please add a detailed description of your procurement requirements, products, and target sourcing volumes.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Avatar Column Card */}
            <div className="w-full lg:w-64 flex flex-col items-center justify-between border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full border border-gray-200 bg-slate-100 flex items-center justify-center text-slate-400 relative overflow-hidden">
                  <User className="w-12 h-12" />
                </div>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full shadow border border-white hover:bg-blue-700 transition"
                  title="Upload profile image"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-center mt-4">
                <p className="font-bold text-gray-900 text-base">{profile.name || 'Unnamed'}</p>
                <p className="text-xs text-gray-400">{profile.designation || 'Buyer Manager'}</p>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm shadow-sm transition"
              >
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          /* Edit Profile Mode Form */
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-3">Update Corporate Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Company Legal Name *</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-955 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="e.g. HealthSourcing Corp"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Authorized Buyer Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-955 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Your Full Name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Designation</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-955 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Sourcing Manager"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Contact Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-955 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">GST Number</label>
                <input
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-955 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 22AAAAA0000A1Z5"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">License Number</label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-955 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Drug License or equivalent certificate"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Established In (Year)</label>
                <input
                  type="text"
                  value={formData.establishedIn}
                  onChange={(e) => setFormData({ ...formData, establishedIn: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-955 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 2018"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Number of Employees</label>
                <input
                  type="text"
                  value={formData.employees}
                  onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-955 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 10-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Pincode *</label>
                <input
                  type="text"
                  required
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-955 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="6-digit ZIP/Pincode"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Registered Address *</label>
                <textarea
                  required
                  value={formData.companyAddress}
                  onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-955 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Enter physical corporate office address"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Company Description</label>
                <textarea
                  value={formData.companyDescription}
                  onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-955 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Describe your company trade focus or target pharmaceutical intermediates capacity..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2 text-sm font-semibold border border-gray-300 rounded-lg text-gray-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
              >
                Save Details
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 3. BUSINESS OVERVIEW METRICS */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Business Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Active Orders</span>
              <span className="text-2xl font-bold text-gray-900">{metrics.activeOrders}</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Pending Enquiries</span>
              <span className="text-2xl font-bold text-gray-900">{metrics.pendingEnquiries}</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Total Sourced</span>
              <span className="text-2xl font-bold text-gray-900">₹{metrics.totalSourced.toLocaleString('en-IN')}</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}