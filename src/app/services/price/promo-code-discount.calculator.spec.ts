import { DiscountType } from '../../models/promo-code.model';
import { applyPromoCodeDiscount } from './promo-code-discount.calculator';

describe('applyPromoCodeDiscount', () => {
  it('returns unchanged amount when promo code is not provided', () => {
    const result = applyPromoCodeDiscount(100, null);

    expect(result.totalAmount).toBe(100);
    expect(result.promoCodeApplied).toBeFalse();
    expect(result.promoCodeDiscountAmount).toBeNull();
  });

  it('applies percentage discount to final amount', () => {
    const result = applyPromoCodeDiscount(100, {
      code: 'DISCOUNT10',
      type: DiscountType.Percentage,
      value: 10,
    });

    expect(result.totalAmount).toBe(90);
    expect(result.promoCodeApplied).toBeTrue();
    expect(result.promoCodeDiscountAmount).toBe(10);
  });

  it('applies fixed price discount', () => {
    const result = applyPromoCodeDiscount(250, {
      code: 'FIXED500PL',
      type: DiscountType.FixedPrice,
      value: 500,
    });

    expect(result.totalAmount).toBe(500);
    expect(result.promoCodeApplied).toBeTrue();
    expect(result.promoCodeDiscountAmount).toBeNull();
  });

  it('applies fixed discount amount', () => {
    const result = applyPromoCodeDiscount(60, {
      code: 'MINUS10PLN',
      type: DiscountType.FixedDiscount,
      value: 10,
    });

    expect(result.totalAmount).toBe(50);
    expect(result.promoCodeApplied).toBeTrue();
    expect(result.promoCodeDiscountAmount).toBe(10);
  });

  it('ignores promo code when discounted amount would be zero or less', () => {
    const result = applyPromoCodeDiscount(10, {
      code: 'MINUS10PLN',
      type: DiscountType.FixedDiscount,
      value: 10,
    });

    expect(result.totalAmount).toBe(10);
    expect(result.promoCodeApplied).toBeFalse();
    expect(result.promoCodeDiscountAmount).toBeNull();
  });
});
