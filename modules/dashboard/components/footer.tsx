import React from 'react';
import { Flame, Trophy, Target, ArrowUpRight } from 'lucide-react';

export function Footer() {
  const links = [
    { label: 'Dashboard', href: '#' },
    { label: 'Tasks', href: '#' },
    { label: 'Leaderboard', href: '#' },
    { label: 'Achievements', href: '#' },
  ];

  const stats = [
    { icon: Flame, label: 'Streak', value: 'Active' },
    { icon: Trophy, label: 'Rank', value: 'Top 5%' },
    { icon: Target, label: 'Goals', value: 'On Track' },
  ];

  return (
    <footer 
      className="w-full bg-[#1A2238] border-t border-white/10 mt-12 sm:mt-16 text-white relative overflow-hidden"
      style={{ fontFamily: "var(--font-rubik), 'Rubik', sans-serif" }}
    >
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-[#C6EB8B]/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        
        {/* ═══ TOP ROW: Brand + Stats Pills ═══ */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-12 mb-8 sm:mb-10">
          
          {/* Brand */}
          <div className="flex flex-col items-center lg:items-start gap-3 text-center lg:text-left">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6EB8B] opacity-40" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C6EB8B]" />
              </span>
              <span 
                className="text-lg sm:text-xl font-black tracking-tight text-white"
                style={{ fontFamily: "var(--font-libre-franklin), 'Libre Franklin', sans-serif" }}
              >
                ABTalks
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-400 leading-relaxed max-w-xs">
              Manage your daily tasks, track streaks, and climb the leaderboard.
            </p>
          </div>
        </div>

        {/* ═══ BOTTOM ROW: Copyright + Social ═══ */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 sm:mt-8">
          
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-gray-500 font-medium">
            <span>&copy; {new Date().getFullYear()} ABTalks.</span>
            <span className="hidden sm:inline">All rights reserved.</span>
          </div>

          {/* Social / Legal Links */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="#" className="text-[10px] sm:text-[11px] font-medium text-gray-500 hover:text-gray-300 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-[10px] sm:text-[11px] font-medium text-gray-500 hover:text-gray-300 transition-colors">
              Terms
            </a>
            <a href="#" className="text-[10px] sm:text-[11px] font-medium text-gray-500 hover:text-gray-300 transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}