import { calculateRentalDays } from './rental-days-calculator';

describe('calculateRentalDays', () => {
  it('returns one day and no discount for same calendar day', () => {
    const start = new Date(2024, 0, 1, 12, 0, 0);
    const end = new Date(2024, 0, 1, 18, 0, 0);
    const result = calculateRentalDays(start, end);
    expect(result.rentalDays).toBe(1);
    expect(result.weekendDiscount).toBeFalse();
  });

  it('returns expected days without discount when no qualifying weekend', () => {
    const cases: [string, string, number][] = [
      ['2024-01-01', '2024-01-02', 1],
      ['2024-01-01', '2024-01-03', 2],
      ['2024-01-01', '2024-01-05', 4],
    ];
    for (const [startStr, endStr, expectedDays] of cases) {
      const start = new Date(`${startStr}T12:00:00`);
      const end = new Date(`${endStr}T12:00:00`);
      const result = calculateRentalDays(start, end);
      expect(result.rentalDays).toBe(expectedDays);
      expect(result.weekendDiscount).toBeFalse();
    }
  });

  it('subtracts one day when exactly one full weekend qualifies', () => {
    const cases: [string, string, number][] = [
      ['2024-01-05', '2024-01-08', 2],
      ['2024-01-04', '2024-01-08', 3],
      ['2024-01-03', '2024-01-08', 4],
      ['2024-01-06', '2024-01-09', 2],
    ];
    for (const [startStr, endStr, expectedDays] of cases) {
      const start = new Date(`${startStr}T12:00:00`);
      const end = new Date(`${endStr}T12:00:00`);
      const result = calculateRentalDays(start, end);
      expect(result.rentalDays).toBe(expectedDays);
      expect(result.weekendDiscount).toBeTrue();
    }
  });

  it('does not apply discount when two weekends qualify', () => {
    const cases: [string, string, number][] = [
      ['2024-01-05', '2024-01-15', 10],
      ['2024-01-05', '2024-01-16', 11],
    ];
    for (const [startStr, endStr, expectedDays] of cases) {
      const start = new Date(`${startStr}T12:00:00`);
      const end = new Date(`${endStr}T12:00:00`);
      const result = calculateRentalDays(start, end);
      expect(result.rentalDays).toBe(expectedDays);
      expect(result.weekendDiscount).toBeFalse();
    }
  });

  it('ignores time of day for day span and weekend rules', () => {
    const friToMon = calculateRentalDays(
      new Date(2024, 0, 5, 14, 30, 0),
      new Date(2024, 0, 8, 9, 0, 0),
    );
    expect(friToMon.rentalDays).toBe(2);
    expect(friToMon.weekendDiscount).toBeTrue();

    const monToTue = calculateRentalDays(
      new Date(2024, 0, 1, 23, 0, 0),
      new Date(2024, 0, 2, 6, 0, 0),
    );
    expect(monToTue.rentalDays).toBe(1);
    expect(monToTue.weekendDiscount).toBeFalse();
  });
});
