'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Activity, Sparkles, CheckCircle2 } from 'lucide-react';

interface DayGraphPoint {
  day: string;
  dateStr: string;
  completedCount: number; // 0, 1, 2, 3, or 4
  percentage: number;     // 0%, 25%, 50%, 75%, 100%
  completedCategories: string[];
}

// Database keys mapping to exact UI category names
const CATEGORY_NAME_MAP: Record<string, string> = {
  development: 'Development',
  dev: 'Development',
  dsa: 'DSA',
  'problem-solving': 'DSA',
  'system-design': 'System Design',
  systemdesign: 'System Design',
  mern: 'MERN Stack',
  'mern-stack': 'MERN Stack',
};

export default function ActivityGraph() {
  const [data, setData] = useState<DayGraphPoint[]>([]);
  const [todayCompletedCount, setTodayCompletedCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Process DB response for last 7 days dynamically
  const processWeeklyData = (categories: any[]): DayGraphPoint[] => {
    const daysList: { dateStr: string; dayLabel: string }[] = [];
    const pointsMap: Record<string, { count: number; names: Set<string> }> = {};

    // Get last 7 days YYYY-MM-DD
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

      daysList.push({ dateStr, dayLabel });
      pointsMap[dateStr] = { count: 0, names: new Set() };
    }

    // Parse Database Categories
    if (categories && Array.isArray(categories)) {
      categories.forEach((catObj) => {
        const rawKey = String(catObj.category || '').toLowerCase().trim();
        const displayTitle = CATEGORY_NAME_MAP[rawKey] || catObj.category || 'Task';

        const completedDatesList = catObj.completedDates || [];

        completedDatesList.forEach((dateVal: string | Date) => {
          if (!dateVal) return;
          const dObj = new Date(dateVal);
          if (isNaN(dObj.getTime())) return;

          const dYear = dObj.getFullYear();
          const dMonth = String(dObj.getMonth() + 1).padStart(2, '0');
          const dDay = String(dObj.getDate()).padStart(2, '0');
          const formatted = `${dYear}-${dMonth}-${dDay}`;

          if (pointsMap[formatted]) {
            if (!pointsMap[formatted].names.has(displayTitle)) {
              pointsMap[formatted].names.add(displayTitle);
            }
          }
        });
      });
    }

    return daysList.map(({ dateStr, dayLabel }) => {
      const entry = pointsMap[dateStr] || { count: 0, names: new Set() };
      const categoryNames = Array.from(entry.names);
      const count = Math.min(4, categoryNames.length);
      const percentage = Math.round((count / 4) * 100);

      return {
        day: dayLabel,
        dateStr,
        completedCount: count,
        percentage,
        completedCategories: categoryNames,
      };
    });
  };

  const fetchGraphData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/user/progress');
      if (res.ok) {
        const result = await res.json();
        const categories = result.categories || [];
        const processed = processWeeklyData(categories);

        setData(processed);

        if (processed.length > 0) {
          const todayPoint = processed[processed.length - 1];
          setTodayCompletedCount(todayPoint.completedCount);
        }
      }
    } catch (err) {
      console.error('Failed to fetch activity graph data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGraphData();
    window.addEventListener('progress-updated', fetchGraphData);
    return () => window.removeEventListener('progress-updated', fetchGraphData);
  }, [fetchGraphData]);

  if (loading) {
    return (
      <div className="w-full h-48 sm:h-56 bg-[#1E2C47]/50 border border-white/10 rounded-3xl flex items-center justify-center text-xs text-[#C6E98F] animate-pulse font-[family-name:var(--font-rubik)]">
        Fetching live Database activity...
      </div>
    );
  }

  return (
    <div className="w-full bg-[#1E2C47]/60 border border-white/10 rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden backdrop-blur-md font-[family-name:var(--font-rubik)]">
      
      {/* Background Accent Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C6E98F]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#22D3EE]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 rounded-2xl bg-[#C6E98F]/10 border border-[#C6E98F]/30 text-[#C6E98F]">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide flex items-center gap-1.5 font-[family-name:var(--font-libre-franklin)]">
              Live Weekly Velocity <Sparkles className="w-3.5 h-3.5 text-[#C6E98F]" />
            </h3>
            <p className="text-[10px] sm:text-[11px] font-medium text-gray-400">
              Y-Axis: Completed Tasks (0 to 4)
            </p>
          </div>
        </div>

        {/* Lime Accent Badge */}
        <div className="flex items-center gap-1.5 bg-[#C6E98F]/15 border border-[#C6E98F]/40 px-3 py-1.5 rounded-2xl self-start sm:self-auto">
          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C6E98F]" />
          <span className="text-[11px] sm:text-xs font-bold text-[#C6E98F] font-[family-name:var(--font-libre-franklin)]">
            {todayCompletedCount} / 4 Today ({todayCompletedCount * 25}%)
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-44 sm:h-52 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="imageThemeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C6E98F" stopOpacity={0.4} />
                <stop offset="60%" stopColor="#C6E98F" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#C6E98F" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />

            <XAxis
              dataKey="day"
              stroke="#94A3B8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={6}
            />

            <YAxis
              stroke="#94A3B8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={[0, 4]}
              ticks={[0, 1, 2, 3, 4]}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pointData: DayGraphPoint = payload[0].payload;
                  return (
                    <div className="bg-[#141226] border border-[#C6E98F]/30 p-3 rounded-2xl shadow-2xl flex flex-col gap-2 min-w-[150px] sm:min-w-[170px]">
                      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                        <span className="text-xs font-bold text-white font-[family-name:var(--font-libre-franklin)]">{pointData.day}</span>
                        <span className="text-[10px] font-bold text-[#141226] bg-[#C6E98F] px-2 py-0.5 rounded-full font-[family-name:var(--font-libre-franklin)]">
                          {pointData.percentage}%
                        </span>
                      </div>

                      <div className="text-[11px] font-medium text-gray-300">
                        Tasks Done: <span className="text-[#C6E98F] font-bold">{pointData.completedCount} / 4</span>
                      </div>

                      {pointData.completedCategories.length > 0 ? (
                        <div className="flex flex-col gap-1 mt-0.5">
                          <span className="text-[10px] text-gray-400">Completed:</span>
                          <div className="flex flex-wrap gap-1">
                            {pointData.completedCategories.map((catName, idx) => (
                              <span
                                key={idx}
                                className="text-[9px] sm:text-[10px] font-bold bg-[#C6E98F]/15 text-[#C6E98F] border border-[#C6E98F]/30 px-1.5 sm:px-2 py-0.5 rounded-md"
                              >
                                ✓ {catName}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-500 italic">
                          No tasks completed
                        </span>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="completedCount"
              stroke="#C6E98F"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#imageThemeGradient)"
              dot={{ r: 3, fill: '#C6E98F', strokeWidth: 2, stroke: '#1E2C47' }}
              activeDot={{ r: 5, fill: '#C6E98F', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}