'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, ClipboardList, BarChart3, ShoppingCart, MessageSquare, MessageCircle } from 'lucide-react';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const sidebarItems = [
    { name: 'Profile', href: '/seller', icon: User },
    { name: 'Inventory', href: '/seller/inventory', icon: ClipboardList },
    { name: 'Analytics', href: '/seller/analytics', icon: BarChart3 },
    { name: 'Order', href: '/buyer/orders', icon: ShoppingCart }, // Routing to standard order database view
    { name: 'Admin Chat', href: '/seller/chat', icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-10rem)] gap-8 relative">
      
      {/* Left Vertical Menu */}
      <aside className="w-full lg:w-64 flex-shrink-0 bg-white border border-gray-200 rounded-xl p-4 shadow-sm h-fit">
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            // Match nested pages or exact root `/seller`
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

      {/* Main Panel Content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Floating Support Widgets (Bottom Right) */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <button className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition focus:outline-none">
          <MessageSquare className="w-6 h-6" />
        </button>
        <button className="p-3 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-600 transition focus:outline-none">
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}