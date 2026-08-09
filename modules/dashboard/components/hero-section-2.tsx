'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TasksPanel from './tasks-section/task-panel';
import { SideCalendar } from './calender-section/side-calender';
import { StreakSummaryCard } from './calender-section/streak-summary-card';
import ActivityGraph from './graph-section/activity-graph';

export function HeroSectionTwo() {
  const [streakDates, setStreakDates] = useState<string[]>([]);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState({ title: '', message: '' });

  const totalDays = 60;

  const fetchUserProgress = useCallback(async () => {
    try {
      const res = await fetch('/api/user/progress');
      if (res.ok) {
        const data = await res.json();
        setStreakDates(data.completedDates || []);
        setCurrentStreak(data.currentStreak || 0);
      }
    } catch (err) {
      console.error('Failed to fetch progress:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProgress();

    const handleTaskLocked = (e: CustomEvent<{ title?: string; message?: string }>) => {
      setModalData({
        title: e.detail?.title || 'Notice',
        message: e.detail?.message || 'Action restricted.',
      });
      setShowModal(true);
    };

    window.addEventListener('progress-updated', fetchUserProgress);
    window.addEventListener('task-locked-event' as any, handleTaskLocked);

    return () => {
      window.removeEventListener('progress-updated', fetchUserProgress);
      window.removeEventListener('task-locked-event' as any, handleTaskLocked);
    };
  }, [fetchUserProgress]);

  return (
    <section 
      className="w-full min-h-screen bg-[#141226] px-3 xs:px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10 text-white relative overflow-x-hidden"
      style={{ fontFamily: "'Rubik', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-5 sm:gap-6 lg:gap-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Tasks Panel */}
          <motion.div 
            className="lg:col-span-3 w-full order-1 lg:order-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <TasksPanel />
          </motion.div>

          {/* Right Column: Calendar & Streak Summary (Aligned to top of Tasks Panel) */}
          <div className="lg:col-span-2 w-full flex flex-col gap-3 sm:gap-4 order-2 lg:order-2 lg:sticky lg:top-6 self-start">
            {loading ? (
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="bg-[#1A2238] border border-white/10 rounded-[18px] sm:rounded-[24px] p-4 sm:p-6 shadow-lg">
                  <div className="animate-pulse space-y-4">
                    <div 
                      className="h-4 bg-white/10 rounded-lg w-1/3"
                      style={{ fontFamily: "'Libre Franklin', sans-serif" }}
                    />
                    <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                      {Array.from({ length: 14 }).map((_, i) => (
                        <div key={i} className="h-7 sm:h-8 bg-white/5 rounded-lg" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-[#1A2238] border border-white/10 rounded-[18px] sm:rounded-[24px] p-4 sm:p-6 shadow-lg">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-white/10 rounded-lg w-2/3" />
                    <div className="h-3 bg-white/5 rounded-lg w-full" />
                    <div className="h-7 sm:h-8 bg-white/5 rounded-xl w-full" />
                  </div>
                </div>
              </div>
            ) : (
              <motion.div 
                className="flex flex-col gap-3 sm:gap-4 w-full"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
              >
                <div className="w-full">
                  <SideCalendar streakDates={streakDates} />
                </div>
                <div className="w-full">
                  <StreakSummaryCard currentDay={currentStreak} totalDays={totalDays} />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Activity Graph */}
        {!loading && (
          <motion.div 
            className="w-full order-3 overflow-x-auto pb-2 sm:pb-0"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
          >
            <ActivityGraph />
          </motion.div>
        )}
      </div>

      {/* LOCK / COMPLETED POPUP MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="bg-[#1E2C47] border border-white/20 p-4 sm:p-6 rounded-2xl sm:rounded-[28px] max-w-xs sm:max-w-md w-full shadow-2xl flex flex-col items-center text-center gap-3 sm:gap-4 mx-4"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            >
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#C6E98F]/20 border border-[#C6E98F]/40 flex items-center justify-center text-xl sm:text-2xl">
                🎯
              </div>

              <div className="space-y-1 sm:space-y-2">
                <h3 
                  className="text-sm sm:text-lg font-black text-white tracking-wide"
                  style={{ fontFamily: "'Libre Franklin', sans-serif" }}
                >
                  {modalData.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {modalData.message}
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="mt-1 sm:mt-2 w-full py-2.5 sm:py-3 bg-[#C6E98F] text-[#1E2C47] font-extrabold rounded-full hover:bg-[#b0d876] active:scale-[0.97] transition-all text-xs sm:text-sm tracking-wider uppercase cursor-pointer shadow-md"
                style={{ fontFamily: "'Libre Franklin', sans-serif" }}
              >
                Got It
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default HeroSectionTwo;
