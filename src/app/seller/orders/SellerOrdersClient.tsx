'use client';

import { useState } from 'react';
import { 
  CheckSquare, 
  XSquare, 
  CheckCircle2, 
  Clock, 
  FileSpreadsheet, 
  Hourglass, 
  Trash2,
  AlertCircle
} from 'lucide-react';

export default function SellerOrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'COMPLETED' | 'REJECTED'>('ALL');

  const handleUpdateStatus = async (orderId: string, status: 'APPROVED' | 'REJECTED' | 'COMPLETED') => {
    const res = await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    });

    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    } else {
      alert('Failed to update order status');
    }
  };

  // Filter list based on top filter tabs
  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'ALL') return true;
    return o.status === activeTab;
  });

  const tabStyles = (tab: typeof activeTab) => 
    `px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
      activeTab === tab
        ? 'bg-blue-600 text-white shadow-sm'
        : 'text-gray-500 hover:bg-slate-50 hover:text-gray-900'
    }`;

  return (
    <div className="space-y-6">
      
      {/* 1. STATUS FILTER NAV TABS */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4">
        <button onClick={() => setActiveTab('ALL')} className={tabStyles('ALL')}>All Requests</button>
        <button onClick={() => setActiveTab('PENDING')} className={tabStyles('PENDING')}>Pending</button>
        <button onClick={() => setActiveTab('APPROVED')} className={tabStyles('APPROVED')}>Approved</button>
        <button onClick={() => setActiveTab('COMPLETED')} className={tabStyles('COMPLETED')}>Completed</button>
        <button onClick={() => setActiveTab('REJECTED')} className={tabStyles('REJECTED')}>Rejected</button>
      </div>

      {/* 2. ORDER QUEUE DATA TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 px-4">
            <FileSpreadsheet className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-500">No matching orders found.</p>
            <p className="text-xs text-gray-400 mt-1">There are no orders matching the selected status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Inquiry / Date</th>
                  <th className="px-6 py-4">Product Specs</th>
                  <th className="px-6 py-4">Buyer Entity</th>
                  <th className="px-6 py-4 text-right">Order Qty</th>
                  <th className="px-6 py-4 text-right">Estimated Value</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action Queue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-medium text-gray-700">
                {filteredOrders.map((o) => (
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
                      <div className="font-semibold text-gray-900">{o.companyName}</div>
                      <div className="text-xs text-gray-400">{o.buyerName} &bull; {o.contactNumber}</div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {o.status === 'PENDING' && (
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => handleUpdateStatus(o.id, 'APPROVED')}
                            className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded px-2.5 py-1 text-xs font-semibold transition"
                          >
                            <CheckSquare className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(o.id, 'REJECTED')}
                            className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded px-2.5 py-1 text-xs font-semibold transition"
                          >
                            <XSquare className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      )}

                      {o.status === 'APPROVED' && (
                        <button
                          onClick={() => handleUpdateStatus(o.id, 'COMPLETED')}
                          className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded px-2.5 py-1 text-xs font-semibold transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Ship / Complete
                        </button>
                      )}

                      {o.status === 'COMPLETED' && (
                        <span className="text-xs text-gray-400 italic flex items-center gap-1 justify-end">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Completed
                        </span>
                      )}

                      {o.status === 'REJECTED' && (
                        <span className="text-xs text-gray-400 italic flex items-center gap-1 justify-end">
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" /> Rejected
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}