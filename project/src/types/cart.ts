import type { Product } from './index'

export interface CartItem {
  product: Product;
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
  selectedColorHex?: string;
  selectedColorName?: string;
}