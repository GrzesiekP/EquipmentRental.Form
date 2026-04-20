import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EquipmentQuantityState, RentalFormState } from '../models/rental-form-state.model';
import { CalculatePriceResponse } from '../models/price-calculation.model';

const initialState: RentalFormState = {
  equipmentQuantities: [],
  pickupDate: null,
  pickupTime: null,
  returnDate: null,
  returnTime: null,
  priceResult: null,
};

@Injectable({
  providedIn: 'root',
})
export class RentalFormStateService {
  private readonly _state$ = new BehaviorSubject<RentalFormState>(initialState);
  readonly state$ = this._state$.asObservable();

  get state(): RentalFormState {
    return this._state$.getValue();
  }

  updateEquipmentQuantities(quantities: EquipmentQuantityState[]): void {
    this.updateState({ equipmentQuantities: quantities });
  }

  updateDates(pickupDate: Date | null, returnDate: Date | null): void {
    this.updateState({ pickupDate, returnDate });
  }

  updateTimes(pickupTime: string | null, returnTime: string | null): void {
    this.updateState({ pickupTime, returnTime });
  }

  updatePrice(priceResult: CalculatePriceResponse | null): void {
    this.updateState({ priceResult });
  }

  private updateState(partial: Partial<RentalFormState>): void {
    const newState = { ...this._state$.getValue(), ...partial };
    this._state$.next(newState);
    console.log('[RentalFormState]', newState);
  }
}
