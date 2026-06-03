'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, UserCheck, ClipboardList, Landmark } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const sidebarItems = [
    { name: 'Verifications', href: '/admin', icon: UserCheck },
    { name: 'Platform Catalog', href: '/admin/catalog', icon: ClipboardList },
    { name: 'Transaction Ledger', href: '/admin/transactions', icon: Landmark },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-10rem)] gap-8">
      
      {/* Left Vertical Menu */}
      <aside className="w-full lg:w-64 flex-shrink-0 bg-white border border-gray-200 rounded-xl p-4 shadow-sm h-fit">
        <div className="px-3 py-2 border-b border-gray-100 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-red-600" />
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Admin Console</p>
        </div>
        
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-slate-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Administrative Panel Content */}
      <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6 shadow-sm min-h-[500px]">
        {children}
      </div>
    </div>
  );
}