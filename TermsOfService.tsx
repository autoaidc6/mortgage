
import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';

const TermsOfService: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="max-w-3xl mx-auto w-full py-12 px-6">
      <button onClick={onBack} className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-8 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Calculator
      </button>
      <div className="bg-white rounded-2xl shadow-xl p-10 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
          <FileText className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-black text-indigo-900">Terms of Service</h1>
        </div>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
          <h2 className="text-xl font-bold text-indigo-900 pt-4">1. Acceptance of Terms</h2>
          <p>By accessing the SmartMortgage calculator, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
          
          <h2 className="text-xl font-bold text-indigo-900 pt-4">2. Use License</h2>
          <p>Permission is granted to temporarily use this software for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>

          <h2 className="text-xl font-bold text-indigo-900 pt-4">3. Accuracy of Materials</h2>
          <p>The materials appearing on SmartMortgage's website could include technical, typographical, or photographic errors. SmartMortgage does not warrant that any of the materials on its website are accurate, complete or current.</p>

          <h2 className="text-xl font-bold text-indigo-900 pt-4">4. Governing Law</h2>
          <p>These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
