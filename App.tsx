
import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Calculator, Clock, DollarSign, TrendingUp, ChevronDown, Sparkles } from 'lucide-react';
import InputGroup from './components/InputGroup';
import { MortgageInputs } from './types';
import { calculateMortgage, formatCurrency, getCurrencySymbol } from './services/mortgageCalculator';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<MortgageInputs>({
    balance: 300000,
    interestRate: 6.5,
    loanTerm: 30,
    oneTimePayment: 10000,
    currency: 'USD'
  });

  const [hasCalculated, setHasCalculated] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const results = useMemo(() => calculateMortgage(inputs), [inputs]);

  const handleCalculate = () => {
    setHasCalculated(true);
    // Optional: Reset AI insight on new calculation if needed, 
    // or keep it to allow manual trigger.
  };

  const getAiInsight = async () => {
    setLoadingAi(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analyze: Mortgage ${inputs.balance}, Rate ${inputs.interestRate}%, One-time extra ${inputs.oneTimePayment}. 
      Saved: ${results.totalSavings}, Time: ${Math.floor(results.monthsSaved / 12)} years. 
      Give a 2-sentence punchy advisor insight about why this specific lump sum is a wealth-building genius move.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAiInsight(response.text || "This lump sum drastically cuts your long-term interest costs.");
    } catch (error) {
      setAiInsight("Lump sum payments drastically reduce interest when applied early.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleInputChange = (key: keyof MortgageInputs, value: string) => {
    setInputs(prev => ({ ...prev, [key]: key === 'currency' ? value : Number(value) }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 gap-12">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-indigo-900 tracking-tight">Mortgage Payoff Calculator</h1>
        <p className="text-blue-600 font-medium">Discover how much money you can save with an extra mortgage payment</p>
      </div>

      {/* Main Calculator Content */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* Left Card: Input Form */}
        <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-indigo-900">Calculate Your Savings</h2>
            <p className="text-xs text-blue-500 font-medium">Enter your mortgage details below</p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Payment Type</label>
              <div className="relative">
                <select className="w-full border border-slate-300 rounded-md py-2 px-3 text-sm text-slate-700 appearance-none bg-white outline-none">
                  <option>One-Time Extra Payoff</option>
                  <option disabled>Monthly Extra (Coming Soon)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <InputGroup 
              label={`One-Time Extra Payoff (${getCurrencySymbol(inputs.currency)})`}
              required
              value={inputs.oneTimePayment}
              onChange={(v) => handleInputChange('oneTimePayment', v)}
              placeholder="e.g., 10000"
            />

            <InputGroup 
              label={`Total Mortgage Amount (${getCurrencySymbol(inputs.currency)})`}
              value={inputs.balance}
              onChange={(v) => handleInputChange('balance', v)}
            />

            <InputGroup 
              label="Annual Interest Rate (%)"
              value={inputs.interestRate}
              onChange={(v) => handleInputChange('interestRate', v)}
            />

            <InputGroup 
              label="Mortgage Term (Years)"
              value={inputs.loanTerm}
              onChange={(v) => handleInputChange('loanTerm', v)}
            />
          </div>

          <button 
            onClick={handleCalculate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md flex items-center justify-center gap-2 transition-colors mt-2"
          >
            <Calculator className="w-4 h-4" />
            Calculate Savings
          </button>
        </div>

        {/* Right Card: Results Display */}
        <div className="bg-white rounded-xl shadow-xl flex items-center justify-center p-8 text-center min-h-[500px]">
          {!hasCalculated ? (
            <div className="flex flex-col items-center gap-4 text-blue-400">
              <TrendingUp className="w-16 h-16 opacity-40 rotate-180 scale-y-[-1]" />
              <p className="text-sm font-medium text-blue-500/80 px-12">
                Enter your mortgage details to see your potential savings
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col h-full animate-in fade-in duration-500">
              <div className="mb-12">
                <h3 className="text-lg font-bold text-indigo-900 mb-8">Estimated Total Savings</h3>
                <div className="flex flex-col gap-2">
                  <span className="text-6xl font-black text-indigo-900 tracking-tighter">
                    {formatCurrency(results.totalSavings, inputs.currency)}
                  </span>
                  <p className="text-blue-500 font-bold text-sm uppercase tracking-widest">Saved in Interest</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-8 mt-auto">
                <div className="text-left space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New Term</p>
                  <p className="text-2xl font-black text-indigo-900">{results.yearsToPayoff.toFixed(1)} Years</p>
                  <p className="text-xs text-blue-500 font-medium">Reduced from {inputs.loanTerm}</p>
                </div>
                <div className="text-left space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time Saved</p>
                  <p className="text-2xl font-black text-emerald-600">
                    {Math.floor(results.monthsSaved / 12)}y {results.monthsSaved % 12}m
                  </p>
                  <p className="text-xs text-emerald-500 font-medium">Faster to Freedom</p>
                </div>
              </div>

              <div className="mt-10">
                <button 
                  onClick={getAiInsight}
                  disabled={loadingAi}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mx-auto disabled:opacity-50"
                >
                  {loadingAi ? "Generating..." : <><Sparkles className="w-3 h-3" /> Get Smart AI Insight</>}
                </button>
                {aiInsight && (
                  <p className="text-xs text-slate-500 italic mt-3 max-w-sm mx-auto leading-relaxed">
                    "{aiInsight}"
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feature Section: Bottom Cards */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center gap-3 transition-transform hover:scale-[1.02]">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-bold text-indigo-900">Save Time</h4>
          <p className="text-[10px] text-slate-500 leading-tight">Pay off your mortgage years earlier with an extra payment</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center gap-3 transition-transform hover:scale-[1.02]">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-bold text-indigo-900">Save Money</h4>
          <p className="text-[10px] text-slate-500 leading-tight">Reduce total interest paid over the life of your loan</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center gap-3 transition-transform hover:scale-[1.02]">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-bold text-indigo-900">Build Equity</h4>
          <p className="text-[10px] text-slate-500 leading-tight">Accelerate equity growth in your home</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center space-y-4">
        <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span className="cursor-pointer hover:text-blue-500">Privacy Policy</span>
          <span className="cursor-pointer hover:text-blue-500">Terms of Service</span>
          <span className="cursor-pointer hover:text-blue-500">Disclaimer</span>
        </div>
        <p className="text-[10px] text-slate-400">
          © 2025 Mortgage Payoff Calculator. All Rights Reserved.<br/>
          Contact: info@example.com
        </p>
      </footer>
    </div>
  );
};

export default App;
