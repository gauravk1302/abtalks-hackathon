import React from 'react';

interface StreakSummaryCardProps {
  currentDay: number;
  totalDays?: number;
  isBroken?: boolean; // True hone par bhuja hua/reset look aayega, false hone par vibrant fire
}

export function StreakSummaryCard({ currentDay, totalDays = 60, isBroken = false }: StreakSummaryCardProps) {
  const gradientId = React.useId();

  return (
    <div className={`bg-[#0F0E17] border p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] shadow-2xl flex items-center gap-3 sm:gap-4 font-[family-name:var(--font-rubik)] transition-all ${isBroken ? 'border-red-500/30' : 'border-white/10'}`}>
      
      {/* Slow Burnout Flame + Glow Animations (Sirf tab chalengi jab streak active yaani not broken ho) */}
      {!isBroken && (
        <style>{`
          @keyframes flame-burnout-large {
            0%, 100% { 
              transform: scale(1) translateY(0) rotate(0deg); 
              opacity: 1;
              filter: drop-shadow(0 0 6px rgba(255,106,0,0.8));
            }
            15% { 
              transform: scale(1.3) translateY(-3px) rotate(-3deg); 
              opacity: 1;
              filter: drop-shadow(0 0 16px rgba(255,140,0,1));
            }
            30% { 
              transform: scale(0.75) translateY(2px) rotate(2deg); 
              opacity: 0.6;
              filter: drop-shadow(0 0 2px rgba(255,61,0,0.5));
            }
            45% { 
              transform: scale(1.2) translateY(-2px) rotate(-2deg); 
              opacity: 0.95;
              filter: drop-shadow(0 0 12px rgba(255,120,0,0.9));
            }
            60% { 
              transform: scale(0.65) translateY(3px) rotate(3deg); 
              opacity: 0.5;
              filter: drop-shadow(0 0 2px rgba(255,61,0,0.4));
            }
            75% { 
              transform: scale(1.15) translateY(-1px) rotate(-1deg); 
              opacity: 0.9;
              filter: drop-shadow(0 0 10px rgba(255,106,0,0.8));
            }
            90% { 
              transform: scale(0.85) translateY(1px) rotate(2deg); 
              opacity: 0.75;
              filter: drop-shadow(0 0 6px rgba(255,80,0,0.6));
            }
          }

          @keyframes glow-burnout-large {
            0%, 100% { 
              box-shadow: 0 0 12px 3px rgba(255,106,0,0.45); 
              opacity: 0.8;
            }
            15% { 
              box-shadow: 0 0 26px 8px rgba(255,140,0,0.8); 
              opacity: 1;
            }
            50% { 
              box-shadow: 0 0 16px 4px rgba(255,106,0,0.6); 
              opacity: 0.9;
            }
          }
        `}</style>
      )}

      {/* Flame Icon Container */}
      <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#14131C] shrink-0">
        
        {/* Active Vibrant Glow OR Faded Border */}
        {!isBroken ? (
          <span
            aria-hidden
            className="absolute inset-0 rounded-2xl"
            style={{ animation: 'glow-burnout-large 5s ease-in-out infinite' }}
          />
        ) : (
          <span aria-hidden className="absolute inset-0 rounded-2xl border border-white/5" />
        )}
        
        {/* SVG Flame (Vibrant colored gradient when active, Grayscale/Faded when broken) */}
        <svg
          width={28}
          height={28}
          viewBox="0 0 24 24"
          fill="none"
          className={`relative z-10 ${isBroken ? 'grayscale opacity-30' : ''}`}
          style={isBroken ? undefined : { animation: 'flame-burnout-large 5s ease-in-out infinite' }}
        >
          <path
            d="M12 2c.6 3 3.4 4.4 3.4 8a3.4 3.4 0 0 1-6.8 0c0-1 .3-1.8.8-2.6-1.6.9-2.6 2.6-2.6 4.6a5.2 5.2 0 0 0 10.4 0c0-5-3-6.6-5.2-10z"
            fill={isBroken ? "#6B7280" : `url(#${gradientId})`}
          />
          <path
            d="M12 13.6c.9 0 1.6-.7 1.6-1.6 0-.9-.6-1.3-1-1.9-.2.5-.6.8-1 1.1-.4.3-.6.7-.6 1.2 0 .7.5 1.2 1 1.2z"
            fill={isBroken ? "#9CA3AF" : "#FFFFFF"}
          />
          {!isBroken && (
            <defs>
              <linearGradient id={gradientId} x1="12" y1="2" x2="12" y2="18" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FF7A1A" />
                <stop offset="1" stopColor="#FF3D00" />
              </linearGradient>
            </defs>
          )}
        </svg>
      </div>
      
      {/* Text Details */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 font-[family-name:var(--font-libre-franklin)]">
            Current Streak
          </span>
          {isBroken && (
            <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.2 rounded font-semibold tracking-normal">
              RESET
            </span>
          )}
        </div>
        <span className="text-base sm:text-lg font-black text-white truncate font-[family-name:var(--font-libre-franklin)]">
          Day {currentDay} <span className="text-gray-400 font-bold text-xs sm:text-sm">of {totalDays}</span>
        </span>
      </div>

    </div>
  );
}