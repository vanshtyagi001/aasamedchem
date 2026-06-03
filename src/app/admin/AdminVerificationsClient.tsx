'use client';

import { useState } from 'react';
import { UserCheck, Users, AlertCircle } from 'lucide-react';

export default function AdminVerificationsClient({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);

  const handleToggleVerify = async (userId: string, currentStatus: boolean) => {
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId: userId, verifyStatus: !currentStatus }),
    });

    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isVerified: !currentStatus } : u))
      );
    } else {
      alert('Failed to update verification status.');
    }
  };

  const totalUsers = users.length;
  const verifiedCount = users.filter((u) => u.isVerified).length;
  const pendingCount = users.filter((u) => !u.isVerified && u.profile?.isCompleted).length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Corporate Access Controls</h2>
        <p className="text-xs text-gray-400 mt-0.5">Verify organization credentials and activate trading permissions</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-100 pb-6">
        <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <Users className="w-5 h-5 text-blue-600" />
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Members</span>
            <span className="text-base font-bold text-gray-900">{totalUsers} users</span>
          </div>
        </div>
        <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <UserCheck className="w-5 h-5 text-emerald-600" />
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Verified Entities</span>
            <span className="text-base font-bold text-gray-900">{verifiedCount} companies</span>
          </div>
        </div>
        <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Pending Queue</span>
            <span className="text-base font-bold text-gray-900">{pendingCount} pending</span>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">User Identity</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Company Name</th>
              <th className="px-4 py-3">GST No</th>
              <th className="px-4 py-3">License No</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Verification Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 font-medium text-gray-700">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="font-bold text-gray-900">{u.profile?.name || 'Incomplete Profile'}</div>
                  <div className="text-xs text-gray-400">{u.email}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-xs">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    u.role === 'SELLER' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="font-bold text-gray-900">{u.profile?.companyName || 'N/A'}</div>
                  <div className="text-xs text-gray-400">{u.profile?.companyAddress || 'No Address Listed'}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap font-mono text-xs text-gray-700">
                  {u.profile?.gstNumber || 'None'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap font-mono text-xs text-gray-700">
                  {u.profile?.licenseNumber || 'None'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    u.isVerified ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                  }`}>
                    {u.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => handleToggleVerify(u.id, u.isVerified)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold shadow-sm transition-all ${
                      u.isVerified
                        ? 'text-red-700 bg-red-50 border-red-200 hover:bg-red-100'
                        : 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {u.isVerified ? 'Revoke' : 'Verify'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}