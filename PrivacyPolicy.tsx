
import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';

const PrivacyPolicy: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="max-w-3xl mx-auto w-full py-12 px-6">
      <button onClick={onBack} className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-8 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Calculator
      </button>
      <div className="bg-white rounded-2xl shadow-xl p-10 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-black text-indigo-900">Privacy Policy</h1>
        </div>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
          <p className="font-medium text-slate-800">Effective Date: October 2023</p>
          <p>Your privacy is important to us. It is SmartMortgage's policy to respect your privacy regarding any information we may collect from you across our website.</p>
          
          <h2 className="text-xl font-bold text-indigo-900 pt-4">1. Information We Collect</h2>
          <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
          <p>This calculator is client-side only. We do not store your mortgage balance, interest rates, or extra payment details on our servers.</p>

          <h2 className="text-xl font-bold text-indigo-900 pt-4">2. Data Storage</h2>
          <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use, or modification.</p>

          <h2 className="text-xl font-bold text-indigo-900 pt-4">3. Third-Party Services</h2>
          <p>Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
