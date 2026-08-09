'use client';

import React from 'react';

interface MonthSelectorProps {
  currentMonthYear?: string;
}

export function MonthSelector({ currentMonthYear = "August 2026" }: MonthSelectorProps) {
  return (
    <div className="flex items-center justify-center py-2 sm:py-4 px-4 w-full">
      {/* Clean month & year heading with responsive scaling and custom fonts */}
      <h2 className="text-white text-[20px] sm:text-[24px] md:text-[28px] font-bold tracking-tight antialiased font-[family-name:var(--font-libre-franklin)]">
        {currentMonthYear}
      </h2>
    </div>
  );
}

export default MonthSelector;