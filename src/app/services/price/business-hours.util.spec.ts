import { isOutsideBusinessHours } from './business-hours.util';

describe('isOutsideBusinessHours', () => {
  it('returns true before 08:00 and from 18:00 inclusive', () => {
    expect(isOutsideBusinessHours(new Date(2024, 5, 10, 7, 59, 0))).toBeTrue();
    expect(isOutsideBusinessHours(new Date(2024, 5, 10, 8, 0, 0))).toBeFalse();
    expect(isOutsideBusinessHours(new Date(2024, 5, 10, 17, 59, 0))).toBeFalse();
    expect(isOutsideBusinessHours(new Date(2024, 5, 10, 18, 0, 0))).toBeTrue();
  });
});
