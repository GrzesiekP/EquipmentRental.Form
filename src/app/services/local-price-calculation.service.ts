import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CalculatePriceRequest, CalculatePriceResponse } from '../models/price-calculation.model';
import { IPriceCalculationService } from './price-calculation.token';

@Injectable()
export class LocalPriceCalculationService implements IPriceCalculationService {
  calculatePrice(_request: CalculatePriceRequest): Observable<CalculatePriceResponse> {
    const response: CalculatePriceResponse = {
      totalAmount: 100,
      startExtraFee: 0,
      endExtraFee: 0,
      weekendDiscount: false,
    };

    return of(response);
  }
}
