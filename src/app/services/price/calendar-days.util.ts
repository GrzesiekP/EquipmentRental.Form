const millisecondsPerDay = 86_400_000;

export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function calendarDaySpanDays(startDate: Date, endDate: Date): number {
  const startMid = startOfLocalDay(startDate);
  const endMid = startOfLocalDay(endDate);
  return Math.round((endMid.getTime() - startMid.getTime()) / millisecondsPerDay);
}
