import { DiscountType } from '../../models/promo-code.model';
import { mapPromoCodeDetails } from './promo-code.mapper';

describe('mapPromoCodeDetails', () => {
  it('maps camelCase API response', () => {
    const result = mapPromoCodeDetails({
      code: 'discount10',
      type: 'Percentage',
      value: 10,
    });

    expect(result).toEqual({
      code: 'DISCOUNT10',
      type: DiscountType.Percentage,
      value: 10,
    });
  });

  it('maps PascalCase API response', () => {
    const result = mapPromoCodeDetails({
      Code: 'DISCOUNT10',
      Type: 'Percentage',
      Value: 10,
    });

    expect(result).toEqual({
      code: 'DISCOUNT10',
      type: DiscountType.Percentage,
      value: 10,
    });
  });

  it('returns null for unsupported response', () => {
    expect(mapPromoCodeDetails({ code: 'SHORT' })).toBeNull();
  });
});
