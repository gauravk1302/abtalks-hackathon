'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Lock, Flame } from 'lucide-react';
import { ConfettiBurst } from './confetti-burst';

/**
 * modules/dashboard/components/stats-section/achievement.tsx
 *
 * Dynamic streak-milestone badges: 7, 15, 30, 60 days.
 * Unlocks based on the user's longestStreak.
 */

const CAPTIONS: Record<number, string> = {
  7: 'Getting Started',
  15: 'Building Momentum',
  30: 'Locked In',
  60: 'Challenge Completed',
};

function getCaption(days: number) {
  if (CAPTIONS[days]) return CAPTIONS[days];
  return 'This is now your identity';
}

function buildMilestones(): number[] {
  return [7, 15, 30, 60];
}

function StreakBadge({ days, unlocked }: { days: number; unlocked: boolean }) {
  return (
    <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 shrink-0">
      <div
        className="absolute inset-0"
        style={{
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          background: unlocked
            ? 'linear-gradient(160deg, #FFEBB0 0%, #FFC94D 45%, #E8A317 100%)'
            : '#1A2238',
          boxShadow: unlocked ? '0 0 26px 4px rgba(255,201,77,0.4)' : 'none',
          border: unlocked ? 'none' : '1px solid rgba(255,255,255,0.08)',
        }}
      />
      <div className="relative flex flex-col items-center justify-center gap-0.5">
        {unlocked ? (
          <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8A5A00] fill-[#8A5A00]" />
        ) : (
          <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
        )}
        <span className={`text-base sm:text-lg font-black leading-none font-[family-name:var(--font-libre-franklin)] ${unlocked ? 'text-[#5A3B00]' : 'text-gray-600'}`}>
          {days}
        </span>
        <span
          className={`text-[6px] sm:text-[7px] font-black tracking-[0.15em] leading-none font-[family-name:var(--font-libre-franklin)] ${
            unlocked ? 'text-[#5A3B00]/80' : 'text-gray-600'
          }`}
        >
          STREAK
        </span>
      </div>
    </div>
  );
}

export default function Achievements() {
  const [longestStreak, setLongestStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    fetch('/api/user/progress')
      .then((res) => res.json())
      .then((data) => {
        const streak = data.longestStreak || 0;
        setLongestStreak(streak);

        if (!hasCheckedRef.current) {
          hasCheckedRef.current = true;
          const milestones = buildMilestones();
          const unlockedNow = milestones.filter((m) => streak >= m);

          let celebrated: number[] = [];
          try {
            celebrated = JSON.parse(localStorage.getItem('celebratedMilestones') || '[]');
          } catch {
            celebrated = [];
          }

          const newlyUnlocked = unlockedNow.filter((m) => !celebrated.includes(m));
          if (newlyUnlocked.length > 0) {
            setShowConfetti(true);
            localStorage.setItem(
              'celebratedMilestones',
              JSON.stringify([...celebrated, ...newlyUnlocked])
            );
          }
        }
      })
      .catch((err) => console.error('Error fetching achievements:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0F0E17] border border-white/10 rounded-[32px] p-6 lg:p-8 flex items-center justify-center min-h-[220px] font-[family-name:var(--font-rubik)]">
        <span className="text-xs text-gray-500 animate-pulse">Loading achievements...</span>
      </div>
    );
  }

  const milestones = buildMilestones();
  const unlockedCount = milestones.filter((m) => longestStreak >= m).length;

  return (
    <div className="bg-[#0F0E17] border border-white/10 rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 lg:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden font-[family-name:var(--font-rubik)]">
      {showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}

      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-black tracking-wide text-gray-100 flex items-center gap-2 font-[family-name:var(--font-libre-franklin)]">
          🏆 Achievements
        </h2>
        <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 bg-white/5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
          {unlockedCount}/{milestones.length} unlocked
        </span>
      </div>

      {/* Responsive Grid: 2 columns on mobile, 4 columns on sm+ screens */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-3 sm:gap-x-4">
        {milestones.map((days) => {
          const unlocked = longestStreak >= days;
          const daysToGo = Math.max(0, days - longestStreak);
          return (
            <div key={days} className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
              <StreakBadge days={days} unlocked={unlocked} />
              <h3 className={`text-xs sm:text-sm font-bold font-[family-name:var(--font-libre-franklin)] ${unlocked ? 'text-gray-200' : 'text-gray-600'}`}>
                {days}-Day Streak
              </h3>
              <span
                className={`text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  unlocked ? 'bg-[#FFD88A]/20 text-[#FFD88A]' : 'bg-white/5 text-gray-500'
                }`}
              >
                {unlocked ? getCaption(days) : `${daysToGo} days to go`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}