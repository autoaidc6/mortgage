
import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Calculator, Clock, DollarSign, TrendingUp, ChevronDown, Sparkles, Calendar } from 'lucide-react';
import InputGroup from './components/InputGroup';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import Disclaimer from './Disclaimer';
import { MortgageInputs, PeriodicSavings, PaymentType } from './types';
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

type AppView = 'calculator' | 'privacy' | 'terms' | 'disclaimer';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('calculator');
  const [inputs, setInputs] = useState<MortgageInputs>({
    balance: 300000,
    interestRate: 6.5,
    loanTerm: 30,
    extraPayment: 10000,
    paymentType: 'one-time',
    currency: 'USD'
  });

  const [hasCalculated, setHasCalculated] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const results = useMemo(() => calculateMortgage(inputs), [inputs]);

  const timeResults = useMemo(() => {
    const monthsSaved = results.monthsSaved;
    const yearsSaved = Math.floor(monthsSaved / 12);
    const monthsSavedPart = monthsSaved % 12;

    const totalMonthsOriginal = inputs.loanTerm * 12;
    const totalMonthsNew = totalMonthsOriginal - monthsSaved;
    const yearsNew = Math.floor(totalMonthsNew / 12);
    const monthsNewPart = totalMonthsNew % 12;

    return {
      yearsSaved,
      monthsSavedPart,
      yearsNew,
      monthsNewPart
    };
  }, [results, inputs]);

  const periodicSavings = useMemo((): PeriodicSavings => {
    const years = inputs.loanTerm;
    return {
      day: results.totalSavings / (years * 365),
      week: results.totalSavings / (years * 52),
      month: results.totalSavings / (years * 12),
      year: results.totalSavings / years,
      total: results.totalSavings
    };
  }, [results, inputs]);

  const handleCalculate = () => {
    setHasCalculated(true);
  };

  const getAiInsight = async () => {
    setLoadingAi(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analyze: Mortgage ${inputs.balance}, Rate ${inputs.interestRate}%, ${inputs.paymentType} extra payment of ${inputs.extraPayment}. 
      Saved: ${results.totalSavings}, Time: ${timeResults.yearsSaved} years ${timeResults.monthsSavedPart} months. 
      Give a 2-sentence punchy advisor insight about why this specific ${inputs.paymentType} strategy is a wealth-building genius move.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAiInsight(response.text || "This strategy drastically cuts your long-term interest costs.");
    } catch (error) {
      setAiInsight("Lump sum or recurring payments drastically reduce interest when applied early.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleInputChange = (key: keyof MortgageInputs | string, value: string) => {
    setInputs(prev => ({ 
      ...prev, 
      [key]: key === 'currency' || key === 'paymentType' ? value : Number(value) 
    }));
  };

  const symbol = getCurrencySymbol(inputs.currency);

  if (view === 'privacy') return <PrivacyPolicy onBack={() => setView('calculator')} />;
  if (view === 'terms') return <TermsOfService onBack={() => setView('calculator')} />;
  if (view === 'disclaimer') return <Disclaimer onBack={() => setView('calculator')} />;

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 gap-12">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-indigo-900 tracking-tight">Mortgage Payoff Calculator</h1>
        <p className="text-blue-600 font-medium">Discover how much money you can save with an extra mortgage payment</p>
      </div>

      {/* Main Calculator Content */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Left Card: Input Form */}
        <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-indigo-900">Calculate Your Savings</h2>
              <p className="text-xs text-blue-500 font-medium">Enter your mortgage details below</p>
            </div>
            <div className="relative">
              <select 
                value={inputs.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-md py-1 px-3 pr-8 text-[10px] font-bold text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Payment Type</label>
              <div className="relative">
                <select 
                  value={inputs.paymentType}
                  onChange={(e) => handleInputChange('paymentType', e.target.value)}
                  className="w-full border border-slate-300 rounded-md py-2 px-3 text-sm text-slate-700 appearance-none bg-white outline-none"
                >
                  <option value="one-time">One-Time Extra Payoff</option>
                  <option value="monthly">Monthly Extra Payoff</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <InputGroup 
              label={`${inputs.paymentType === 'one-time' ? 'One-Time' : 'Monthly'} Extra Payoff (${symbol}) *`}
              value={inputs.extraPayment}
              onChange={(v) => handleInputChange('extraPayment', v)}
              placeholder={inputs.paymentType === 'one-time' ? "e.g., 10000" : "e.g., 200"}
            />

            <InputGroup 
              label={`Total Mortgage Amount (${symbol})`}
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
        <div className="flex flex-col gap-6 min-h-[500px]">
          {!hasCalculated ? (
            <div className="bg-white rounded-xl shadow-xl flex flex-col items-center justify-center p-8 text-center h-full">
              <TrendingUp className="w-16 h-16 opacity-40 text-blue-400 rotate-180 scale-y-[-1] mb-4" />
              <p className="text-sm font-medium text-blue-500/80 px-12">
                Enter your mortgage details to see your potential savings
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 animate-in fade-in duration-500">
              {/* Savings Summary Dashboard */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-xl shadow-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-blue-100" />
                  <h3 className="text-lg font-bold">Your Savings Summary</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Time Saved Card */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-200" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-100 opacity-80">Time Saved</span>
                    </div>
                    <p className="text-xl font-black leading-tight">
                      {timeResults.yearsSaved} {timeResults.yearsSaved === 1 ? 'year' : 'years'} and {timeResults.monthsSavedPart} {timeResults.monthsSavedPart === 1 ? 'month' : 'months'}
                    </p>
                    <p className="text-[10px] text-blue-100 opacity-60 mt-1">
                      Pay off in {timeResults.yearsNew}y and {timeResults.monthsNewPart}m
                    </p>
                  </div>

                  {/* Total Interest Saved Card */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-blue-200" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-100 opacity-80">Total Interest Saved</span>
                    </div>
                    <p className="text-2xl font-black leading-tight">
                      {formatCurrency(results.totalSavings, inputs.currency, 0)}
                    </p>
                    <p className="text-[10px] text-blue-100 opacity-60 mt-1">
                      Over the life of your loan
                    </p>
                  </div>
                </div>
              </div>

              {/* Savings Breakdown Dashboard */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <TrendingUp className="w-5 h-5 text-indigo-900" />
                  <h3 className="text-lg font-bold text-indigo-900">Savings Breakdown</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Daily Savings */}
                  <div className="bg-blue-600 rounded-xl p-5 text-white shadow-md flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">Daily Savings</span>
                      <Calendar className="w-4 h-4 opacity-50" />
                    </div>
                    <div className="border-b border-white/20 pb-1 mt-auto">
                      <p className="text-2xl font-black">{formatCurrency(periodicSavings.day, inputs.currency, 2)}</p>
                    </div>
                  </div>

                  {/* Weekly Savings */}
                  <div className="bg-indigo-600 rounded-xl p-5 text-white shadow-md flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">Weekly Savings</span>
                      <Calendar className="w-4 h-4 opacity-50" />
                    </div>
                    <div className="border-b border-white/20 pb-1 mt-auto">
                      <p className="text-2xl font-black">{formatCurrency(periodicSavings.week, inputs.currency, 2)}</p>
                    </div>
                  </div>

                  {/* Monthly Savings */}
                  <div className="bg-blue-500 rounded-xl p-5 text-white shadow-md flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">Monthly Savings</span>
                      <Calendar className="w-4 h-4 opacity-50" />
                    </div>
                    <div className="border-b border-white/20 pb-1 mt-auto">
                      <p className="text-2xl font-black">{formatCurrency(periodicSavings.month, inputs.currency, 2)}</p>
                    </div>
                  </div>

                  {/* Yearly Savings */}
                  <div className="bg-indigo-500 rounded-xl p-5 text-white shadow-md flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">Yearly Savings</span>
                      <Calendar className="w-4 h-4 opacity-50" />
                    </div>
                    <div className="border-b border-white/20 pb-1 mt-auto">
                      <p className="text-2xl font-black">{formatCurrency(periodicSavings.year, inputs.currency, 2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insight Button */}
              <div className="pt-2 text-center">
                <button 
                  onClick={getAiInsight}
                  disabled={loadingAi}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mx-auto transition-opacity disabled:opacity-50"
                >
                  {loadingAi ? "Analyzing Wealth Strategy..." : <><Sparkles className="w-3 h-3" /> Get Smart AI Insight</>}
                </button>
                {aiInsight && (
                  <p className="text-xs text-slate-500 italic mt-3 max-w-md mx-auto leading-relaxed border-l-2 border-blue-200 pl-4 py-1">
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
          <button onClick={() => setView('privacy')} className="hover:text-blue-500 transition-colors">Privacy Policy</button>
          <button onClick={() => setView('terms')} className="hover:text-blue-500 transition-colors">Terms of Service</button>
          <button onClick={() => setView('disclaimer')} className="hover:text-blue-500 transition-colors">Disclaimer</button>
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
