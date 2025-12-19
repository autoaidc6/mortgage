
import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Home, Calculator, PiggyBank, ArrowRight, Lightbulb, Info, Globe } from 'lucide-react';
import InputGroup from './components/InputGroup';
import { MortgageInputs } from './types';
import { calculateMortgage, formatCurrency, getCurrencySymbol } from './services/mortgageCalculator';

const CURRENCIES = [
  { code: 'USD', label: 'US Dollar ($)' },
  { code: 'EUR', label: 'Euro (€)' },
  { code: 'GBP', label: 'British Pound (£)' },
  { code: 'JPY', label: 'Japanese Yen (¥)' },
  { code: 'CAD', label: 'Canadian Dollar (C$)' },
  { code: 'AUD', label: 'Australian Dollar (A$)' },
  { code: 'CHF', label: 'Swiss Franc (CHF)' },
  { code: 'INR', label: 'Indian Rupee (₹)' },
];

const App: React.FC = () => {
  const [inputs, setInputs] = useState<MortgageInputs>({
    balance: 350000,
    interestRate: 6.5,
    loanTerm: 30,
    oneTimePayment: 10000,
    currency: 'USD'
  });

  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const results = useMemo(() => calculateMortgage(inputs), [inputs]);

  const getAiInsight = async () => {
    setLoadingAi(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Act as a senior mortgage advisor. Analyze these results for a user who is considering a ONE-TIME lump sum payment:
        Mortgage Balance: ${inputs.balance} (${inputs.currency})
        Interest Rate: ${inputs.interestRate}%
        One-Time Lump Sum Payment: ${inputs.oneTimePayment}
        Total Interest Saved: ${results.totalSavings}
        Time Saved: ${Math.floor(results.monthsSaved / 12)} years and ${results.monthsSaved % 12} months.
        Provide a concise, motivating 3-sentence insight about how this single action impacts their financial freedom. Mention how lump sum payments early in the loan are much more powerful than late ones.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAiInsight(response.text || "A single lump sum payment drastically reduces your interest overhead over time.");
    } catch (error) {
      console.error("AI Error:", error);
      setAiInsight("Lump sum payments are highly effective at reducing the total interest paid, especially when done early in the loan term.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleInputChange = (key: keyof MortgageInputs, value: number | string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const currentSymbol = getCurrencySymbol(inputs.currency);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <header className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
              <Home className="text-white w-6 h-6" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">SmartMortgage</h1>
          </div>
          <p className="text-slate-500 font-medium">Visualize the power of a single lump-sum payment.</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl px-6 py-4 flex flex-wrap items-center gap-6 shadow-sm justify-center md:justify-end">
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Base Payment</p>
            <p className="text-2xl font-black text-slate-800">{formatCurrency(results.standardMonthlyPayment, inputs.currency)}</p>
          </div>
          <div className="hidden sm:block h-10 w-[1px] bg-slate-200"></div>
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-widest">Total Interest Saved</p>
            <p className="text-2xl font-black text-emerald-600">{formatCurrency(results.totalSavings, inputs.currency)}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-800">Loan Details</h2>
              </div>
              <div className="relative">
                <select 
                  value={inputs.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200 rounded-lg py-1 px-8 text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.code}</option>
                  ))}
                </select>
                <Globe className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="space-y-6">
              <InputGroup 
                label="Mortgage Balance" 
                value={inputs.balance} 
                onChange={(v) => handleInputChange('balance', v)}
                prefix={currentSymbol}
                tooltip="The current remaining principal on your loan."
              />
              <InputGroup 
                label="Interest Rate (APR)" 
                value={inputs.interestRate} 
                onChange={(v) => handleInputChange('interestRate', v)}
                suffix="%"
                step={0.1}
                tooltip="Your annual percentage rate for the mortgage."
              />
              <InputGroup 
                label="Loan Term" 
                value={inputs.loanTerm} 
                onChange={(v) => handleInputChange('loanTerm', v)}
                suffix="YRS"
                tooltip="Original length of your loan agreement."
              />
              
              <div className="pt-4 border-t border-slate-100">
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                  <InputGroup 
                    label="One-Time Extra Payment" 
                    value={inputs.oneTimePayment} 
                    onChange={(v) => handleInputChange('oneTimePayment', v)}
                    prefix={currentSymbol}
                    tooltip="A single lump-sum amount you plan to pay toward your principal today."
                  />
                  <p className="text-xs text-emerald-700/70 mt-3 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Applied directly to principal once, immediately.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* AI Advisor Button */}
          <button 
            onClick={getAiInsight}
            disabled={loadingAi}
            className="w-full bg-slate-900 hover:bg-black text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all group active:scale-95 disabled:opacity-50 shadow-lg"
          >
            {loadingAi ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" />
            ) : (
              <>
                <Lightbulb className="w-5 h-5 text-yellow-400 group-hover:animate-pulse" />
                Analyze Lump Sum Impact
              </>
            )}
          </button>

          {aiInsight && (
            <div className="bg-white p-6 rounded-2xl border-l-4 border-l-blue-600 shadow-md animate-in fade-in slide-in-from-bottom-2 duration-500">
              <p className="text-sm text-slate-700 leading-relaxed italic">"{aiInsight}"</p>
            </div>
          )}
        </div>

        {/* Right Column: Key Results */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-8 rounded-3xl text-white shadow-xl shadow-emerald-200 flex flex-col justify-between">
              <div>
                <div className="bg-white/20 w-fit p-3 rounded-2xl mb-4">
                  <PiggyBank className="w-8 h-8" />
                </div>
                <h3 className="text-emerald-100 font-medium uppercase text-xs tracking-widest mb-1">Total Savings</h3>
                <p className="text-5xl font-black mb-2">{formatCurrency(results.totalSavings, inputs.currency)}</p>
              </div>
              <p className="text-emerald-100/80 text-sm">By paying {formatCurrency(inputs.oneTimePayment, inputs.currency)} once, you avoid this massive interest cost over {inputs.loanTerm} years.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-slate-400 font-medium uppercase text-xs tracking-widest mb-4">Maturity Advanced</h3>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-black text-slate-800">{inputs.loanTerm}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Original Yrs</p>
                  </div>
                  <ArrowRight className="text-slate-200" />
                  <div className="text-center bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
                    <p className="text-3xl font-black text-emerald-600">{results.yearsToPayoff.toFixed(1)}</p>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase">New Payoff (Yrs)</p>
                  </div>
                </div>
              </div>
              <p className="text-slate-500 text-sm mt-6 font-medium">
                This single check saves you <span className="text-emerald-600 font-bold">{Math.floor(results.monthsSaved / 12)} years and {results.monthsSaved % 12} months</span> of mortgage payments.
              </p>
            </div>
          </div>

          {/* Educational Content */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Why Lump Sum Payments Work</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-600 leading-relaxed">
              <div>
                <p className="font-semibold text-slate-800 mb-1">Interest Avoidance</p>
                <p>Every dollar you pay today stops generating interest for the rest of the loan term. At 6.5%, a ${formatCurrency(inputs.oneTimePayment, inputs.currency)} payment today prevents roughly ${formatCurrency(results.totalSavings, inputs.currency)} in interest over 30 years.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-800 mb-1">Equity Velocity</p>
                <p>One-time payments skip the "interest-heavy" early years of your amortization schedule, directly attacking the principal balance and accelerating your path to 100% ownership.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-16 text-center text-slate-400 text-xs border-t border-slate-200 pt-8">
        <p>© {new Date().getFullYear()} SmartMortgage. Calculations are estimates. Check with your lender for exact figures.</p>
      </footer>
    </div>
  );
};

export default App;
