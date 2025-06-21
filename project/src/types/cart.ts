import type { Product } from './index'

export interface CartItem extends Product {
  selectedColor?: string
  selectedSize?: string
  quantity: number
}