'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Activity, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState<{ email: string; role: string; isVerified: boolean } | null>(null);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const payload = await res.json();
        if (payload?.user) {
          setUser(payload.user);
        }
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  // Determine dashboard link based on role
  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'SELLER') return '/seller';
    return '/buyer';
  };

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          
          {/* LEFT SECTION: Logo */}
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-indigo-600" />
            <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
              AasaMedChem
            </Link>
          </div>

          {/* CENTER SECTION: Static Navigation */}
          <div className="hidden md:flex space-x-8 text-sm font-semibold text-gray-500">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link href="/search" className="hover:text-gray-900 transition-colors">
              Search
            </Link>
            <Link href="/about" className="hover:text-gray-900 transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-gray-900 transition-colors">
              Contact Us
            </Link>
          </div>

          {/* RIGHT SECTION: Avatar, Logout */}
          <div className="flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-4">
                
                {/* Dummy User Profile Avatar linking to Dashboard */}
                <Link 
                  href={getDashboardLink()} 
                  className="flex items-center space-x-2 p-1 rounded-full border border-gray-200 hover:border-indigo-600 transition group focus:outline-none"
                  title="Go to Dashboard"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition">
                    <User className="w-4 h-4" />
                  </div>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm font-semibold text-gray-500 hover:text-red-600 gap-1.5 transition-colors focus:outline-none"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500 transition shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}