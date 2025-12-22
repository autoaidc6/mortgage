import React, { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdPlaceholderProps {
  type: 'leaderboard' | 'rectangle' | 'fluid';
  className?: string;
  slotId?: string; // Add specific slot ID if available
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ type, className = "", slotId = "0000000000" }) => {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error("AdSense unit initialization failed", e);
    }
  }, []);

  const styles = {
    leaderboard: "w-full min-h-[90px] md:min-h-[120px]",
    rectangle: "w-full min-h-[250px]",
    fluid: "w-full h-auto min-h-[100px]"
  };

  const adFormats = {
    leaderboard: "horizontal",
    rectangle: "rectangle",
    fluid: "fluid"
  };

  return (
    <div className={`bg-slate-100/30 border border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center p-2 overflow-hidden relative ${styles[type]} ${className}`}>
      {/* Visual Debug Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ad Placement</span>
        <span className="text-[8px] text-slate-400">{type.toUpperCase()}</span>
      </div>

      {/* Actual AdSense Tag - Replace 'ca-pub-...' with your actual ID later */}
      <ins className="adsbygoogle"
           style={{ display: 'block', width: '100%', height: '100%' }}
           data-ad-client="ca-pub-0000000000000000"
           data-ad-slot={slotId}
           data-ad-format={adFormats[type]}
           data-full-width-responsive="true"></ins>
    </div>
  );
};

export default AdPlaceholder;