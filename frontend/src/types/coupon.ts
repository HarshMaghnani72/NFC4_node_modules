export interface Coupon {
  id: number;
  name: string;
  description: string;
  brand: string;
  value: string;
  image?: string;
  redeemed: boolean;
  expiryDate?: string;
  redeemedDate?: string;
}