'use client';

import { useState } from 'react';
import { Plus, Minus, Trash2, Tag, ClipboardList, CheckCircle2 } from 'lucide-react';

export default function SellerInventoryClient({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: 'API',
    casNumber: '',
    purity: '',
    minOrderQty: '',
    availableQty: '',
    unit: 'kg',
    price: '',
    description: '',
    certifications: [] as string[],
  });

  const availableCertifications = ['GMP', 'CEP', 'WC', 'FDA', 'COA', 'ISO9001', 'WHO_GMP'];

  const handleToggleCert = (cert: string) => {
    if (form.certifications.includes(cert)) {
      setForm({ ...form, certifications: form.certifications.filter((c) => c !== cert) });
    } else {
      setForm({ ...form, certifications: [...form.certifications, cert] });
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      purity: parseFloat(form.purity),
      minOrderQty: parseFloat(form.minOrderQty),
      availableQty: parseFloat(form.availableQty),
      price: parseFloat(form.price),
    };

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Product published successfully!');
      
      // Serialize new product data locally to update UI instantly
      const newProduct = {
        id: data.product.id,
        name: data.product.name,
        category: data.product.category,
        casNumber: data.product.casNumber,
        purity: Number(data.product.purity),
        minOrderQty: Number(data.product.minOrderQty),
        availableQty: Number(data.product.availableQty),
        baseUnit: data.product.baseUnit,
        pricePerBaseUnit: Number(data.product.pricePerBaseUnit),
        description: data.product.description,
        certifications: data.product.certifications,
      };

      setProducts([newProduct, ...products]);
      setShowAddForm(false);
      setForm({
        name: '',
        category: 'API',
        casNumber: '',
        purity: '',
        minOrderQty: '',
        availableQty: '',
        unit: 'kg',
        price: '',
        description: '',
        certifications: [],
      });
    } else {
      alert(data.error || 'Failed to list product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product listing from the B2B catalog?')) {
      return;
    }

    const res = await fetch(`/api/products?id=${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setProducts(products.filter((p) => p.id !== id));
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER ACTION ROW */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-600" /> Inventory Catalog
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage stock volumes, prices, and quality standard filings</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow transition"
        >
          {showAddForm ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'Close Form' : 'Add New Product'}
        </button>
      </div>

      {/* 2. COLLAPSIBLE CREATION FORM */}
      {showAddForm && (
        <div className="bg-slate-50 border border-gray-200 rounded-xl p-5 shadow-inner space-y-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Publish New Material Asset</h2>
          <form onSubmit={handlePublish} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-900 bg-white"
                  placeholder="e.g. Paracetamol"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-900 bg-white"
                >
                  <option value="API">API (Active Ingredients)</option>
                  <option value="Excipient">Excipients</option>
                  <option value="Intermediate">Intermediates</option>
                  <option value="Packaging">Packaging Material</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">CAS Number *</label>
                <input
                  type="text"
                  required
                  value={form.casNumber}
                  onChange={(e) => setForm({ ...form, casNumber: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-900 bg-white"
                  placeholder="e.g. 103-90-2"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Purity % *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.purity}
                  onChange={(e) => setForm({ ...form, purity: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-900 bg-white"
                  placeholder="e.g. 99.8"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Billing Unit *</label>
                <select
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-900 bg-white"
                >
                  <option value="kg">kilograms (kg)</option>
                  <option value="g">grams (g)</option>
                  <option value="L">liters (L)</option>
                  <option value="mL">milliliters (mL)</option>
                  <option value="items">items (count)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Price (₹/selected unit) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-900 bg-white"
                  placeholder="Price in INR"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Min Order Qty (MOQ) *</label>
                <input
                  type="number"
                  required
                  value={form.minOrderQty}
                  onChange={(e) => setForm({ ...form, minOrderQty: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-900 bg-white"
                  placeholder="Min volume"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Available Stock *</label>
                <input
                  type="number"
                  required
                  value={form.availableQty}
                  onChange={(e) => setForm({ ...form, availableQty: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-900 bg-white"
                  placeholder="Warehouse count"
                />
              </div>
            </div>

            {/* Certifications row */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase text-gray-400">Certifications Available</label>
              <div className="flex flex-wrap gap-1.5">
                {availableCertifications.map((cert) => (
                  <button
                    key={cert}
                    type="button"
                    onClick={() => handleToggleCert(cert)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition uppercase ${
                      form.certifications.includes(cert)
                        ? 'bg-blue-600 text-white border border-blue-600'
                        : 'bg-white text-gray-600 border border-gray-300 hover:bg-slate-50'
                    }`}
                  >
                    {cert}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Description / Specifications</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-900 bg-white"
                placeholder="Product description, physical state, packaging information..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow transition"
              >
                Publish Listing
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. INVENTORY CATALOG DATA TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {products.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-500">Your inventory is currently empty.</p>
            <p className="text-xs text-gray-400 mt-1">Click Add New Product above to list your first catalog asset.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Purity</th>
                  <th className="px-6 py-4 text-right">Min Order (MOQ)</th>
                  <th className="px-6 py-4 text-right">Available Stock</th>
                  <th className="px-6 py-4 text-right">Base Price (INR)</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-medium text-gray-700">
                {products.map((p) => {
                  // Determine standard output display units
                  const displayUnit = p.baseUnit === 'g' ? 'kg' : p.baseUnit === 'mL' ? 'L' : 'items';
                  const isWeightOrVol = p.baseUnit === 'g' || p.baseUnit === 'mL';
                  
                  // Convert database base values into commercial quantities
                  const displayMinQty = isWeightOrVol ? p.minOrderQty / 1000 : p.minOrderQty;
                  const displayAvailable = isWeightOrVol ? p.availableQty / 1000 : p.availableQty;
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
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {displayMinQty.toLocaleString()} <span className="text-gray-400 text-xs">{displayUnit}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {displayAvailable.toLocaleString()} <span className="text-gray-400 text-xs">{displayUnit}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-gray-900">
                        ₹{displayPrice.toLocaleString('en-IN')}/{displayUnit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                          title="Remove product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}