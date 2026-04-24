import { calendarDaySpanDays, startOfLocalDay } from './calendar-days.util';

export function countWeekendDiscountDays(start: Date, end: Date): number {
  if (calendarDaySpanDays(start, end) < 3) {
    return 0;
  }

  const startMidnight = startOfLocalDay(start);
  const saturday = new Date(startMidnight);
  const daysToSaturday = (6 - saturday.getDay() + 7) % 7;
  saturday.setDate(saturday.getDate() + daysToSaturday);

  let count = 0;
  while (saturday.getTime() < end.getTime()) {
    const sundayStart = new Date(saturday);
    sundayStart.setDate(sundayStart.getDate() + 1);
    if (sundayStart.getTime() < end.getTime()) {
      count++;
    }
    saturday.setDate(saturday.getDate() + 7);
  }

  return count === 1 ? 1 : 0;
}
