'use client';

import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { StreakFlameIcon } from './streak-flame-icon';
import { isStreakDay } from './streak-dates';

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
        <span className="text-[10px] sm:text-xs bg-[#C6E98F]/20 text-[#C6E98F] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-bold font-[family-name:var(--font-libre-franklin)]">
          Active
        </span>
      </div>

      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        // Responsive width handling and text styling for calendar
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
                  // Responsive sizing for calendar day boxes (smaller on mobile, standard on sm+)
                  'h-9 w-9 sm:h-11 sm:w-11 text-xs sm:text-base rounded-lg sm:rounded-xl relative flex items-center justify-center m-auto',
                  streak && '!bg-transparent p-0 border-none'
                )}
              >
                {streak ? (
                  <span className="flex items-center justify-center w-full h-full">
                    {/* Flame icon size scales slightly down on mobile screens */}
                    <StreakFlameIcon size={24} className="sm:hidden" />
                    <StreakFlameIcon size={30} className="hidden sm:inline-flex" />
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