export interface PriceCalculationItem {
  category: string;
  amount: number;
}

export interface CalculatePriceRequest {
  items: PriceCalculationItem[];
  startDate: string;
  endDate: string;
}

export interface CalculatePriceResponse {
  totalAmount: number;
  startExtraFee: number;
  endExtraFee: number;
  weekendDiscount: boolean;
}
