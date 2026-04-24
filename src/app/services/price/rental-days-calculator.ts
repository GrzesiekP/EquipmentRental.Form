import { calendarDaySpanDays } from './calendar-days.util';
import { countWeekendDiscountDays } from './weekend-discount-calculator';

export function calculateRentalDays(
  start: Date,
  end: Date,
): { rentalDays: number; weekendDiscount: boolean } {
  const baseDays = calendarDaySpanDays(start, end);
  if (baseDays === 0) {
    return { rentalDays: 1, weekendDiscount: false };
  }

  const weekendDeduction = countWeekendDiscountDays(start, end);
  return {
    rentalDays: baseDays - weekendDeduction,
    weekendDiscount: weekendDeduction > 0,
  };
}
