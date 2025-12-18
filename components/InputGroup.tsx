
import React from 'react';

interface InputGroupProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  tooltip?: string;
  min?: number;
  step?: number;
}

const InputGroup: React.FC<InputGroupProps> = ({ 
  label, 
  value, 
  onChange, 
  prefix, 
  suffix, 
  tooltip,
  min = 0,
  step = 1
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">{label}</label>
        {tooltip && (
          <div className="group relative">
            <span className="cursor-help inline-flex items-center justify-center w-4 h-4 bg-slate-200 text-slate-500 rounded-full text-[10px] font-bold">?</span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-xl z-10">
              {tooltip}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
            </div>
          </div>
        )}
      </div>
      <div className="relative group">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">{prefix}</span>
        )}
        <input
          type="number"
          min={min}
          step={step}
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full bg-white border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm group-hover:border-blue-300 ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-12' : ''} text-lg font-medium text-slate-800`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">{suffix}</span>
        )}
      </div>
    </div>
  );
};

export default InputGroup;
