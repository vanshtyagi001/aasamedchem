'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Hourglass, CheckCircle2, RefreshCw } from 'lucide-react';

export default function OrdersHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch('/api/orders');
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders);
    }
    setLoading(false);
  };

  if (loading) return <p className="text-center text-gray-500 py-12">Retrieving orders...</p>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Requested Quotations</h1>
          <p className="text-sm text-gray-500">View and track chemical bulk procurement orders</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-950 border px-3 py-1.5 rounded-lg bg-white"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-200 text-center py-12 px-4 rounded-xl">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm font-medium">No order requests found.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity Ordered</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estimated Price (INR)</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Seller Entity</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{order.product.name}</div>
                    <div className="text-xs text-gray-400">CAS: {order.product.casNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.orderedQty} {order.orderedUnit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-950">
                    ₹{Number(order.totalPrice).toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.seller?.profile?.companyName || 'Verified Supplier'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'PENDING' ? 'bg-yellow-50 text-yellow-800' : 'bg-emerald-50 text-emerald-800'
                    }`}>
                      {order.status === 'PENDING' ? <Hourglass className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}