import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { EquipmentCategory, EquipmentSetting, SettingsService } from './settings.service';
import { LocalPriceCalculationService } from './local-price-calculation.service';
import { outsideBusinessHoursFeePln } from './price/price-calculation.constants';

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
    expect(result.startExtraFee).toBe(0);
    expect(result.endExtraFee).toBe(0);
    expect(result.weekendDiscount).toBeFalse();
  });

  it('adds outside-hours fee per boundary that is outside 08–18', async () => {
    const result = await firstValueFrom(
      service.calculatePrice({
        items: [{ categoryId: 'cat-kask', amount: 1 }],
        startDate: '2024-01-01T19:00:00',
        endDate: '2024-01-02T10:00:00',
      }),
    );

    expect(result.startExtraFee).toBe(outsideBusinessHoursFeePln);
    expect(result.endExtraFee).toBe(0);
    expect(result.totalAmount).toBe(25 + outsideBusinessHoursFeePln);
  });
});
