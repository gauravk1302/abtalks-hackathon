'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { MoreVertical, CheckSquare, CheckCircle2, Circle, Pencil, Check } from 'lucide-react';
import { FolderTabShape } from '../folder-tab-shape';

interface CategoryProgress {
  category: string;
  currentDay: number;
  completedDays: number[];
  completedDates?: (string | Date)[];
}

const categoryMeta: Record<
  string,
  {
    time: string;
    endTime: string;
    title: string;
    subtitle: string;
    fillColor: string;
    textColor: string;
  }
> = {
  development: {
    time: '10 am',
    endTime: '02 pm',
    title: 'Development',
    subtitle: 'Learning Task',
    fillColor: '#C6E98F',
    textColor: 'text-[#1E2C47]',
  },
  dsa: {
    time: '03 pm',
    endTime: '04 pm',
    title: 'Problem Solving',
    subtitle: 'Daily Task',
    fillColor: '#22D3EE',
    textColor: 'text-[#1E2C47]',
  },
  'system-design': {
    time: '06 pm',
    endTime: '08 pm',
    title: 'System Design',
    subtitle: 'Weekly Task',
    fillColor: '#E8D7F1',
    textColor: 'text-[#1E2C47]',
  },
  mern: {
    time: '09 pm',
    endTime: '10 pm',
    title: 'Mern Stack',
    subtitle: 'Project Task',
    fillColor: '#FFCB77',
    textColor: 'text-[#1E2C47]',
  },
};

const CATEGORY_ORDER = ['development', 'dsa', 'system-design', 'mern'];
const TOTAL_DAYS = 60;

