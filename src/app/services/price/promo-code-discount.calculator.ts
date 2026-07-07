import { DiscountType, PromoCodeDetails } from '../../models/promo-code.model';

export interface PromoDiscountResult {
  totalAmount: number;
  promoCodeApplied: boolean;
  promoCodeDiscountAmount: number | null;
}

export function applyPromoCodeDiscount(
  totalAmount: number,
  promoCode: PromoCodeDetails | null | undefined,
): PromoDiscountResult {
  if (!promoCode) {
    return {
      totalAmount,
      promoCodeApplied: false,
      promoCodeDiscountAmount: null,
    };
  }

  let newAmount: number;
  let discountAmount: number | null;

  switch (promoCode.type) {
    case DiscountType.Percentage:
      newAmount = totalAmount * (1 - promoCode.value / 100);
      discountAmount = roundCurrency(totalAmount - newAmount);
      newAmount = roundCurrency(newAmount);
      break;
    case DiscountType.FixedPrice:
      newAmount = promoCode.value;
      discountAmount = null;
      break;
    case DiscountType.FixedDiscount:
      newAmount = totalAmount - promoCode.value;
      discountAmount = promoCode.value;
      break;
    default:
      return {
        totalAmount,
        promoCodeApplied: false,
        promoCodeDiscountAmount: null,
      };
  }

  if (newAmount <= 0) {
    return {
      totalAmount,
      promoCodeApplied: false,
      promoCodeDiscountAmount: null,
    };
  }

  return {
    totalAmount: newAmount,
    promoCodeApplied: true,
    promoCodeDiscountAmount: discountAmount,
  };
}

function roundCurrency(amount: number): number {
  return Math.round(amount * 100) / 100;
}
