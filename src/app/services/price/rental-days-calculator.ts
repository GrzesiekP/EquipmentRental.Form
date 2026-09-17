import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface RentalPeriodApiResponse {
  rentalDays: number;
  weekendDiscountApplied: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class RentalDaysCalculator {
  private readonly http = inject(HttpClient);

  calculateRentalDays(
    start: Date,
    end: Date,
  ): Observable<{ rentalDays: number; weekendDiscount: boolean }> {
    return this.http
      .get<RentalPeriodApiResponse>(environment.rentalPeriodCalculatorUrl, {
        params: {
          PickupDate: toLocalIsoDate(start),
          ReturnDate: toLocalIsoDate(end),
        },
      })
      .pipe(
        map(response => ({
          rentalDays: response.rentalDays,
          weekendDiscount: response.weekendDiscountApplied,
        })),
      );
  }
}

function toLocalIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
