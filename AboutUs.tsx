
import React from 'react';
import { Info, ArrowLeft } from 'lucide-react';

const AboutUs: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="max-w-3xl mx-auto w-full py-12 px-6">
      <button onClick={onBack} className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-8 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Calculator
      </button>
      <div className="bg-white rounded-2xl shadow-xl p-10 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
          <Info className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-black text-indigo-900">About SmartMortgage</h1>
        </div>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
          <p>Welcome to SmartMortgage, your premier destination for home financial planning and debt acceleration strategies. Our mission is to provide homeowners with clear, accessible, and high-quality financial tools that help them build wealth through smarter mortgage management.</p>
          
          <h2 className="text-xl font-bold text-indigo-900 pt-4">Our Mission</h2>
          <p>We believe that financial literacy should be free and easy to use. By providing advanced amortization calculators and AI-driven insights, we help you visualize the massive impact that small, consistent extra payments can have on your long-term financial health.</p>

          <h2 className="text-xl font-bold text-indigo-900 pt-4">How It Works</h2>
          <p>Our tool uses standard industry formulas to simulate your loan's life-cycle. Unlike many other calculators, we prioritize your privacy—all calculations happen directly in your browser, meaning your financial data never leaves your device.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
