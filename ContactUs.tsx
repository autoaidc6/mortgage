
import React from 'react';
import { Mail, ArrowLeft, MapPin, Globe } from 'lucide-react';

const ContactUs: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="max-w-3xl mx-auto w-full py-12 px-6">
      <button onClick={onBack} className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-8 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Calculator
      </button>
      <div className="bg-white rounded-2xl shadow-xl p-10 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
          <Mail className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-black text-indigo-900">Contact Us</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-indigo-900">Get in Touch</h2>
            <p className="text-slate-600">Have questions about our calculator or want to suggest a feature? We'd love to hear from you.</p>
            
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <p className="font-bold text-slate-800">Email</p>
                <p className="text-slate-600 text-sm">support@smartmortgage.example.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <p className="font-bold text-slate-800">Website</p>
                <p className="text-slate-600 text-sm">www.smartmortgage.example.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <p className="font-bold text-slate-800">Office</p>
                <p className="text-slate-600 text-sm">123 Financial Plaza, Suite 400<br/>New York, NY 10001</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <h3 className="font-bold text-indigo-900 mb-4">Support Hours</h3>
            <ul className="text-sm text-slate-600 space-y-2">
              <li className="flex justify-between"><span>Mon - Fri:</span><span>9:00 AM - 5:00 PM EST</span></li>
              <li className="flex justify-between"><span>Saturday:</span><span>10:00 AM - 2:00 PM EST</span></li>
              <li className="flex justify-between"><span>Sunday:</span><span>Closed</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
