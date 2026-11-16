import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { DiscountType } from '../models/promo-code.model';
import { EquipmentCategory, EquipmentSetting, SettingsService } from './settings.service';
import { LocalPriceCalculationService } from './local-price-calculation.service';
import { RentalDaysCalculator } from './price/rental-days-calculator';

describe('LocalPriceCalculationService', () => {
  let service: LocalPriceCalculationService;
  let settingsStub: { equipmentItems: EquipmentSetting[] };

  beforeEach(() => {
    settingsStub = {
      equipmentItems: [
        {
          id: 'cat-kask',
          displayName: 'Kask',
          category: EquipmentCategory.Kask,
          pricePerDay: 25,
        },
      ],
    };

    TestBed.configureTestingModule({
      providers: [
        LocalPriceCalculationService,
        { provide: SettingsService, useValue: settingsStub },
        {
          provide: RentalDaysCalculator,
          useValue: {
            calculateRentalDays: () => of({ rentalDays: 1, weekendDiscount: false }),
          },
        },
      ],
    });

    service = TestBed.inject(LocalPriceCalculationService);
  });

  it('sums price per day times amount times rental days', async () => {
    const result = await firstValueFrom(
      service.calculatePrice({
        items: [{ categoryId: 'cat-kask', amount: 2 }],
        startDate: '2024-01-01T10:00:00',
        endDate: '2024-01-02T10:00:00',
      }),
    );

    expect(result.totalAmount).toBe(50);
    expect(result.weekendDiscount).toBeFalse();
    expect(result.promoCodeApplied).toBeFalse();
    expect(result.promoCodeDiscountAmount).toBeNull();
  });

  it('does not add fees for pickup or return outside standard hours', async () => {
    const result = await firstValueFrom(
      service.calculatePrice({
        items: [{ categoryId: 'cat-kask', amount: 1 }],
        startDate: '2024-01-01T19:00:00',
        endDate: '2024-01-02T10:00:00',
      }),
    );

    expect(result.totalAmount).toBe(25);
  });

  it('does not add fees for pickup and return on a weekend', async () => {
    const result = await firstValueFrom(
      service.calculatePrice({
        items: [{ categoryId: 'cat-kask', amount: 1 }],
        startDate: '2026-08-15T10:00:00',
        endDate: '2026-08-16T10:00:00',
      }),
    );

    expect(result.totalAmount).toBe(25);
  });

  it('applies cached promo code discount to calculated total', async () => {
    const result = await firstValueFrom(
      service.calculatePrice({
        items: [{ categoryId: 'cat-kask', amount: 2 }],
        startDate: '2024-01-01T10:00:00',
        endDate: '2024-01-02T10:00:00',
        appliedPromoCode: {
          code: 'DISCOUNT10',
          type: DiscountType.Percentage,
          value: 10,
        },
      }),
    );

    expect(result.totalAmount).toBe(45);
    expect(result.promoCodeApplied).toBeTrue();
    expect(result.promoCodeDiscountAmount).toBe(5);
  });
});
