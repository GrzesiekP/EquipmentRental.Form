import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalculatePriceRequest, CalculatePriceResponse } from '../models/price-calculation.model';
import { SettingsService } from './settings.service';
import { IPriceCalculationService } from './price-calculation.token';

@Injectable()
export class ApiPriceCalculationService implements IPriceCalculationService {
  private readonly http = inject(HttpClient);
  private readonly settings = inject(SettingsService);

  calculatePrice(request: CalculatePriceRequest): Observable<CalculatePriceResponse> {
    return this.http.post<CalculatePriceResponse>(`${this.settings.apiUrl}/price/calculate`, request);
  }
}
