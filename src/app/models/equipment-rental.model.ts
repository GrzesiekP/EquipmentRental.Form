export interface EquipmentItem {
  type: string;
  quantity: number;
  comments: string | null;
}

export interface RentalFormData {
  submitDate: string;
  name: string;
  surname: string;
  peselOrdId: string;
  phone: string;
  email: string;
  address: string;
  pickupDate: string;
  returnDate: string;
  pickupHour: string;
  returnHour: string;
  equipment: EquipmentItem[];
  promoCode: string | null;
}
