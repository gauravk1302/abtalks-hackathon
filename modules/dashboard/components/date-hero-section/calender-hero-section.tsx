import React from "react";
import { MonthSelector } from "./month-selector";
import { DateCapsuleSelector } from "./date-capsule-selector";

export function CalendarHeroSection() {
  const currentMonthYear = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <section className="relative w-full bg-[#0F0E17] pt-3 pb-16 flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-xl mx-auto flex flex-col gap-1 z-10">
        {/* Month Picker Header */}
        <MonthSelector currentMonthYear={currentMonthYear} />

        {/* Scaled & Animated Date Capsules */}
        <DateCapsuleSelector />
      </div>

      {/* Exact Image-like Curvature Bridge */}
      <div className="absolute bottom-0 left-0 right-0 h-9 bg-[#141226] rounded-t-[60%_35px] z-20 shadow-[0_-8px_20px_rgba(0,0,0,0.25)]"></div>
    </section>
  );
}
