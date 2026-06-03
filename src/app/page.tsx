'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  CheckCircle2, 
  ShoppingCart, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  Globe, 
  Database, 
  Truck 
} from 'lucide-react';
import { getUnitPriceForUnit, calculateTotalPrice, convertFromBaseQty } from '@/lib/conversions';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [user, setUser] = useState<any>(null);

  // Form states mapped by Product ID
  const [quoteQtys, setQuoteQtys] = useState<Record<string, number>>({});
  const [quoteUnits, setQuoteUnits] = useState<Record<string, string>>({});
  const [notifications, setNotifications] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => setUser(d?.user));
    
    fetchProducts();
  }, [search, category]);

  const fetchProducts = async () => {
    const res = await fetch(`/api/products?search=${search}&category=${category}`);
    if (res.ok) {
      const data = await res.json();
      setProducts(data.products);
    }
  };

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
      alert(data.error || 'Failed to request quote. Please check MOQ requirements.');
    }
  };

  return (
    <div className="space-y-12 py-4">
      
      {/* Hero Section */}
      <section className="bg-white border border-gray-200 rounded-2xl p-8 lg:p-12 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Pharmaceutical Sourcing Marketplace</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Direct Procurement of <br />
            <span className="text-indigo-600">APIs, Excipients & Intermediates</span>
          </h1>
          <p className="text-base text-gray-500 leading-relaxed">
            AasaMedChem connects global pharmaceutical buyers with audited, GMP-compliant chemical manufacturers. Instantly search active directories, calculate price conversions, and submit formal quotations securely.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            {!user && (
              <>
                <Link
                  href="/register"
                  className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-5 py-3 shadow-sm flex items-center gap-2 transition"
                >
                  Create Buyer Account <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg border border-gray-300 bg-white hover:bg-slate-50 text-gray-700 font-bold text-sm px-5 py-3 transition"
                >
                  Seller Log In
                </Link>
              </>
            )}
            {user && (
              <Link
                href={user.role === 'SELLER' ? '/seller' : '/buyer'}
                className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-5 py-3 shadow-sm flex items-center gap-2 transition"
              >
                Go to Dashboard Console <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
        
        {/* Quality Badges */}
        <div className="grid grid-cols-2 gap-4 w-full lg:w-96 flex-shrink-0">
          <div className="border border-gray-100 bg-slate-50 rounded-xl p-4 text-center">
            <Database className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <h3 className="font-bold text-gray-900 text-sm">Active Directory</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Verified CAS catalogs</p>
          </div>
          <div className="border border-gray-100 bg-slate-50 rounded-xl p-4 text-center">
            <Globe className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <h3 className="font-bold text-gray-900 text-sm">International Trade</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">DMF & CEP filings</p>
          </div>
          <div className="border border-gray-100 bg-slate-50 rounded-xl p-4 text-center">
            <ShieldCheck className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <h3 className="font-bold text-gray-900 text-sm">GMP Audited</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Strict regulatory vetting</p>
          </div>
          <div className="border border-gray-100 bg-slate-50 rounded-xl p-4 text-center">
            <Truck className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <h3 className="font-bold text-gray-900 text-sm">Supply Logistics</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Secured global supply</p>
          </div>
        </div>
      </section>

      {/* Directory Search Console */}
      <section className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Marketplace Search Directory</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full rounded-lg border border-gray-300 py-2.5 text-sm text-gray-955 focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 outline-none"
              placeholder="Enter active chemical name, ingredient, or CAS number..."
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-gray-300 py-2.5 px-4 text-sm focus:border-indigo-500 text-gray-700 outline-none"
          >
            <option value="">All Trade Categories</option>
            <option value="API">API (Active Ingredients)</option>
            <option value="Excipient">Excipients</option>
            <option value="Intermediate">Intermediates</option>
            <option value="Packaging">Packaging Material</option>
          </select>
        </div>
      </section>

      {/* Product Listings Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Current Chemical Listings</h2>
          <span className="text-xs font-semibold text-gray-500 bg-slate-100 px-3 py-1 rounded-full">
            {products.length} Products Available
          </span>
        </div>

        {products.length === 0 ? (
          <div className="bg-white border border-gray-200 text-center py-16 px-4 rounded-2xl">
            <Database className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm font-semibold">No products found matching your search filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const selectedUnit = quoteUnits[product.id] || 'kg';
              const enteredQty = quoteQtys[product.id] || 0;
              const displayPrice = getUnitPriceForUnit(Number(product.pricePerBaseUnit), selectedUnit as any);
              const totalEstimated = calculateTotalPrice(enteredQty, selectedUnit as any, Number(product.pricePerBaseUnit));

              // DYNAMICALLY CONVERT MOQ & AVAILABLE STOCK
              const displayMinQty = convertFromBaseQty(Number(product.minOrderQty), selectedUnit as any);
              const displayAvailableQty = convertFromBaseQty(Number(product.availableQty), selectedUnit as any);

              return (
                <div key={product.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow transition flex flex-col justify-between">
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

                    {/* Certifications Row */}
                    {product.certifications.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {product.certifications.map((tag: string) => (
                          <span key={tag} className="text-[9px] font-extrabold bg-emerald-50 border border-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* MOQ AND STOCK INDICATORS (Dynamic scaling based on unit selected) */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 bg-slate-50 p-2.5 rounded-lg mb-6 border border-slate-100 font-medium">
                      <div>
                        <span className="text-gray-400 block uppercase tracking-wider text-[9px] font-bold">Min. Order (MOQ)</span>
                        <span className="text-gray-800 font-semibold">{displayMinQty.toLocaleString()} {selectedUnit}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block uppercase tracking-wider text-[9px] font-bold">Available Stock</span>
                        <span className="text-gray-800 font-semibold">{displayAvailableQty.toLocaleString()} {selectedUnit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Form Console Block */}
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
                        className="text-xs font-semibold border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none bg-white"
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
                          placeholder="Sourcing Quantity"
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

                      {/* Info & Notices */}
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
                          Identity verification is required. Complete profile configuration.
                        </p>
                      )}

                      {enteredQty > 0 && (
                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs flex justify-between items-center">
                          <span className="text-gray-500">Estimated Quote Value:</span>
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
  );
}