
import React from 'react';

interface AdPlaceholderProps {
  type: 'leaderboard' | 'rectangle' | 'fluid';
  className?: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ type, className = "" }) => {
  const styles = {
    leaderboard: "w-full min-h-[90px] md:min-h-[120px]",
    rectangle: "w-full min-h-[250px]",
    fluid: "w-full h-auto min-h-[100px]"
  };

  return (
    <div className={`bg-slate-100/50 border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center p-4 overflow-hidden ${styles[type]} ${className}`}>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Advertisement</span>
      <div className="text-[10px] text-slate-300 text-center italic">
        {type === 'leaderboard' && "Standard 728x90 or 970x250 Responsive Leaderboard"}
        {type === 'rectangle' && "Standard 300x250 or 336x280 Large Rectangle"}
        {type === 'fluid' && "Native In-Feed or Fluid Ad Unit"}
      </div>
      {/* Real AdSense code would be injected here: 
          <ins className="adsbygoogle" ... /> 
      */}
    </div>
  );
};

export default AdPlaceholder;
