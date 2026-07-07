export interface PriceCalculationItem {
  categoryId: string;
  amount: number;
}

export interface CalculatePriceRequest {
  items: PriceCalculationItem[];
  startDate: string;
  endDate: string;
  PromoCode?: string;
}

export interface CalculatePriceResponse {
  totalAmount: number;
  startExtraFee: number;
  endExtraFee: number;
  weekendDiscount: boolean;
}
