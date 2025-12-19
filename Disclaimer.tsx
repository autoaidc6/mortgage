
import React from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const Disclaimer: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="max-w-3xl mx-auto w-full py-12 px-6">
      <button onClick={onBack} className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-8 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Calculator
      </button>
      <div className="bg-white rounded-2xl shadow-xl p-10 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
          <AlertCircle className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-black text-indigo-900">Disclaimer</h1>
        </div>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
          <p className="font-bold text-red-600">SmartMortgage is for informational purposes only.</p>
          <p>The calculations provided by our tool are estimates based on user-provided data and common mortgage algorithms. They do not constitute financial advice, nor do they guarantee exact results from your financial institution.</p>
          
          <h2 className="text-xl font-bold text-indigo-900 pt-4">No Financial Advice</h2>
          <p>The information on this website is not intended as financial, legal, or tax advice. You should consult with a qualified financial advisor, mortgage broker, or accountant before making any significant financial decisions.</p>

          <h2 className="text-xl font-bold text-indigo-900 pt-4">Limitation of Liability</h2>
          <p>SmartMortgage and its creators shall not be held liable for any inaccuracies in the data or for any actions taken by users based on the tool's output. Always verify your loan details with your actual lender or via official loan statements.</p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
