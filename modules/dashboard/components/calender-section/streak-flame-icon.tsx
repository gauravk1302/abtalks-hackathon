'use client';

import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
// Note: Is import ko apni file ke hisaab se adjust kar lena
import { isStreakDay } from './streak-dates';

/* =========================================
   1. TAGDA ANIMATED FLAME ICON COMPONENT
   ========================================= */
interface StreakFlameIconProps {
  size?: number;
  className?: string;
}

export function StreakFlameIcon({ size = 20, className }: StreakFlameIconProps) {
  const gradientId = React.useId();
  const boxSize = size + 6;

  return (
    <span
      className={cn(
        'relative inline-flex items-center justify-center rounded-[8px] sm:rounded-[9px] bg-[#14131C]',
        className
      )}
      style={{ width: boxSize, height: boxSize }}
    >
      {/* Custom Keyframe Animations */}
      <style>{`
        @keyframes pro-flame-float {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
          50% { transform: translateY(-2px) scale(1.05) rotate(2deg); }
        }
        @keyframes pro-glow-breath {
          0%, 100% { box-shadow: 0 0 10px 1px rgba(255,106,0,0.4); opacity: 0.8; }
          50% { box-shadow: 0 0 18px 4px rgba(255,61,0,0.6); opacity: 1; }
        }
      `}</style>

      {/* Breathing Neon Glow Layer */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-[8px] sm:rounded-[9px]"
        style={{ animation: 'pro-glow-breath 2s ease-in-out infinite' }}
      />

      {/* Floating SVG Flame */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="relative"
        style={{ animation: 'pro-flame-float 1.5s ease-in-out infinite' }}
      >
        <path
          d="M12 2c.6 3 3.4 4.4 3.4 8a3.4 3.4 0 0 1-6.8 0c0-1 .3-1.8.8-2.6-1.6.9-2.6 2.6-2.6 4.6a5.2 5.2 0 0 0 10.4 0c0-5-3-6.6-5.2-10z"
          fill={`url(#${gradientId})`}
        />
        <path
          d="M12 13.6c.9 0 1.6-.7 1.6-1.6 0-.9-.6-1.3-1-1.9-.2.5-.6.8-1 1.1-.4.3-.6.7-.6 1.2 0 .7.5 1.2 1 1.2z"
          fill="#FFFFFF"
        />
        <defs>
          <linearGradient id={gradientId} x1="12" y1="2" x2="12" y2="18" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF7A1A" />
            <stop offset="1" stopColor="#FF3D00" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}

/* =========================================
   2. TAGDA SUMMARY CARD COMPONENT
   ========================================= */
interface StreakSummaryCardProps {
  currentDay: number;
  totalDays?: number;
}

export function StreakSummaryCard({ currentDay, totalDays = 60 }: StreakSummaryCardProps) {
  return (
    <div className="bg-[#0F0E17] border border-white/10 p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] shadow-2xl flex items-center gap-3 sm:gap-4 font-[family-name:var(--font-rubik)]">
      
      <style>{`
        @keyframes emoji-pop {
          0%, 100% { transform: scale(1) rotate(-3deg); }
          50% { transform: scale(1.2) rotate(3deg); }
        }
        @keyframes card-glow {
          0%, 100% { box-shadow: 0 0 12px 2px rgba(255,106,0,0.3); }
          50% { box-shadow: 0 0 20px 5px rgba(255,106,0,0.5); }
        }
      `}</style>

      <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#14131C] shrink-0">
        {/* Animated Card Background Glow */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-2xl"
          style={{ animation: 'card-glow 2s ease-in-out infinite' }}
        />
        {/* Animated Emoji */}
        <span 
          className="relative text-xl sm:text-2xl drop-shadow-md"
          style={{ animation: 'emoji-pop 1.5s ease-in-out infinite' }}
        >
          🔥
        </span>
      </div>
      
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 font-[family-name:var(--font-libre-franklin)]">
          Current Streak
        </span>
        <span className="text-base sm:text-lg font-black text-white truncate font-[family-name:var(--font-libre-franklin)]">
          Day {currentDay} <span className="text-gray-400 font-bold text-xs sm:text-sm">of {totalDays}</span>
        </span>
      </div>
    </div>
  );
}

/* =========================================
   3. MAIN CALENDAR COMPONENT
   ========================================= */
interface SideCalendarProps {
  streakDates?: (Date | string)[];
}

export function SideCalendar({ streakDates = [] }: SideCalendarProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="w-full bg-[#0F0E17] border border-white/15 p-4 sm:p-6 rounded-[28px] sm:rounded-[36px] backdrop-blur-xl shadow-2xl flex flex-col items-center font-[family-name:var(--font-rubik)]">
      <div className="flex items-center justify-between w-full mb-3 sm:mb-4 px-1 sm:px-2">
        <h3 className="text-[#C6E98F] text-sm sm:text-base font-extrabold tracking-wider uppercase font-[family-name:var(--font-libre-franklin)]">
          Schedule Grid
        </h3>
        <span className="text-[10px] sm:text-xs bg-[#C6E98F]/20 text-[#C6E98F] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-bold font-[family-name:var(--font-libre-franklin)] hover:bg-[#C6E98F]/30 transition-colors cursor-default">
          Active
        </span>
      </div>

      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="w-full rounded-2xl border border-white/10 text-white bg-[#0F0E17]/60 p-2 sm:p-3 shadow-inner text-sm sm:text-base max-w-full"
        components={{
          DayButton: ({ day, className: dayClassName, children, ...buttonProps }: any) => {
            const currentDate = day?.date || day;
            const streak = isStreakDay(currentDate, streakDates);

            return (
              <button
                type="button"
                {...buttonProps}
                style={streak ? { backgroundColor: 'transparent' } : undefined}
                className={cn(
                  dayClassName,
                  'h-9 w-9 sm:h-11 sm:w-11 text-xs sm:text-base rounded-lg sm:rounded-xl relative flex items-center justify-center m-auto transition-transform hover:scale-105 active:scale-95',
                  streak && '!bg-transparent p-0 border-none'
                )}
              >
                {streak ? (
                  <span className="flex items-center justify-center w-full h-full">
                    <StreakFlameIcon size={18} className="sm:hidden" />
                    <StreakFlameIcon size={22} className="hidden sm:inline-flex" />
                  </span>
                ) : (
                  children
                )}
              </button>
            );
          },
        }}
      />
    </div>
  );
}