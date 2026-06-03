'import React';
import Link from 'next/link';
import { Activity, ShieldCheck, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-gray-100">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-indigo-600" />
              <span className="text-lg font-bold text-gray-900 tracking-tight">AasaMedChem</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              A premium B2B pharmaceutical marketplace connecting verified API manufacturers, chemical suppliers, and global procurement buyers.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-2 w-fit">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span className="font-semibold">ISO 9001 & GMP Compliant Portal</span>
            </div>
          </div>

          {/* Directory Links */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Sourcing Categories</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link href="/" className="hover:text-gray-900">Active Pharmaceutical Ingredients (APIs)</Link></li>
              <li><Link href="/" className="hover:text-gray-900">Excipients & Intermediates</Link></li>
              <li><Link href="/" className="hover:text-gray-900">Chemical Raw Materials</Link></li>
              <li><Link href="/" className="hover:text-gray-900">Pharma Packaging & Equipment</Link></li>
            </ul>
          </div>

          {/* Compliance & Trade Info */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Quality & Standards</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-center gap-1.5">US-DMF & EDMF Filing Support</li>
              <li className="flex items-center gap-1.5">CEP/COS Documentation</li>
              <li className="flex items-center gap-1.5">WHO-GMP Verified Suppliers</li>
              <li className="flex items-center gap-1.5">COA & MSDS Security Downloads</li>
            </ul>
          </div>

          {/* Corporate Contact */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Global Trade Desk</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span>Navi Mumbai, Maharashtra, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <a href="mailto:sourcing@aasamedchem.com" className="hover:text-gray-900">sourcing@aasamedchem.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span>+91-22-XXXXXXXX</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Row */}
        <div className="flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-400 gap-4">
          <div>
            &copy; {new Date().getFullYear()} AasaMedChem Marketplace. All trade rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link href="/" className="hover:text-gray-600">Privacy Policy</Link>
            <Link href="/" className="hover:text-gray-600">Terms of Trade</Link>
            <a href="https://aasamedchem.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 flex items-center gap-1">
              Official Website <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}