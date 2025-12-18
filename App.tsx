
import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Home, Calculator, PiggyBank, ArrowRight, Lightbulb, Info } from 'lucide-react';
import InputGroup from './components/InputGroup';
import MortgageChart from './components/MortgageChart';
import SavingsBreakdown from './components/SavingsBreakdown';
import { MortgageInputs, MortgageResults, PeriodicSavings } from './types';
import { calculateMortgage, formatCurrency } from './services/mortgageCalculator';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<MortgageInputs>({
    balance: 350000,
    interestRate: 6.5,
    loanTerm: 30,
    extraPayment: 500,
  });

  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const results = useMemo(() => calculateMortgage(inputs), [inputs]);

  const periodicSavings = useMemo((): PeriodicSavings => {
    const totalDays = inputs.loanTerm * 365.25;
    return {
      day: results.totalSavings / totalDays,
      week: results.totalSavings / (inputs.loanTerm * 52),
      month: results.totalSavings / (inputs.loanTerm * 12),
      year: results.totalSavings / inputs.loanTerm,
      total: results.totalSavings
    };
  }, [results, inputs]);

  const getAiInsight = async () => {
    setLoadingAi(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Act as a senior mortgage advisor. Analyze these results for a user:
        Mortgage Balance: ${inputs.balance}
        Interest Rate: ${inputs.interestRate}%
        Standard Monthly Payment: ${results.standardMonthlyPayment}
        Extra Monthly Payment: ${inputs.extraPayment}
        Total Interest Saved: ${results.totalSavings}
        Time Saved: ${Math.floor(results.monthsSaved / 12)} years and ${results.monthsSaved % 12} months.
        Provide a concise, motivating 3-sentence insight about how this extra payment impacts their financial freedom and wealth building. Mention one specific "future tip" like bi-weekly payments.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAiInsight(response.text || "Keep paying that extra! You're building wealth significantly faster.");
    } catch (error) {
      console.error("AI Error:", error);
      setAiInsight("Making extra payments is one of the most effective ways to build equity and save on long-term interest costs.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleInputChange = (key: keyof MortgageInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

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
          <p className="text-slate-500 font-medium">Strategize your path to home equity faster.</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl px-6 py-4 flex items-center gap-6 shadow-sm">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Base Payment</p>
            <p className="text-2xl font-black text-slate-800">{formatCurrency(results.standardMonthlyPayment)}</p>
          </div>
          <div className="h-10 w-[1px] bg-slate-200"></div>
          <div>
            <p className="text-[10px] uppercase font-bold text-blue-600 tracking-widest">Total Savings</p>
            <p className="text-2xl font-black text-blue-600">{formatCurrency(results.totalSavings)}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center gap-2 mb-8">
              <Calculator className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-800">Loan Details</h2>
            </div>
            
            <div className="space-y-6">
              <InputGroup 
                label="Mortgage Balance" 
                value={inputs.balance} 
                onChange={(v) => handleInputChange('balance', v)}
                prefix="$"
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
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <InputGroup 
                    label="Extra Monthly Payment" 
                    value={inputs.extraPayment} 
                    onChange={(v) => handleInputChange('extraPayment', v)}
                    prefix="$"
                    tooltip="Additional principal you plan to pay every month."
                  />
                  <p className="text-xs text-blue-600/70 mt-3 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Applied directly to principal each month.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* AI Advisor Button */}
          <button 
            onClick={getAiInsight}
            disabled={loadingAi}
            className="w-full bg-slate-900 hover:bg-black text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all group active:scale-95 disabled:opacity-50"
          >
            {loadingAi ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" />
            ) : (
              <>
                <Lightbulb className="w-5 h-5 text-yellow-400 group-hover:animate-pulse" />
                Ask Gemini Financial Insights
              </>
            )}
          </button>

          {aiInsight && (
            <div className="bg-white p-6 rounded-2xl border-l-4 border-l-blue-600 shadow-md animate-in fade-in slide-in-from-bottom-2 duration-500">
              <p className="text-sm text-slate-700 leading-relaxed italic">"{aiInsight}"</p>
            </div>
          )}
        </div>

        {/* Right Column: Visualization & Results */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-3xl text-white shadow-xl shadow-blue-200 flex flex-col justify-between">
              <div>
                <div className="bg-white/20 w-fit p-3 rounded-2xl mb-4">
                  <PiggyBank className="w-8 h-8" />
                </div>
                <h3 className="text-blue-100 font-medium uppercase text-xs tracking-widest mb-1">Total Savings</h3>
                <p className="text-5xl font-black mb-2">{formatCurrency(results.totalSavings)}</p>
              </div>
              <p className="text-blue-100/80 text-sm">You'll avoid paying this much interest over the life of your loan by paying ${inputs.extraPayment} extra per month.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-slate-400 font-medium uppercase text-xs tracking-widest mb-4">Time Savings</h3>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-black text-slate-800">{inputs.loanTerm}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Original Years</p>
                  </div>
                  <ArrowRight className="text-slate-200" />
                  <div className="text-center bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
                    <p className="text-3xl font-black text-blue-600">{results.yearsToPayoff.toFixed(1)}</p>
                    <p className="text-[10px] text-blue-400 font-bold uppercase">New Payoff (Years)</p>
                  </div>
                </div>
              </div>
              <p className="text-slate-500 text-sm mt-6 font-medium">
                Shaving <span className="text-blue-600 font-bold">{Math.floor(results.monthsSaved / 12)} years and {results.monthsSaved % 12} months</span> off your mortgage.
              </p>
            </div>
          </div>

          {/* Savings Periodic Breakdown */}
          <section className="space-y-4">
            <h3 className="text-slate-800 font-bold px-1">Incremental Interest Avoided</h3>
            <SavingsBreakdown savings={periodicSavings} />
          </section>

          {/* Amortization Chart */}
          <section className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Amortization Comparison</h3>
                <p className="text-sm text-slate-500">Balance reduction over time</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  <span className="text-slate-500">Standard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-blue-600">Accelerated</span>
                </div>
              </div>
            </div>
            <MortgageChart data={results.amortization} />
          </section>

          {/* Educational Footer Tips */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl border border-slate-100 bg-white/50">
              <h4 className="font-bold text-slate-700 text-sm mb-2">Bi-Weekly Tip</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Consider splitting your payment in half and paying every two weeks. This results in one extra full payment per year!</p>
            </div>
            <div className="p-4 rounded-2xl border border-slate-100 bg-white/50">
              <h4 className="font-bold text-slate-700 text-sm mb-2">Recasting vs Refi</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Extra payments build equity. Ask your lender about "Recasting" to lower your monthly minimum after a large principal payment.</p>
            </div>
            <div className="p-4 rounded-2xl border border-slate-100 bg-white/50">
              <h4 className="font-bold text-slate-700 text-sm mb-2">Tax Benefits</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Mortgage interest is often tax-deductible. Consult a CPA to see how paying down your loan impacts your tax situation.</p>
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
