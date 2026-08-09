'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DateItem {
  dayNumber: string;
  dayName: string;
  offset: number;
}

export function DateCapsuleSelector() {
  const [dates, setDates] = useState<DateItem[]>([]);

  useEffect(() => {
    const today = new Date();
    const list: DateItem[] = [];

    // 7 days generate kar rahe hain (-3 se +3 center tak)
    for (let i = -3; i <= 3; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const dayNumber = String(d.getDate()).padStart(2, '0');
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      list.push({ dayNumber, dayName, offset: i });
    }

    setDates(list);
  }, []);

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-4 sm:py-6">
      <div className="flex items-center justify-center gap-1.5 sm:gap-3 w-max mx-auto px-2 sm:px-4">
        {dates.map((item, idx) => {
          const absOffset = Math.abs(item.offset);
          const isCenter = item.offset === 0;

          // Responsive Style & Dimension Classes
          let sizeClass = "w-10 h-16 sm:w-11 sm:h-16 rounded-[20px] sm:rounded-[22px]";
          let bg = "bg-[#17153B]/60 text-[#818CF8]";
          let opacity = 0.4;
          let scale = 0.9;
          let numClass = "text-[12px] sm:text-[14px]";
          let labelClass = "text-[8px] sm:text-[9px]";

          if (isCenter) {
            // 🎯 Main Center Date (Responsive big size)
            sizeClass = "w-18 h-28 sm:w-22 sm:h-32 rounded-[28px] sm:rounded-[36px]";
            bg = "bg-[#9333EA] text-white shadow-lg sm:shadow-2xl shadow-[#9333EA]/50 font-extrabold";
            opacity = 1;
            scale = 1.08;
            numClass = "text-[26px] sm:text-[34px]";
            labelClass = "text-[10px] sm:text-[12px] font-bold";
          } else if (absOffset === 1) {
            // 🔹 Inner Adjacent Dates
            sizeClass = "w-13 h-20 sm:w-15 sm:h-22 rounded-[22px] sm:rounded-[28px]";
            bg = "bg-[#1E1B4B] text-[#C7D2FE] font-medium";
            opacity = 0.8;
            scale = 0.98;
            numClass = "text-[15px] sm:text-[18px]";
            labelClass = "text-[8px] sm:text-[9px]";
          }

          return (
            <motion.div
              key={idx}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: scale, 
                opacity: opacity,
              }}
              whileHover={{ scale: scale * 1.05 }}
              whileTap={{ scale: scale * 0.95 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20,
                delay: idx * 0.03
              }}
              className={`flex flex-col items-center justify-center ${sizeClass} ${bg} cursor-pointer transition-colors duration-200 shrink-0`}
            >
              {/* 🔢 Day Number - Libre Franklin Font */}
              <span className={`leading-none mb-1 font-[family-name:var(--font-libre-franklin)] ${numClass}`}>
                {item.dayNumber}
              </span>

              {/* 🔤 Day Name - Rubik Font */}
              <span className={`uppercase tracking-wider font-[family-name:var(--font-rubik)] ${labelClass}`}>
                {item.dayName}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default DateCapsuleSelector;