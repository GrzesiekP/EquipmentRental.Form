import { EquipmentCategory } from '../services/settings.service';
import { CalculatePriceResponse } from './price-calculation.model';

export interface EquipmentQuantityState {
  displayName: string;
  category: EquipmentCategory | null;
  quantity: number;
}

export interface RentalFormState {
  equipmentQuantities: EquipmentQuantityState[];
  pickupDate: Date | null;
  pickupTime: string | null;
  returnDate: Date | null;
  returnTime: string | null;
  priceResult: CalculatePriceResponse | null;
}
