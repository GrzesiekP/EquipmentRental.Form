import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { CalculatePriceRequest, CalculatePriceResponse } from '../models/price-calculation.model';

export interface IPriceCalculationService {
  calculatePrice(request: CalculatePriceRequest): Observable<CalculatePriceResponse>;
}

export const PRICE_CALCULATION_SERVICE = new InjectionToken<IPriceCalculationService>(
  'PRICE_CALCULATION_SERVICE',
);
