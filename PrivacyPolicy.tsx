
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
          <p className="font-medium text-slate-800">Effective Date: January 1, 2025</p>
          <p>Your privacy is important to us. It is SmartMortgage's policy to respect your privacy regarding any information we may collect from you across our website.</p>
          
          <h2 className="text-xl font-bold text-indigo-900 pt-4">1. Information We Collect</h2>
          <p>We do not collect personal identifying information. This calculator is client-side only. We do not store your mortgage balance, interest rates, or extra payment details on our servers.</p>

          <h2 className="text-xl font-bold text-indigo-900 pt-4">2. Google AdSense and Cookies</h2>
          <p>We use third-party advertising companies to serve ads when you visit our website. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
            <li>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-blue-600 underline">Ads Settings</a>.</li>
          </ul>

          <h2 className="text-xl font-bold text-indigo-900 pt-4">3. Log Files</h2>
          <p>Like many other Web sites, SmartMortgage makes use of log files. The information inside the log files includes internet protocol ( IP ) addresses, type of browser, Internet Service Provider ( ISP ), date/time stamp, referring/exit pages, and number of clicks to analyze trends, administer the site, track user’s movement around the site, and gather demographic information.</p>

          <h2 className="text-xl font-bold text-indigo-900 pt-4">4. Consent</h2>
          <p>By using our website, you hereby consent to our privacy policy and agree to its terms.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
