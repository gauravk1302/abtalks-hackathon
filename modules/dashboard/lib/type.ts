/**
 * modules/dashboard/types.ts
 *
 * Agar tumhare paas already ek types.ts hai dashboard module mein,
 * to sirf ye interface usme add/merge kar lena — poori file overwrite
 * mat karna.
 */

export interface SideCalendarProps {
  /** Dates jinpe user ne challenge complete kiya (streak days). */
  streakDates?: Date[];
}