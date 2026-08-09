'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap, Trophy, Sparkles } from 'lucide-react';
import { useCurrentUser } from '@/modules/auth/hooks/use-current-user';
import UserButton from '@/modules/auth/components/user-button';

const motivations = [
  "Keep pushing, your logic is getting sharper!",
  "Master those complex algorithms one step at a time.",
  "Every bug fixed is a lesson learned.",
  "Manage your state effectively, manage your success.",
  "Keep your background processes running smoothly today.",
  "Great UI starts with small, consistent details.",
  "Stay focused, optimize your workflow today."
];

interface ProgressData {
  name: string;
  image?: string;
  currentStreak: number;
  longestStreak: number;
}

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const user = useCurrentUser();

  useEffect(() => {
    setMounted(true);
    fetch('/api/user/progress')
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setProgress(data);
      })
      .catch(() => {});
  }, []);

  if (!mounted) {
    return <div className="h-28 sm:h-32 w-full bg-[#0B0A10]" />;
  }

  const streak = progress?.currentStreak ?? 0;
  const longest = progress?.longestStreak ?? 0;
  const quote = motivations[streak % motivations.length];
  const displayName = progress?.name || user?.name || "Gaurav";

  return (
    <header 
      className="w-full text-white relative overflow-hidden transition-all duration-700 ease-out border-b border-white/10 shadow-2xl"
      style={{ 
        backgroundColor: '#0B0A10', 
        backgroundImage: 'none',
        backgroundBlendMode: 'normal'
      }}
    >
      {/* Decorative ambient subtle lighting */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      {/* Subtle modern mesh grid overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] bg-[length:24px_24px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 pb-12 sm:pb-14">
        
        {/* ═══ TOP ROW: Logo + User ═══ */}
        <div className="flex justify-between items-start sm:items-center">
          
          {/* Logo container (Solid style) */}
          <motion.div 
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#151320] border border-white/10 shadow-inner"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#31C3EE] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#31C3EE]" />
            </span>
            <span 
              className="text-xs sm:text-sm font-black tracking-wider text-white uppercase"
              style={{ fontFamily: "'Libre Franklin', sans-serif" }}
            >
              ABTalks
            </span>
          </motion.div>

          {/* User Info + Avatar */}
          <motion.div 
            className="flex items-center gap-3 sm:gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          >
            {/* Desktop Name/Streak */}
            <div className="text-right hidden sm:block">
              <p 
                className="font-bold text-[15px] leading-tight text-white drop-shadow-sm"
                style={{ fontFamily: "'Libre Franklin', sans-serif" }}
              >
                {displayName}
              </p>
              <div className="flex items-center justify-end gap-2 mt-1">
                <div className="flex items-center gap-1 bg-[#151320] px-2 py-0.5 rounded-full border border-white/10">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                  <span 
                    className="text-[11px] font-bold tracking-wide text-gray-200"
                    style={{ fontFamily: "'Rubik', sans-serif" }}
                  >
                    Streak {streak}
                  </span>
                </div>
                {longest > 0 && (
                  <div className="flex items-center gap-1 bg-[#151320] px-2 py-0.5 rounded-full border border-white/5">
                    <Trophy className="w-3 h-3 text-yellow-400" />
                    <span 
                      className="text-[11px] font-medium text-gray-300"
                      style={{ fontFamily: "'Rubik', sans-serif" }}
                    >
                      Best {longest}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Stable Avatar Container (Always visible & properly sized) */}
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#151320] shadow-md border border-white/15 shrink-0">
              <UserButton />
              <span className="sm:hidden absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-amber-400 text-[#141226] text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#141226] shadow-md z-20">
                {streak}
              </span>
            </div>
          </motion.div>
        </div>

        {/* ═══ MOBILE: Name + Streak (below logo row) ═══ */}
        <motion.div 
          className="sm:hidden mt-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p 
            className="text-xl font-black text-white leading-tight drop-shadow-sm"
            style={{ fontFamily: "'Libre Franklin', sans-serif" }}
          >
            Hey, {displayName} 👋
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 bg-[#151320] px-2.5 py-1 rounded-full border border-white/15 shadow-sm">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span 
                className="text-[11px] font-bold text-white"
                style={{ fontFamily: "'Rubik', sans-serif" }}
              >
                {streak} day streak
              </span>
            </span>
            {longest > 0 && (
              <span className="inline-flex items-center gap-1.5 bg-[#151320] px-2.5 py-1 rounded-full border border-white/10">
                <Trophy className="w-3 h-3 text-yellow-400" />
                <span 
                  className="text-[11px] font-medium text-gray-300"
                  style={{ fontFamily: "'Rubik', sans-serif" }}
                >
                  Best {longest}
                </span>
              </span>
            )}
          </div>
        </motion.div>

        {/* ═══ QUOTE CARD (Solid Background) ═══ */}
        <motion.div 
          className="mt-6 sm:mt-7"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
        >
          <div className="relative">
            <div className="relative flex items-center gap-3.5 bg-[#151320] rounded-2xl sm:rounded-full border border-white/10 px-4 sm:px-7 py-3 sm:py-3.5 shadow-xl">
              <div className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1F1C2E] border border-white/15 flex items-center justify-center shadow-inner">
                <Zap className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-300 fill-amber-300/20" />
              </div>
              
              <div className="flex-1 min-w-0 py-0.5">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={quote}
                    className="text-[13px] sm:text-sm md:text-[15px] font-medium leading-snug sm:leading-relaxed text-gray-100 drop-shadow-sm flex items-center gap-2"
                    style={{ fontFamily: "'Rubik', sans-serif" }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.35 }}
                  >
                    <span>{quote}</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300/70 hidden sm:inline-block shrink-0" />
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══ BOTTOM CURVE ═══ */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <div className="h-6 sm:h-8 bg-[#141226] rounded-t-[32px] sm:rounded-t-[40px] transform translate-y-[1px]" />
      </div>
    </header>
  );
}

export default Header;