
import React from 'react';
import { PeriodicSavings } from '../types';
import { formatCurrency } from '../services/mortgageCalculator';
import { TrendingUp, Calendar, Clock, Sparkles } from 'lucide-react';

interface SavingsBreakdownProps {
  savings: PeriodicSavings;
  currency: string;
}

const SavingsBreakdown: React.FC<SavingsBreakdownProps> = ({ savings, currency }) => {
  const cards = [
    { label: 'Per Day', value: savings.day, icon: <Clock className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Per Week', value: savings.week, icon: <Calendar className="w-5 h-5" />, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Per Month', value: savings.month, icon: <TrendingUp className="w-5 h-5" />, color: 'bg-cyan-50 text-cyan-600' },
    { label: 'Per Year', value: savings.year, icon: <Sparkles className="w-5 h-5" />, color: 'bg-violet-50 text-violet-600' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 transition-transform hover:scale-[1.02] duration-200">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-xl ${card.color}`}>
              {card.icon}
            </div>
            <span className="text-sm font-medium text-slate-500">{card.label}</span>
          </div>
          <p className="text-xl font-bold text-slate-800">{formatCurrency(card.value, currency)}</p>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">Interest Saved</p>
        </div>
      ))}
    </div>
  );
};

export default SavingsBreakdown;
