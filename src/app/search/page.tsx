'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search as SearchIcon, 
  Filter, 
  CheckCircle2, 
  ShoppingCart, 
  Tag, 
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { getUnitPriceForUnit, calculateTotalPrice } from '@/lib/conversions';

export default function SearchPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPurity, setMinPurity] = useState<number>(0);
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);

  // Form states mapped by Product ID
  const [quoteQtys, setQuoteQtys] = useState<Record<string, number>>({});
  const [quoteUnits, setQuoteUnits] = useState<Record<string, string>>({});
  const [notifications, setNotifications] = useState<Record<string, string>>({});

  const availableCertifications = ['GMP', 'CEP', 'WC', 'FDA', 'COA', 'ISO9001', 'WHO_GMP'];

  useEffect(() => {
    // Retrieve active logged-in session profile
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUser(d?.user));
    
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch('/api/products');
    if (res.ok) {
      const data = await res.json();
      setProducts(data.products);
    }
    setLoading(false);
  };

  // Toggle dynamic certifications in left sidebar filter
  const handleToggleCert = (cert: string) => {
    if (selectedCerts.includes(cert)) {
      setSelectedCerts(selectedCerts.filter((c) => c !== cert));
    } else {
      setSelectedCerts([...selectedCerts, cert]);
    }
  };

  // Reset all search and filter fields
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setMinPurity(0);
    setSelectedCerts([]);
  };

  // Filter products locally on client side for responsive instant-update UX
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.casNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === '' || product.category === selectedCategory;
    
    const matchesPurity = 
      Number(product.purity) >= minPurity;
    
    const matchesCerts = 
      selectedCerts.length === 0 || 
      selectedCerts.every((cert) => product.certifications.includes(cert));

    return matchesSearch && matchesCategory && matchesPurity && matchesCerts;
  });

  const handleSendQuote = async (productId: string) => {
    const qty = quoteQtys[productId] || 0;
    const unit = quoteUnits[productId] || 'kg';

    if (qty <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: qty, orderedUnit: unit }),
    });

    const data = await res.json();
    if (res.ok) {
      setNotifications({ ...notifications, [productId]: 'Quotation request sent! Track under My Orders.' });
      setQuoteQtys({ ...quoteQtys, [productId]: 0 });
    } else {
      alert(data.error || 'Failed to submit quote request. Ensure quantity meets minimum order requirement (MOQ).');
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Title & Subtitle Section */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-indigo-600" /> B2B Sourcing Directory
        </h1>
        <p className="text-sm text-gray-500">Filter chemical assets by CAS registries, purity standards, and global compliance certifications</p>
      </div>

      {/* 1. PROMINENT TOP SEARCH CONSOLE BAR */}
      <section className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 w-full rounded-xl border border-gray-300 py-3.5 text-sm text-gray-950 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none shadow-sm"
            placeholder="Search active chemicals, pharmaceutical ingredients, or CAS registry numbers (e.g., 103-90-2)..."
          />
        </div>
      </section>

      {/* Main Content Area: Sidebar on left, Results on right */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* 2. LEFT SIDEBAR FILTERS */}
        <aside className="w-full lg:w-64 flex-shrink-0 bg-white border border-gray-200 rounded-xl p-5 shadow-sm h-fit space-y-6 sticky top-20">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-gray-500" /> Advanced Filters
            </span>
            <button 
              onClick={handleResetFilters}
              className="text-xs text-indigo-600 hover:text-indigo-500 font-semibold flex items-center gap-1"
              title="Reset Filters"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Trade Category Radios */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-gray-400">Category</label>
            <div className="space-y-1.5">
              {['', 'API', 'Excipient', 'Intermediate', 'Packaging'].map((cat) => (
                <label key={cat} className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat)}
                    className="text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                  <span>{cat === '' ? 'All Categories' : cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Purity Standard Radios */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-gray-400">Min Purity Threshold</label>
            <div className="space-y-1.5">
              {[0, 95, 98, 99].map((pct) => (
                <label key={pct} className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer">
                  <input
                    type="radio"
                    name="purity"
                    checked={minPurity === pct}
                    onChange={() => setMinPurity(pct)}
                    className="text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                  <span>{pct === 0 ? 'Any Purity' : `${pct}%+`}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Regulatory Certifications Checklist */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-gray-400">Required Standards</label>
            <div className="space-y-1.5">
              {availableCertifications.map((cert) => (
                <label key={cert} className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCerts.includes(cert)}
                    onChange={() => handleToggleCert(cert)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                  <span>{cert}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* 3. RIGHT COLUMN: DYNAMIC RESULTS FEED */}
        <section className="flex-1 space-y-6">
          <div className="flex justify-between items-center bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-sm text-sm">
            <span className="text-gray-500">
              Showing <strong className="text-gray-900">{filteredProducts.length}</strong> catalog assets
            </span>
            <span className="text-xs text-gray-400 font-medium">Auto-filtering enabled</span>
          </div>

          {loading ? (
            <p className="text-center text-gray-500 py-12">Retrieving directory assets...</p>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white border border-gray-200 text-center py-16 px-4 rounded-xl shadow-sm">
              <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-semibold">No chemical assets found matching your active search filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProducts.map((product) => {
                const selectedUnit = quoteUnits[product.id] || 'kg';
                const enteredQty = quoteQtys[product.id] || 0;
                const displayPrice = getUnitPriceForUnit(Number(product.pricePerBaseUnit), selectedUnit as any);
                const totalEstimated = calculateTotalPrice(enteredQty, selectedUnit as any, Number(product.pricePerBaseUnit));

                return (
                  <div key={product.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow transition flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-gray-700 px-2.5 py-1 rounded">
                          {product.category}
                        </span>
                        <span className="text-xs text-gray-400 font-mono font-semibold">CAS: {product.casNumber}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                      <p className="text-xs text-indigo-600 font-bold mb-3">Purity: {Number(product.purity)}%</p>
                      <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                        {product.description || 'No additional technical specifications provided.'}
                      </p>

                      {/* Certifications row */}
                      {product.certifications.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {product.certifications.map((tag: string) => (
                            <span key={tag} className="text-[9px] font-extrabold bg-emerald-50 border border-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Form converter block */}
                    <div className="border-t border-gray-100 pt-4 mt-2">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Unit Price</span>
                          <span className="text-base font-bold text-gray-900">
                            ₹{displayPrice.toLocaleString('en-IN')}/{selectedUnit}
                          </span>
                        </div>
                        <select
                          value={selectedUnit}
                          onChange={(e) => setQuoteUnits({ ...quoteUnits, [product.id]: e.target.value })}
                          className="text-xs font-semibold border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
                        >
                          <option value="kg">kilograms (kg)</option>
                          <option value="g">grams (g)</option>
                          <option value="L">liters (L)</option>
                          <option value="mL">milliliters (mL)</option>
                          <option value="items">items (count)</option>
                        </select>
                      </div>

                      <div className="space-y-3">
                        <div className="flex gap-2 items-center">
                          <input
                            type="number"
                            min="1"
                            placeholder="Sourcing Qty"
                            value={enteredQty || ''}
                            onChange={(e) => setQuoteQtys({ ...quoteQtys, [product.id]: parseFloat(e.target.value) || 0 })}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-indigo-500"
                          />
                          <button
                            onClick={() => handleSendQuote(product.id)}
                            disabled={!user || user.role !== 'BUYER' || !user.isVerified}
                            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-1.5 transition shadow-sm flex-shrink-0"
                          >
                            <ShoppingCart className="w-4 h-4" /> Request Quote
                          </button>
                        </div>

                        {/* Interactive notices */}
                        {!user && (
                          <p className="text-[10px] text-gray-400 text-center">
                            Please <Link href="/login" className="text-indigo-600 font-bold underline">log in as Buyer</Link> to initiate sourcing.
                          </p>
                        )}

                        {user && user.role !== 'BUYER' && (
                          <p className="text-[10px] text-amber-600 text-center font-semibold">
                            Only Buyer accounts can initiate transactions.
                          </p>
                        )}

                        {user?.role === 'BUYER' && !user.isVerified && (
                          <p className="text-[10px] text-amber-600 text-center font-semibold">
                            Verification required. Complete profile setup first.
                          </p>
                        )}

                        {enteredQty > 0 && (
                          <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs flex justify-between items-center">
                            <span className="text-gray-500">Estimated Quote:</span>
                            <strong className="text-gray-900 text-sm">₹{totalEstimated.toLocaleString('en-IN')}</strong>
                          </div>
                        )}

                        {notifications[product.id] && (
                          <div className="p-2 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-1.5 justify-center">
                            <CheckCircle2 className="w-4 h-4" /> {notifications[product.id]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}