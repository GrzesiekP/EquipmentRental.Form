import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { RentalDaysCalculator } from './rental-days-calculator';

describe('calculateRentalDays', () => {
  let calculator: RentalDaysCalculator;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RentalDaysCalculator, provideHttpClient(), provideHttpClientTesting()],
    });

    calculator = TestBed.inject(RentalDaysCalculator);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('returns one day and no discount for same calendar day', () => {
    const start = new Date(2024, 0, 1, 12, 0, 0);
    const end = new Date(2024, 0, 1, 18, 0, 0);
    const result = calculateAndFlush(start, end, '2024-01-01', '2024-01-01', {
      rentalDays: 1,
      weekendDiscountApplied: false,
    });
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
      const result = calculateAndFlush(start, end, startStr, endStr, {
        rentalDays: expectedDays,
        weekendDiscountApplied: false,
      });
      expect(result.rentalDays).toBe(expectedDays);
      expect(result.weekendDiscount).toBeFalse();
    }
  });

  it('subtracts one day when exactly one full weekend qualifies', () => {
    const cases: [string, string, number][] = [
      ['2024-01-05', '2024-01-08', 2],
    ];
    for (const [startStr, endStr, expectedDays] of cases) {
      const start = new Date(`${startStr}T12:00:00`);
      const end = new Date(`${endStr}T12:00:00`);
      const result = calculateAndFlush(start, end, startStr, endStr, {
        rentalDays: expectedDays,
        weekendDiscountApplied: true,
      });
      expect(result.rentalDays).toBe(expectedDays);
      expect(result.weekendDiscount).toBeTrue();
    }
  });

  it('does not apply discount when weekend included but start not at friday or end not at monday', () => {
    const cases: [string, string, number][] = [
      ['2024-01-04', '2024-01-08', 4],
      ['2024-01-05', '2024-01-09', 4],
      ['2024-01-06', '2024-01-10', 4],
      ['2024-01-03', '2024-01-07', 4],
    ];
    for (const [startStr, endStr, expectedDays] of cases) {
      const start = new Date(`${startStr}T12:00:00`);
      const end = new Date(`${endStr}T12:00:00`);
      const result = calculateAndFlush(start, end, startStr, endStr, {
        rentalDays: expectedDays,
        weekendDiscountApplied: false,
      });
      expect(result.rentalDays).toBe(expectedDays);
      expect(result.weekendDiscount).toBeFalse();
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
      const result = calculateAndFlush(start, end, startStr, endStr, {
        rentalDays: expectedDays,
        weekendDiscountApplied: false,
      });
      expect(result.rentalDays).toBe(expectedDays);
      expect(result.weekendDiscount).toBeFalse();
    }
  });

  it('ignores time of day for day span and weekend rules', () => {
    const friToMon = calculateAndFlush(
      new Date(2024, 0, 5, 14, 30, 0),
      new Date(2024, 0, 8, 9, 0, 0),
      '2024-01-05',
      '2024-01-08',
      { rentalDays: 2, weekendDiscountApplied: true },
    );
    expect(friToMon.rentalDays).toBe(2);
    expect(friToMon.weekendDiscount).toBeTrue();

    const monToTue = calculateAndFlush(
      new Date(2024, 0, 1, 23, 0, 0),
      new Date(2024, 0, 2, 6, 0, 0),
      '2024-01-01',
      '2024-01-02',
      { rentalDays: 1, weekendDiscountApplied: false },
    );
    expect(monToTue.rentalDays).toBe(1);
    expect(monToTue.weekendDiscount).toBeFalse();
  });

  function calculateAndFlush(
    start: Date,
    end: Date,
    pickupDate: string,
    returnDate: string,
    apiResponse: { rentalDays: number; weekendDiscountApplied: boolean },
  ): { rentalDays: number; weekendDiscount: boolean } {
    let result: { rentalDays: number; weekendDiscount: boolean } | undefined;

    calculator.calculateRentalDays(start, end).subscribe(value => {
      result = value;
    });

    const request = httpMock.expectOne(req => req.url === environment.rentalPeriodCalculatorUrl);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('PickupDate')).toBe(pickupDate);
    expect(request.request.params.get('ReturnDate')).toBe(returnDate);
    request.flush(apiResponse);

    if (!result) {
      fail('Expected rental period response');
      throw new Error('Expected rental period response');
    }

    return result;
  }
});