export function TasksPanel() {
  const [progressMap, setProgressMap] = useState<Record<string, CategoryProgress>>({});
  const [categoryActivity, setCategoryActivity] = useState<
    Record<string, { avatars: { name: string; image?: string }[]; total: number }>
  >({});
  const [loading, setLoading] = useState(true);

  // ✏️ Editable timeline labels — local UI state only, per category
  const [timeOverrides, setTimeOverrides] = useState<
    Record<string, { time: string; endTime: string }>
  >({});
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [draftTime, setDraftTime] = useState('');
  const [draftEndTime, setDraftEndTime] = useState('');

  // 🔄 Fetch backend progress
  const fetchProgress = useCallback(() => {
    fetch('/api/user/progress')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          const map: Record<string, CategoryProgress> = {};
          data.categories.forEach((c: CategoryProgress) => {
            map[c.category] = c;
          });
          setProgressMap(map);
        }
      })
      .catch((err) => console.error('Error fetching progress:', err))
      .finally(() => setLoading(false));
  }, []);

  // 🔄 Fetch recent solver avatars per category
  const fetchCategoryActivity = useCallback(() => {
    fetch('/api/category-activity')
      .then((res) => res.json())
      .then((data) => {
        if (data.categoryActivity) {
          setCategoryActivity(data.categoryActivity);
        }
      })
      .catch((err) => console.error('Error fetching category activity:', err));
  }, []);

  useEffect(() => {
    fetchProgress();
    fetchCategoryActivity();
    window.addEventListener('progress-updated', fetchProgress);
    window.addEventListener('progress-updated', fetchCategoryActivity);
    return () => {
      window.removeEventListener('progress-updated', fetchProgress);
      window.removeEventListener('progress-updated', fetchCategoryActivity);
    };
  }, [fetchProgress, fetchCategoryActivity]);

  // Check if completed today helper
  const isCompletedToday = (completedDates: (string | Date)[] = []): boolean => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    return completedDates.some((d) => {
      const dateObj = new Date(d);
      if (isNaN(dateObj.getTime())) return false;
      const dYear = dateObj.getFullYear();
      const dMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
      const dDay = String(dateObj.getDate()).padStart(2, '0');
      return `${dYear}-${dMonth}-${dDay}` === todayStr;
    });
  };

  // Prevent Navigation if Today Completed
  const handleCardClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    categoryTitle: string,
    completedDates: (string | Date)[] = []
  ) => {
    if (isCompletedToday(completedDates)) {
      e.preventDefault();
      window.dispatchEvent(
        new CustomEvent('task-locked-event', {
          detail: {
            title: "Task Completed Today! 🎯",
            message: `You have already completed today's task for ${categoryTitle}. The next task will unlock tomorrow!`,
          },
        })
      );
    }
  };

  // ✏️ Timeline edit handlers
  const startEditing = (category: string) => {
    const current = timeOverrides[category] || {
      time: categoryMeta[category].time,
      endTime: categoryMeta[category].endTime,
    };
    setDraftTime(current.time);
    setDraftEndTime(current.endTime);
    setEditingCategory(category);
  };

  const saveEditing = (category: string) => {
    setTimeOverrides((prev) => ({
      ...prev,
      [category]: { time: draftTime.trim(), endTime: draftEndTime.trim() },
    }));
    setEditingCategory(null);
  };

  if (loading) {
    return (
      <div className="w-full py-10 text-center text-gray-500 text-sm font-[family-name:var(--font-rubik)]">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full pt-2 antialiased font-[family-name:var(--font-rubik)]">

      {/* 📍 CATEGORIES LIST WITH DYNAMIC Y-AXIS TIMELINE */}
      <div className="flex flex-col gap-8 sm:gap-6 relative">
        {CATEGORY_ORDER.map((category, index) => {
          const meta = categoryMeta[category];
          const displayTime = timeOverrides[category]?.time ?? meta.time;
          const displayEndTime = timeOverrides[category]?.endTime ?? meta.endTime;
          const isEditing = editingCategory === category;

          const progress = progressMap[category] || {
            category,
            currentDay: 1,
            completedDays: [],
            completedDates: [],
          };
          const dayId = progress.currentDay;
          const doneToday = isCompletedToday(progress.completedDates);
          const hasStarted = progress.completedDays.length > 0;
          const status = doneToday ? 'Completed' : hasStarted ? 'Running' : 'Pending';

          const completedCount = progress.completedDays?.length || 0;
          const progressPercent = Math.min(
            100,
            Math.round((completedCount / TOTAL_DAYS) * 100)
          );

          return (
            <div key={category} className="flex gap-2 sm:gap-4 items-center relative group/row">

              {/* 🟢 DYNAMIC Y-AXIS TIMELINE COLUMN */}
              <div className="w-12 sm:w-16 flex flex-col justify-between items-end h-[120px] sm:h-[140px] relative flex-shrink-0 py-1">
                {isEditing ? (
                  <input
                    autoFocus
                    value={draftTime}
                    onChange={(e) => setDraftTime(e.target.value)}
                    className="w-12 sm:w-16 text-[10px] sm:text-[11px] font-extrabold text-right bg-[#1E2C47] text-white rounded px-1 py-0.5 outline-none border border-[#31C3EE]/50 font-[family-name:var(--font-libre-franklin)]"
                  />
                ) : (
                  <span
                    className="text-[10px] sm:text-[12px] font-black tracking-tight leading-none font-[family-name:var(--font-libre-franklin)]"
                    style={{ color: meta.fillColor }}
                  >
                    {displayTime}
                  </span>
                )}

                {/* Y-Axis Line & Dynamic Status Dot */}
                <div className="flex-1 w-full my-1 flex flex-col items-center justify-center relative">
                  {/* Status Indicator Dot on Y-Axis (Using category meta.fillColor when doneToday) */}
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center z-10 transition-all ${
                      doneToday
                        ? 'text-[#1E2C47] shadow-lg scale-110'
                        : 'bg-[#1E2C47] text-gray-500 border border-white/20'
                    }`}
                    style={doneToday ? { backgroundColor: meta.fillColor, boxShadow: `0 10px 15px -3px ${meta.fillColor}40` } : {}}
                  >
                    {doneToday ? (
                      <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-[#1E2C47]" />
                    ) : (
                      <Circle className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-current" />
                    )}
                  </div>

                  {/* Connecting Vertical Line (Using meta.fillColor when doneToday) */}
                  <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 20 60" preserveAspectRatio="none">
                    <line
                      x1="10"
                      y1="0"
                      x2="10"
                      y2="100%"
                      stroke={doneToday ? meta.fillColor : '#334155'}
                      strokeWidth={doneToday ? '3' : '2'}
                      strokeDasharray={doneToday ? 'none' : '4 4'}
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* ✏️ Edit toggle */}
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => startEditing(category)}
                      className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#1E2C47] border border-white/10 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-[#31C3EE]/20"
                      aria-label="Edit time"
                    >
                      <Pencil className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-gray-300" />
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <input
                      value={draftEndTime}
                      onChange={(e) => setDraftEndTime(e.target.value)}
                      className="w-9 sm:w-11 text-[9px] sm:text-[10px] font-medium text-right bg-[#1E2C47] text-white rounded px-1 py-0.5 outline-none border border-[#31C3EE]/50 font-[family-name:var(--font-rubik)]"
                    />
                    <button
                      type="button"
                      onClick={() => saveEditing(category)}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: meta.fillColor }}
                      aria-label="Save time"
                    >
                      <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#1E2C47]" />
                    </button>
                  </div>
                ) : (
                  <span
                    className="text-[9px] sm:text-[11px] font-bold tracking-tight leading-none opacity-70 font-[family-name:var(--font-libre-franklin)]"
                    style={{ color: meta.fillColor }}
                  >
                    {displayEndTime}
                  </span>
                )}
              </div>

              {/* 🗂️ FOLDER TAB CARD */}
              <Link
                href={`/day/${category}/${dayId}`}
                onClick={(e) => handleCardClick(e, meta.title, progress.completedDates)}
                className={`flex-1 relative ${meta.textColor} min-h-[120px] sm:h-[140px] px-4 sm:px-8 pt-5 sm:pt-6 pb-4 sm:pb-6 shadow-xl transition-all duration-300 hover:scale-[1.01] overflow-visible flex items-center cursor-pointer block`}
              >
                <FolderTabShape fill={meta.fillColor} className="drop-shadow-lg" />

                {/* Top Right Header: Avatars + Progress Bar */}
                <div className="absolute -top-2.5 sm:-top-3 right-3 sm:right-8 flex items-center gap-2.5 sm:gap-4 z-30">
                  
                  {/* Avatars */}
                  <div className="flex items-center -space-x-1.5 sm:-space-x-2">
                    {(categoryActivity[category]?.avatars || []).map((solver, i) => (
                      solver.image ? (
                        <img
                          key={i}
                          src={solver.image}
                          alt={solver.name}
                          title={solver.name}
                          className="w-5 h-5 sm:w-7 sm:h-7 rounded-full object-cover border-[1.5px] border-[#1E2C47] shadow-sm"
                        />
                      ) : (
                        <div
                          key={i}
                          title={solver.name}
                          className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#1E2C47] text-white flex items-center justify-center text-[8px] sm:text-[9px] font-bold border-[1.5px] border-[#1E2C47] shadow-sm font-[family-name:var(--font-libre-franklin)]"
                        >
                          {solver.name[0]}
                        </div>
                      )
                    ))}
                    {(categoryActivity[category]?.total || 0) > 4 && (
                      <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#1E2C47] text-white flex items-center justify-center text-[8px] sm:text-[9px] font-black border-[1.5px] border-[#1E2C47] shadow-sm font-[family-name:var(--font-libre-franklin)]">
                        +{(categoryActivity[category]?.total || 0) - 4}
                      </div>
                    )}
                  </div>

                  {/* 60-Day Category Progress Bar */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-12 sm:w-16 h-1.5 sm:h-2 rounded-full bg-black/30 border border-white/10 overflow-hidden relative">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(progressPercent, 4)}%`,
                          backgroundColor: meta.fillColor,
                        }}
                      />
                    </div>
                    <span
                      className="text-[9px] sm:text-[10px] font-black tracking-wider text-[#1E2C47] px-1 sm:px-1.5 py-0.5 rounded shadow-sm font-[family-name:var(--font-libre-franklin)]"
                      style={{ backgroundColor: meta.fillColor }}
                    >
                      {progressPercent}%
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="relative z-20 w-full flex flex-col justify-center pt-2 sm:pt-3">
                  <div className="absolute -top-5 sm:-top-7 left-0 sm:left-1 flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[11px] sm:text-[14px] font-black tracking-wider uppercase font-[family-name:var(--font-libre-franklin)]">
                      {status}
                    </span>
                    {doneToday && (
                      <span 
                        className="hidden sm:inline-block text-[8px] sm:text-[10px] text-[#1E2C47] px-1.5 sm:px-2 py-0.5 rounded-full font-bold shadow-sm"
                        style={{ backgroundColor: meta.fillColor }}
                      >
                        ✓ Done Today
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
                    <div className="flex items-center gap-3 sm:gap-5 min-w-0">
                      
                      {/* Responsive Square Icon Box */}
                      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-[#1E2C47] rounded-[10px] sm:rounded-[16px] rotate-45 flex items-center justify-center flex-shrink-0 shadow-md">
                        <div
                          className="w-[20px] h-[20px] sm:w-[28px] sm:h-[28px] rounded-sm sm:rounded-md -rotate-45 flex items-center justify-center"
                          style={{ backgroundColor: meta.fillColor }}
                        >
                          <CheckSquare className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#1E2C47]" />
                        </div>
                      </div>

                      {/* Text Section */}
                      <div className="min-w-0">
                        <h3 className="text-[18px] sm:text-[24px] font-black tracking-tight leading-tight truncate font-[family-name:var(--font-libre-franklin)]">
                          {meta.title}
                        </h3>
                        <p className="text-[12px] sm:text-[14px] font-medium sm:font-semibold opacity-75 mt-0.5 truncate">
                          Day {dayId} · {meta.subtitle}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="p-1 sm:p-2 rounded-full hover:bg-black/10 transition-colors cursor-pointer flex-shrink-0"
                    >
                      <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 opacity-80" />
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TasksPanel;