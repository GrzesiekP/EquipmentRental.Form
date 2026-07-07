import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CalculatePriceRequest, CalculatePriceResponse } from '../models/price-calculation.model';
import { IPriceCalculationService } from './price-calculation.token';
import { SettingsService } from './settings.service';
import { isOutsideBusinessHours } from './price/business-hours.util';
import { outsideBusinessHoursFeePln } from './price/price-calculation.constants';
import { calculateRentalDays } from './price/rental-days-calculator';

import { applyPromoCodeDiscount } from './price/promo-code-discount.calculator';

@Injectable()
export class LocalPriceCalculationService implements IPriceCalculationService {
  private readonly settings = inject(SettingsService);

  calculatePrice(request: CalculatePriceRequest): Observable<CalculatePriceResponse> {
    const start = new Date(request.startDate);
    const end = new Date(request.endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return of(this.emptyResponse());
    }

    const { rentalDays, weekendDiscount } = calculateRentalDays(start, end);
    const priceByCategoryId = new Map(
      this.settings.equipmentItems.map(item => [item.id, item.pricePerDay]),
    );

    let totalEquipmentPrice = 0;
    for (const line of request.items) {
      const pricePerDay = priceByCategoryId.get(line.categoryId);
      if (pricePerDay === undefined || pricePerDay <= 0) {
        continue;
      }

      totalEquipmentPrice += pricePerDay * line.amount * rentalDays;
    }

    const startExtraFee = isOutsideBusinessHours(start) ? outsideBusinessHoursFeePln : 0;
    const endExtraFee = isOutsideBusinessHours(end) ? outsideBusinessHoursFeePln : 0;
    const subtotal = totalEquipmentPrice + startExtraFee + endExtraFee;
    const promoResult = applyPromoCodeDiscount(subtotal, request.appliedPromoCode);

    return of({
      totalAmount: promoResult.totalAmount,
      startExtraFee,
      endExtraFee,
      weekendDiscount,
      promoCodeApplied: promoResult.promoCodeApplied,
      promoCodeDiscountAmount: promoResult.promoCodeDiscountAmount,
    });
  }

  private emptyResponse(): CalculatePriceResponse {
    return {
      totalAmount: 0,
      startExtraFee: 0,
      endExtraFee: 0,
      weekendDiscount: false,
      promoCodeApplied: false,
      promoCodeDiscountAmount: null,
    };
  }
}
