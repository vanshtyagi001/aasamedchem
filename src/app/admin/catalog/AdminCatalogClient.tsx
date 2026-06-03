'use client';

import { useState } from 'react';
import { ClipboardList, Trash2, Tag } from 'lucide-react';

export default function AdminCatalogClient({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);

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

  const totalSkus = products.length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Marketplace Catalog Audit</h2>
        <p className="text-xs text-gray-400 mt-0.5">Audit compliance filings, active CAS numbers, and take down listings</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-100 pb-6">
        <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <ClipboardList className="w-5 h-5 text-indigo-600" />
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Listed Materials</span>
            <span className="text-base font-bold text-gray-900">{totalSkus} items</span>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-500">No active catalog listings found.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Chemical specs</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Purity</th>
                <th className="px-6 py-4">Supplier Entity</th>
                <th className="px-6 py-4 text-right">Base Price (INR)</th>
                <th className="px-6 py-4 text-right">Takedown</th>
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
    </div>
  );
}