'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, ShieldCheck } from 'lucide-react';

export default function SellerInventory() {
  const router = useRouter();
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

  const availableCertifications = [
    'GMP', 'CEP', 'WC', 'FDA', 'COA', 'ISO9001', 'GDP', 'MSDS', 'BSE_TSE', 'WHO_GMP'
  ];

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

    if (res.ok) {
      alert('Product published successfully!');
      router.push('/');
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to list product');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4">
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 border-b pb-4 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-indigo-600" /> List a New Product
        </h1>

        <form onSubmit={handlePublish} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Product Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
                placeholder="e.g., Paracetamol"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
              >
                <option value="API">API (Active Ingredients)</option>
                <option value="Excipient">Excipients</option>
                <option value="Intermediate">Intermediates</option>
                <option value="Packaging">Packaging Material</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">CAS Number *</label>
              <input
                type="text"
                required
                value={form.casNumber}
                onChange={(e) => setForm({ ...form, casNumber: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
                placeholder="e.g., 103-90-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Purity % *</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.purity}
                onChange={(e) => setForm({ ...form, purity: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
                placeholder="e.g., 99.8"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Unit Type *</label>
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
              >
                <option value="kg">kg (kilogram)</option>
                <option value="g">g (gram)</option>
                <option value="L">L (liter)</option>
                <option value="mL">mL (milliliter)</option>
                <option value="items">items (count)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Base Price (₹ / unit selected) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
                placeholder="e.g., 1500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Min Order Qty *</label>
              <input
                type="number"
                required
                value={form.minOrderQty}
                onChange={(e) => setForm({ ...form, minOrderQty: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
                placeholder="e.g., 100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Available Stock Qty *</label>
              <input
                type="number"
                required
                value={form.availableQty}
                onChange={(e) => setForm({ ...form, availableQty: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
                placeholder="e.g., 1000"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Certifications</label>
            <div className="flex flex-wrap gap-2">
              {availableCertifications.map((cert) => (
                <button
                  key={cert}
                  type="button"
                  onClick={() => handleToggleCert(cert)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition ${
                    form.certifications.includes(cert)
                      ? 'bg-indigo-600 text-white border border-indigo-600'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {cert}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700">Product Specifications / Notes</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
              placeholder="Provide solubility profile, storage guidelines, and transport requirements..."
            />
          </div>

          <div className="pt-4 border-t flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded shadow transition"
            >
              Publish Listed Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}