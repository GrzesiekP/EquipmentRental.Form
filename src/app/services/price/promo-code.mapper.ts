import { DiscountType, PromoCodeDetails } from '../../models/promo-code.model';

const discountTypeByName: Record<string, DiscountType> = {
  Percentage: DiscountType.Percentage,
  FixedPrice: DiscountType.FixedPrice,
  FixedDiscount: DiscountType.FixedDiscount,
};

export function mapPromoCodeDetails(raw: unknown): PromoCodeDetails | null {
  if (typeof raw !== 'object' || raw === null) {
    return null;
  }

  const record = raw as Record<string, unknown>;
  const codeValue = record['code'] ?? record['Code'];
  const typeValue = record['type'] ?? record['Type'];
  const valueRaw = record['value'] ?? record['Value'];

  if (typeof codeValue !== 'string' || codeValue.trim() === '') {
    return null;
  }

  const type = mapDiscountType(typeValue);
  if (!type) {
    return null;
  }

  const value = Number(valueRaw);
  if (Number.isNaN(value)) {
    return null;
  }

  return {
    code: codeValue.trim().toUpperCase(),
    type,
    value,
  };
}

function mapDiscountType(typeValue: unknown): DiscountType | null {
  if (typeof typeValue === 'string') {
    return discountTypeByName[typeValue] ?? null;
  }

  if (typeof typeValue === 'number') {
    return Object.values(DiscountType)[typeValue] ?? null;
  }

  return null;
}
