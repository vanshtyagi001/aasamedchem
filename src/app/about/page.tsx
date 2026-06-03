'use client';

import { ShieldCheck, Database, Award, Users, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      title: 'Regulatory Validation',
      desc: 'Every seller on AasaMedChem undergoes manual credential validation, verifying Drug Licenses, corporate GST numbers, and global certificates (WHO-GMP, FDA, CEP).',
      icon: ShieldCheck,
    },
    {
      title: 'Catalog Integrity',
      desc: 'Our sourcing directory is mapped directly to official CAS numbers, providing procurement agents with exact ingredient matching and purity specifications.',
      icon: Database,
    },
    {
      title: 'Global Delivery Standard',
      desc: 'We support international trade desks by enforcing standardized DMF documentation, MSDS verification, and secure, high-precision quotation workflows.',
      icon: Award,
    },
  ];

  return (
    <div className="space-y-12 py-4">
      
      {/* Hero Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 lg:p-12 shadow-sm text-center max-w-4xl mx-auto space-y-4">
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 uppercase tracking-wider">
          Who We Are
        </span>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
          Connecting Global Pharmaceutical Procurement
        </h1>
        <p className="text-base text-gray-500 leading-relaxed max-w-2xl mx-auto">
          AasaMedChem is an advanced B2B sourcing marketplace designed to bridge active pharmaceutical ingredient (API) manufacturers, excipient suppliers, and global clinical buyers under a unified, compliant ecosystem.
        </p>
      </div>

      {/* Trust Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {values.map((v) => {
          const Icon = v.icon;
          return (
            <div key={v.title} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg w-fit">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">{v.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Compliance Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-md">
          <h2 className="text-xl font-bold text-gray-900">GMP & ISO Standard Portal</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Our trade network complies with ISO 9001 and local pharmaceutical regulatory standards, ensuring secure transactions and complete accountability on all custom quotations.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-gray-700">
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> GMP Verified</div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> CEP Certified</div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> FDA Inspected</div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> ISO Compliant</div>
        </div>
      </div>

    </div>
  );
}