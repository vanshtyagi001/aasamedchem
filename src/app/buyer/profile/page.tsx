'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    contactNumber: '',
    companyName: '',
    gstNumber: '',
    licenseNumber: '',
    establishedIn: '',
    employees: '',
    linkedinUrl: '',
    pincode: '',
    district: '',
    state: '',
    country: 'India',
    companyAddress: '',
    companyDescription: '',
    category: 'Supplier',
    photos: [] as string[],
  });

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setProfile(data.profile);
          
          // Sanitize incoming null values from PostgreSQL to empty strings
          setFormData({
            name: data.profile.name || '',
            designation: data.profile.designation || '',
            contactNumber: data.profile.contactNumber || '',
            companyName: data.profile.companyName || '',
            gstNumber: data.profile.gstNumber || '',
            licenseNumber: data.profile.licenseNumber || '',
            establishedIn: data.profile.establishedIn || '',
            employees: data.profile.employees || '',
            linkedinUrl: data.profile.linkedinUrl || '',
            pincode: data.profile.pincode || '',
            district: data.profile.district || '',
            state: data.profile.state || '',
            country: data.profile.country || 'India',
            companyAddress: data.profile.companyAddress || '',
            companyDescription: data.profile.companyDescription || '',
            category: data.profile.category || 'Supplier',
            photos: data.profile.photos || [],
          });
        } else {
          setIsEditing(true);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      const updated = await res.json();
      setProfile(updated.profile);
      setIsEditing(false);
      router.refresh();
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 py-12">Loading Profile...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">B2B Profile Identity Verification</h1>
            <p className="text-sm text-gray-500">Provide company credentials for validation</p>
          </div>
          {profile && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-indigo-600 hover:text-indigo-500 font-medium text-sm border border-indigo-200 rounded px-4 py-2 hover:bg-indigo-50"
            >
              Modify Details
            </button>
          )}
        </div>

        {profile && !isEditing ? (
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-3 p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200 text-sm">
              <Clock className="w-5 h-5 flex-shrink-0" />
              <div>
                <strong>Verification Request Status: Pending Review</strong>
                <p className="mt-0.5 text-xs text-yellow-700">
                  Our system verifies credentials manually. This takes up to 24 hours.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-xs text-gray-400 font-semibold block uppercase">Authorized Contact Name</span>
                <p className="text-gray-900 font-medium">{profile.name} ({profile.designation || 'N/A'})</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 font-semibold block uppercase">Phone Contact</span>
                <p className="text-gray-900 font-medium">{profile.contactNumber}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 font-semibold block uppercase">Registered Company Name</span>
                <p className="text-gray-900 font-medium">{profile.companyName}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 font-semibold block uppercase">GST Number</span>
                <p className="text-gray-900 font-medium font-mono">{profile.gstNumber || 'None'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 font-semibold block uppercase">License Number</span>
                <p className="text-gray-900 font-medium font-mono">{profile.licenseNumber || 'None'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 font-semibold block uppercase">Established / Employee Count</span>
                <p className="text-gray-900 font-medium">
                  {profile.establishedIn || 'N/A'} (Employees: {profile.employees || 'N/A'})
                </p>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs text-gray-400 font-semibold block uppercase">Registered Address</span>
                <p className="text-gray-900 font-medium">
                  {profile.companyAddress}, {profile.district}, {profile.state} - {profile.pincode}, {profile.country}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Authorized Personnel *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Full Legal Name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Designation</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g., Sourcing Manager"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Contact Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Legal Organization Entity"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">GST Number</label>
                <input
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">License Number</label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Drug License or equivalent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Established In (Year)</label>
                <input
                  type="text"
                  value={formData.establishedIn}
                  onChange={(e) => setFormData({ ...formData, establishedIn: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g., 2015"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Number of Employees</label>
                <input
                  type="text"
                  value={formData.employees}
                  onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g., 10-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="https://linkedin.com/company/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Pincode *</label>
                <input
                  type="text"
                  required
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="6-digit PIN"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">District *</label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">State *</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700">Company Office Address *</label>
                <textarea
                  required
                  value={formData.companyAddress}
                  onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                  rows={2}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter full physical business address..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700">About/Description</label>
                <textarea
                  value={formData.companyDescription}
                  onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Describe your products, operations, or trade domains..."
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t justify-end">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-5 py-2 text-sm font-medium border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 transition"
              >
                Skip / Verify Later
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition shadow-sm"
              >
                Submit Profile for Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}