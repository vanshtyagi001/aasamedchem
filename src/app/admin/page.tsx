'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Users, ToggleLeft, ToggleRight, CheckSquare } from 'lucide-react';

export default function AdminConsole() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch('/api/admin');
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
    }
    setLoading(false);
  };

  const handleToggleVerify = async (userId: string, currentStatus: boolean) => {
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId: userId, verifyStatus: !currentStatus }),
    });

    if (res.ok) {
      fetchUsers();
    } else {
      alert('Failed to modify user status.');
    }
  };

  if (loading) return <p className="text-center text-gray-500 py-12">Accessing Admin Console...</p>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-red-600" /> Admin Console
        </h1>
        <p className="text-sm text-gray-500">Verify user permissions, check uploaded credentials, and manage marketplace access</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User Identity</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company Details</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tax ID / GST</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-gray-900">{u.profile?.name || 'Incomplete Profile'}</div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                    u.role === 'SELLER' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{u.profile?.companyName || 'N/A'}</div>
                  <div className="text-xs text-gray-500">{u.profile?.companyAddress || 'No Address Listed'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-700">
                  {u.profile?.gstNumber || 'None'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    u.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {u.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleToggleVerify(u.id, u.isVerified)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded border text-xs font-semibold shadow-sm transition ${
                      u.isVerified
                        ? 'text-red-700 bg-red-50 border-red-200 hover:bg-red-100'
                        : 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {u.isVerified ? 'Revoke Access' : 'Verify Account'}
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