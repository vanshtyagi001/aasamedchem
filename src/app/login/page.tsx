'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// 1. SUB-COMPONENT CONTAINING SEARCHPARAMS LOGIC
function LoginContent() {
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Auto-redirect if already logged in
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) {
          if (data.user.role === 'ADMIN') {
            window.location.href = '/admin';
          } else if (data.user.role === 'SELLER') {
            window.location.href = '/seller';
          } else {
            window.location.href = '/buyer';
          }
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
      } else {
        if (data.user.role === 'ADMIN') {
          window.location.href = '/admin';
        } else if (data.user.role === 'SELLER') {
          window.location.href = '/seller';
        } else {
          window.location.href = '/buyer';
        }
      }
    } catch {
      setError('A network error occurred. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center">
        <p className="text-sm font-semibold text-gray-400">Verifying session credentials...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[75vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 border border-gray-200 rounded-xl shadow-sm">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your pharma dashboard
          </p>
        </div>

        {registered && (
          <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-md border border-emerald-200 font-medium text-center">
            Registration completed. Please sign in below.
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200 text-center font-medium">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                id="email-address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-950 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm outline-none"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-955 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full justify-center rounded-md bg-indigo-600 py-2.5 px-4 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

// 2. EXPORTED ENTRY POINT PAGE WRAPPED IN REACT SUSPENSE
export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[75vh] items-center justify-center">
          <p className="text-sm font-semibold text-gray-400">Loading page resources...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}