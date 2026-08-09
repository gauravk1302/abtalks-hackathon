export function isStreakDay(
  calendarDate: Date,
  streakDates: (string | Date)[]
): boolean {
  if (!calendarDate || !streakDates || streakDates.length === 0) return false;

  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth() + 1;
  const calDay = calendarDate.getDate();

  return streakDates.some((d) => {
    if (typeof d === 'string') {
      const cleanDate = d.split('T')[0];
      const [year, month, day] = cleanDate.split('-').map(Number);
      return year === calYear && month === calMonth && day === calDay;
    }

    const dateObj = new Date(d);
    return (
      dateObj.getFullYear() === calYear &&
      dateObj.getMonth() + 1 === calMonth &&
      dateObj.getDate() === calDay
    );
  });
}