export enum DiscountType {
  Percentage = 'Percentage',
  FixedPrice = 'FixedPrice',
  FixedDiscount = 'FixedDiscount',
}

export interface PromoCodeDetails {
  code: string;
  type: DiscountType;
  value: number;
}
