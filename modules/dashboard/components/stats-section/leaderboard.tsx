'use client';

import React, { useEffect, useState } from 'react';
import { Crown, X, Search } from 'lucide-react';

interface LeaderboardEntry {
  authUserId: string;
  name: string;
  image?: string;
  totalCompleted: number;
  lastActiveDate: string | null;
  rank: number;
}

// Cycled per rank position for podium/list accents
const PALETTE = ['#FFD88A', '#C6EB8B', '#31C3EE', '#D8C6E8'];
const PODIUM_HEIGHTS: Record<number, string> = { 1: 'h-28 sm:h-32', 2: 'h-20 sm:h-24', 3: 'h-14 sm:h-16' };

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔍 Modal & Search State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        setEntries(data.leaderboard || []);
        setCurrentUserId(data.currentUserId || null);
      })
      .catch((err) => console.error('Error fetching leaderboard:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0F0E17] border border-white/15 rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 flex items-center justify-center h-full min-h-[300px]">
        <span className="text-xs text-gray-400 animate-pulse font-[family-name:var(--font-rubik)]">
          Loading leaderboard...
        </span>
      </div>
    );
  }

  const top3 = entries.slice(0, 3);
  // Podium display order: rank 2 (left), rank 1 (center, tallest), rank 3 (right)
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean) as LeaderboardEntry[];

  const remaining = entries.slice(3);
  const currentUser = entries.find((e) => e.authUserId === currentUserId);

  // Filtered entries for the modal search
  const filteredModalEntries = entries.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#0F0E17] border border-white/15 rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 flex flex-col gap-6 sm:gap-8 shadow-2xl h-full font-[family-name:var(--font-rubik)] relative">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-black tracking-wide text-white font-[family-name:var(--font-libre-franklin)]">
          Leaderboard
        </h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="text-xs font-bold text-[#31C3EE] cursor-pointer hover:underline bg-transparent border-none p-0"
        >
          View all &gt;
        </button>
      </div>

      {/* TOP 3 PODIUM SECTION */}
      {podiumOrder.length > 0 && (
        <div className="flex justify-center items-end gap-2.5 sm:gap-4 pt-3 pb-2 border-b border-white/10 overflow-x-auto">
          {podiumOrder.map((user) => {
            const color = PALETTE[(user.rank - 1) % PALETTE.length];
            const isMe = user.authUserId === currentUserId;

            return (
              <div key={user.authUserId} className="flex flex-col items-center flex-1 min-w-[80px] max-w-[110px] sm:max-w-[120px] relative">
                {user.rank === 1 && (
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5 mb-1 text-[#FBBF24] fill-[#FBBF24]" />
                )}
                
                <div
                  className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full overflow-hidden mb-2 shadow-lg bg-[#1E2C47] shrink-0 ${
                    isMe ? 'ring-2 ring-[#31C3EE] ring-offset-2 ring-offset-[#0F0E17]' : ''
                  }`}
                  style={{ border: `3px solid ${color}` }}
                >
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-white font-[family-name:var(--font-libre-franklin)]">
                      {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                  )}
                </div>

                <span className="text-[11px] sm:text-xs font-bold text-white truncate w-full text-center">
                  {user.name} {isMe && <span className="text-[#31C3EE]">(You)</span>}
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold text-gray-400 mb-2">
                  {user.totalCompleted} tasks
                </span>

                <div
                  className={`w-full ${PODIUM_HEIGHTS[user.rank] || 'h-16'} rounded-t-[14px] sm:rounded-t-[18px] flex items-start justify-center pt-2 sm:pt-3 text-base sm:text-lg font-black text-[#121826] shadow-inner font-[family-name:var(--font-libre-franklin)]`}
                  style={{ backgroundColor: color }}
                >
                  {user.rank}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* REMAINING RANKS LIST */}
      {remaining.length > 0 && (
        <div className="flex flex-col gap-2.5 sm:gap-3">
          {remaining.map((user) => {
            const color = PALETTE[user.rank % PALETTE.length];
            const isMe = user.authUserId === currentUserId;

            return (
              <div
                key={user.authUserId}
                className={`flex items-center justify-between p-3.5 sm:p-4 rounded-[16px] sm:rounded-[20px] transition-colors gap-3 ${
                  isMe
                    ? 'bg-[#1F2E4D] border-2 border-[#31C3EE] shadow-md'
                    : 'bg-[#121826] border border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <span className="text-xs sm:text-sm font-black text-gray-400 w-5 sm:w-6 shrink-0 font-[family-name:var(--font-libre-franklin)]">
                    {String(user.rank).padStart(2, '0')}
                  </span>

                  <div
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden shrink-0 bg-[#1E2C47]"
                    style={{ border: `2px solid ${color}` }}
                  >
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white font-[family-name:var(--font-libre-franklin)]">
                        {user.name[0]}
                      </div>
                    )}
                  </div>

                  <span className="text-xs sm:text-sm font-bold text-white truncate font-[family-name:var(--font-libre-franklin)]">
                    {user.name} {isMe && <span className="text-[#31C3EE]">(You)</span>}
                  </span>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  <span className="text-[11px] sm:text-[12px] font-bold text-gray-300">
                    {user.totalCompleted} <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase">tasks</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {entries.length === 0 && (
        <div className="text-center text-xs text-gray-500 py-6">No participants yet.</div>
      )}

      {/* 🌟 VIEW ALL FULL LEADERBOARD MODAL POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0F0E17] border border-white/20 rounded-[24px] sm:rounded-[32px] w-full max-w-xl max-h-[85vh] flex flex-col p-5 sm:p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-base sm:text-xl font-black text-white font-[family-name:var(--font-libre-franklin)]">
                  Full Leaderboard
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                  Total {entries.length} participants competing
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setSearchQuery('');
                }}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="py-4">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search participant by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#121826] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none focus:border-[#31C3EE] transition-colors"
                />
              </div>
            </div>

            {/* Scrollable List inside Modal */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 custom-scrollbar">
              {filteredModalEntries.length > 0 ? (
                filteredModalEntries.map((user) => {
                  const color = PALETTE[(user.rank - 1) % PALETTE.length];
                  const isMe = user.authUserId === currentUserId;

                  return (
                    <div
                      key={user.authUserId}
                      className={`flex items-center justify-between p-3.5 rounded-[16px] transition-colors gap-3 ${
                        isMe
                          ? 'bg-[#1F2E4D] border-2 border-[#31C3EE] shadow-md'
                          : 'bg-[#121826] border border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs sm:text-sm font-black text-gray-400 w-6 shrink-0 font-[family-name:var(--font-libre-franklin)]">
                          #{user.rank}
                        </span>

                        <div
                          className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-[#1E2C47]"
                          style={{ border: `2px solid ${color}` }}
                        >
                          {user.image ? (
                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white font-[family-name:var(--font-libre-franklin)]">
                              {user.name[0]}
                            </div>
                          )}
                        </div>

                        <span className="text-xs sm:text-sm font-bold text-white truncate font-[family-name:var(--font-libre-franklin)]">
                          {user.name} {isMe && <span className="text-[#31C3EE]">(You)</span>}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-gray-300">
                          {user.totalCompleted} <span className="text-[10px] text-gray-500 uppercase">tasks</span>
                        </span>
                        {user.rank === 1 && <Crown className="w-4 h-4 text-[#FBBF24] fill-[#FBBF24]" />}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-xs text-gray-500 py-10">
                  No participants found matching &quot;{searchQuery}&quot;
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Leaderboard;