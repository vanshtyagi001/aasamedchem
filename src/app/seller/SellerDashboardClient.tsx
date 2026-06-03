'use client';

import { useState } from 'react';
import { CheckSquare, XSquare, Hourglass, CheckCircle2 } from 'lucide-react';

export default function SellerDashboardClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);

  const handleUpdateStatus = async (orderId: string, status: 'APPROVED' | 'REJECTED') => {
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-left">
        <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
          <tr>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Client Identity</th>
            <th className="px-4 py-3 text-right">Quantity Ordered</th>
            <th className="px-4 py-3 text-right">Estimated Price</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-sm">
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 font-semibold text-gray-900">{o.productName}</td>
              <td className="px-4 py-4">
                <div className="font-medium text-gray-800">{o.buyerName}</div>
                <div className="text-xs text-gray-400">{o.companyName}</div>
              </td>
              <td className="px-4 py-4 text-right">
                {o.orderedQty} {o.orderedUnit}
              </td>
              <td className="px-4 py-4 text-right font-bold text-gray-950">
                ₹{o.totalPrice.toLocaleString('en-IN')}
              </td>
              <td className="px-4 py-4 text-gray-500 text-xs">{o.createdAt}</td>
              <td className="px-4 py-4">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    o.status === 'PENDING'
                      ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                      : o.status === 'APPROVED'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {o.status}
                </span>
              </td>
              <td className="px-4 py-4 text-right">
                {o.status === 'PENDING' ? (
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus(o.id, 'APPROVED')}
                      className="flex items-center gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded px-2 py-1 text-xs font-semibold"
                    >
                      <CheckSquare className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(o.id, 'REJECTED')}
                      className="flex items-center gap-1 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded px-2 py-1 text-xs font-semibold"
                    >
                      <XSquare className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 italic">No action pending</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}