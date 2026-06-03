'use client';

import { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  ClipboardList, 
  ShoppingCart, 
  Trash2, 
  UserCheck, 
  Activity, 
  Landmark,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

interface AdminDashboardProps {
  initialUsers: any[];
  initialProducts: any[];
  initialOrders: any[];
}

export default function AdminDashboard({
  initialUsers,
  initialProducts,
  initialOrders,
}: AdminDashboardProps) {
  const [users, setUsers] = useState(initialUsers);
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState<'VERIFICATION' | 'CATALOG' | 'TRANSACTIONS'>('VERIFICATION');

  // 1. CALCULATE PLATFORM ANALYTICS
  const verifiedUsersCount = users.filter((u) => u.isVerified).length;
  const pendingRequestsCount = users.filter((u) => !u.isVerified && u.profile?.isCompleted).length;
  const totalProductsCount = products.length;
  const platformTradeVolume = orders
    .filter((o) => o.status === 'APPROVED' || o.status === 'COMPLETED')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  // 2. TOGGLE USER VERIFICATION STATUS
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

  // 3. REMOVE PRODUCT listings GLOBALLY
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this listed product globally from the marketplace?')) {
      return;
    }

    const res = await fetch(`/api/admin?productId=${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setProducts(products.filter((p) => p.id !== id));
    } else {
      alert('Failed to remove product from directory.');
    }
  };

  const tabStyle = (tab: typeof activeTab) =>
    `px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
      activeTab === tab
        ? 'bg-blue-600 text-white shadow-sm'
        : 'text-gray-500 hover:bg-slate-50 hover:text-gray-900'
    }`;

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-red-600" /> B2B Administrative Console
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">Control corporate account verifications, catalog compliance, and global trade volumes</p>
      </div>

      {/* Analytics Summary Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Global Sourcing Volume</span>
            <span className="text-xl font-bold text-gray-900">₹{platformTradeVolume.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Verified Enterprises</span>
            <span className="text-xl font-bold text-gray-900">{verifiedUsersCount} companies</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Listed Catalog SKUs</span>
            <span className="text-xl font-bold text-gray-900">{totalProductsCount} items</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Verification Queue</span>
            <span className="text-xl font-bold text-gray-900">{pendingRequestsCount} pending</span>
          </div>
        </div>

      </div>

      {/* Interactive Tabbed Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4">
        <button onClick={() => setActiveTab('VERIFICATION')} className={tabStyle('VERIFICATION')}>Account Verifications</button>
        <button onClick={() => setActiveTab('CATALOG')} className={tabStyle('CATALOG')}>Platform Catalog</button>
        <button onClick={() => setActiveTab('TRANSACTIONS')} className={tabStyle('TRANSACTIONS')}>Global Transactions</button>
      </div>

      {/* 3. DYNAMIC CONTENT AREAS */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        
        {/* TAB A: USER VERIFICATIONS */}
        {activeTab === 'VERIFICATION' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">User Identity</th>
                  <th className="px-6 py-4">Sourcing Role</th>
                  <th className="px-6 py-4">Company Details</th>
                  <th className="px-6 py-4">GST / Tax ID</th>
                  <th className="px-6 py-4">License No</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-medium text-gray-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900">{u.profile?.name || 'Incomplete Profile'}</div>
                      <div className="text-xs text-gray-400">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'SELLER' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900">{u.profile?.companyName || 'N/A'}</div>
                      <div className="text-xs text-gray-400">{u.profile?.companyAddress || 'No Address Listed'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-700">
                      {u.profile?.gstNumber || 'None'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-700">
                      {u.profile?.licenseNumber || 'None'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        u.isVerified 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        {u.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleToggleVerify(u.id, u.isVerified)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-sm transition ${
                          u.isVerified
                            ? 'text-red-700 bg-red-50 border-red-200 hover:bg-red-100'
                            : 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        {u.isVerified ? 'Revoke' : 'Verify'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB B: GLOBAL CATALOG */}
        {activeTab === 'CATALOG' && (
          <div className="overflow-x-auto">
            {products.length === 0 ? (
              <p className="text-center text-gray-500 py-12">No materials cataloged on the platform.</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Chemical specs</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Purity</th>
                    <th className="px-6 py-4">Supplier Entity</th>
                    <th className="px-6 py-4 text-right">Base Price (INR)</th>
                    <th className="px-6 py-4 text-right">Compliance Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-medium text-gray-700">
                  {products.map((p) => {
                    const displayUnit = p.baseUnit === 'g' ? 'kg' : p.baseUnit === 'mL' ? 'L' : 'items';
                    const isWeightOrVol = p.baseUnit === 'g' || p.baseUnit === 'mL';
                    const displayPrice = isWeightOrVol ? p.pricePerBaseUnit * 1000 : p.pricePerBaseUnit;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-gray-900">{p.name}</div>
                          <div className="text-xs text-gray-400 font-mono">CAS: {p.casNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                          <span className="bg-slate-100 text-gray-600 px-2 py-0.5 rounded uppercase">{p.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-indigo-600 font-semibold">{p.purity}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-900">
                          {p.sellerCompany}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-gray-900">
                          ₹{displayPrice.toLocaleString('en-IN')}/{displayUnit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                            title="Takedown listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB C: TRANSACTION LEDGER */}
        {activeTab === 'TRANSACTIONS' && (
          <div className="overflow-x-auto">
            {orders.length === 0 ? (
              <div className="text-center py-12 px-4">
                <FileSpreadsheet className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-500">No transactions recorded yet.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Inquiry / Date</th>
                    <th className="px-6 py-4">Product Specs</th>
                    <th className="px-6 py-4">Buyer Entity</th>
                    <th className="px-6 py-4">Supplier Entity</th>
                    <th className="px-6 py-4 text-right">Sourced Qty</th>
                    <th className="px-6 py-4 text-right">Transaction Total</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-medium text-gray-700">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-gray-900 text-xs font-mono">{o.id.slice(0, 8).toUpperCase()}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{o.createdAt}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-gray-900">{o.productName}</div>
                        <div className="text-xs text-gray-400 font-mono">CAS: {o.casNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">{o.buyerCompany}</div>
                        <div className="text-xs text-gray-400">{o.buyerName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                        {o.sellerCompany}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {o.orderedQty.toLocaleString()} <span className="text-gray-400 text-xs">{o.orderedUnit}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-gray-950">
                        ₹{o.totalPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          o.status === 'PENDING'
                            ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                            : o.status === 'APPROVED'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : o.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </div>
  );
}