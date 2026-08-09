/**
 * modules/dashboard/lib/streak-dates.ts (or wherever it currently lives)
 *
 * Helpers to check whether a given calendar date is part of the
 * user's completed-challenge streak. Handles both real Date objects
 * and ISO date strings ("YYYY-MM-DD" or full ISO with time), since
 * /api/user/progress returns completedDates as "YYYY-MM-DD" strings.
 */

function toYMD(value: Date | string): { y: number; m: number; d: number } | null {
  if (typeof value === 'string') {
    const clean = value.split('T')[0]; // strip time if present
    const [y, m, d] = clean.split('-').map(Number);
    if (!y || !m || !d) return null;
    return { y, m, d };
  }

  if (value instanceof Date && !isNaN(value.getTime())) {
    return { y: value.getFullYear(), m: value.getMonth() + 1, d: value.getDate() };
  }

  return null;
}

export function isSameDate(a: Date | string, b: Date | string): boolean {
  const da = toYMD(a);
  const db = toYMD(b);
  if (!da || !db) return false;
  return da.y === db.y && da.m === db.m && da.d === db.d;
}

export function isStreakDay(date: Date, streakDates: (Date | string)[]): boolean {
  if (!date || !streakDates || streakDates.length === 0) return false;
  return streakDates.some((d) => isSameDate(d, date));
}