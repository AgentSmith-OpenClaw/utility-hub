import React from 'react';

/**
 * Google AdSense Ad Slot Component
 * 
 * Replace 'data-ad-client' and 'data-ad-slot' with your actual AdSense values.
 * After AdSense approval, uncomment the adsbygoogle push in useEffect.
 * 
 * Common ad sizes:
 * - Sidebar: 160x600 (Wide Skyscraper) or 300x600 (Half Page)
 * - Leaderboard: 728x90
 * - Medium Rectangle: 300x250
 * - Responsive: auto
 */

interface AdSlotProps {
  /** Unique identifier for this ad slot */
  slotId: string;
  /** Ad format: 'vertical' for sidebar, 'horizontal' for banner, 'rectangle' for in-content */
  format: 'vertical' | 'horizontal' | 'rectangle' | 'auto';
  /** Optional custom className */
  className?: string;
  /** Optional label text */
  label?: string;
}

const AdSlot: React.FC<AdSlotProps> = ({ slotId, format, className = '', label }) => {
  const getAdStyle = (): React.CSSProperties => {
    switch (format) {
      case 'vertical':
        return { width: '160px', minHeight: '600px' };
      case 'horizontal':
        return { width: '100%', minHeight: '90px', maxWidth: '728px' };
      case 'rectangle':
        return { width: '300px', minHeight: '250px' };
      case 'auto':
      default:
        return { width: '100%', minHeight: '100px' };
    }
  };

  return (
    <div
      className={`ad-slot ${className}`}
      style={{
        ...getAdStyle(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
      }}
      aria-label="Advertisement"
      role="complementary"
    >
      {/* 
        PRODUCTION: Replace this placeholder with actual AdSense code:
        
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slotId}
          data-ad-format={format === 'auto' ? 'auto' : undefined}
          data-full-width-responsive={format === 'horizontal' ? 'true' : undefined}
        />
        
        And add this useEffect:
        useEffect(() => {
          try { (window as any).adsbygoogle = (window as any).adsbygoogle || []; (window as any).adsbygoogle.push({}); } catch (e) {}
        }, []);
      */}
      <div
        className="bg-gradient-to-b from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 text-xs"
        style={getAdStyle()}
      >
        <span className="text-lg mb-1">📢</span>
        <span className="font-semibold">{label || 'Ad Space'}</span>
        <span className="text-[10px] mt-1 opacity-70">
          {format === 'vertical' ? '160×600' : format === 'horizontal' ? '728×90' : format === 'rectangle' ? '300×250' : 'Responsive'}
        </span>
      </div>
    </div>
  );
};

export default AdSlot;
