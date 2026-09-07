import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdSenseBannerProps {
  client?: string;
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: boolean;
  className?: string;
  label?: string;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  client = 'ca-pub-9517350900599370',
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  label = 'Advertisement',
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    // Only push once per mount
    if (pushedRef.current) return;

    try {
      if (typeof window !== 'undefined') {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        pushedRef.current = true;
      }
    } catch (err) {
      // AdSense throws if ad block is present or slot is already filled
      console.debug('AdSense request error:', err);
    }
  }, []);

  return (
    <div className={`w-full flex flex-col items-center justify-center my-1 ${className}`}>
      {/* Label complying with Google AdSense Policies */}
      <div className="flex items-center gap-1.5 mb-1 text-[9px] font-mono tracking-widest text-slate-400 uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span>{label}</span>
      </div>

      {/* Ad Container */}
      <div className="w-full min-h-[90px] sm:min-h-[100px] flex items-center justify-center rounded-xl bg-black/60 border border-cyan-500/20 backdrop-blur-md overflow-hidden p-1 shadow-[0_0_20px_rgba(6,182,212,0.15)] text-center relative">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '90px' }}
          data-ad-client={client}
          {...(slot ? { 'data-ad-slot': slot } : {})}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
        
        {/* Ambient background hint if ads are loading or previewing */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center -z-10 opacity-60">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            Google AdSense · ca-pub-9517350900599370
          </span>
          <span className="text-[9px] text-slate-600">
            Interactive Sponsor Display
          </span>
        </div>
      </div>
    </div>
  );
};
