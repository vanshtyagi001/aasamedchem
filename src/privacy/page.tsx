'use client';

import { FileText, Lock, Globe, Server } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Information We Collect',
      desc: 'We collect corporate identity credentials (GST numbers, Drug Licenses, and corporate emails) to maintain the security and verification standard required of a professional B2B pharmaceutical marketplace.',
      icon: FileText,
    },
    {
      title: '2. Data Protection & Security',
      desc: 'Your financial metrics, company profiles, and custom quotation agreements are protected by advanced SSL encryption protocols and stored securely in cloud-hosted Neon database environments.',
      icon: Lock,
    },
    {
      title: '3. International Compliance',
      desc: 'We respect data privacy frameworks and corporate trade compliance guidelines, ensuring your information is only accessible to manually verified buyers and manufacturers in accordance with current trade desk regulations.',
      icon: Server,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-indigo-600" /> Privacy & Data Security Policy
        </h1>
        <p className="text-sm text-gray-500">How we protect trade identity details and transaction records</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 lg:p-8 shadow-sm space-y-6">
        <p className="text-xs text-gray-400">Last updated: June 2026</p>
        
        <p className="text-sm text-gray-600 leading-relaxed">
          At AasaMedChem, we recognize the critical nature of corporate data safety and compliance inside the B2B drug and chemical supply chain. This policy outlines how your business details, active listings, and transaction volumes are managed.
        </p>

        <div className="space-y-6 pt-4 border-t border-gray-100">
          {sections.map((s) => (
            <div key={s.title} className="flex gap-4">
              <div className="p-2.5 bg-slate-50 text-gray-400 rounded-lg h-fit flex-shrink-0">
                <s.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-900 text-sm">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}