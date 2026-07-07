import { PromoCodeDetails } from './promo-code.model';

export interface PriceCalculationItem {
  categoryId: string;
  amount: number;
}

export interface CalculatePriceRequest {
  items: PriceCalculationItem[];
  startDate: string;
  endDate: string;
  appliedPromoCode?: PromoCodeDetails | null;
}

export interface CalculatePriceResponse {
  totalAmount: number;
  startExtraFee: number;
  endExtraFee: number;
  weekendDiscount: boolean;
  promoCodeApplied: boolean;
  promoCodeDiscountAmount: number | null;
}
