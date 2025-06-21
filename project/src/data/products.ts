// src/data/products.ts

import type { Product } from '../services/printify'
import { fetchPrintifyProducts } from '../services/printify'

/**
 * Load all products (from Printify).
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const products = await fetchPrintifyProducts()
    if (!Array.isArray(products)) {
      console.error('[products.ts] fetchProducts() error: products is not an array', products)
      return []
    }
    // You can sort or filter products here if needed
    return products
  } catch (error) {
    console.error('[products.ts] fetchProducts() error:', error)
    // Fallback to an empty array (or local mock data if you like)
    return []
  }
}

/**
 * Return the first N as “featured.”
 * Optionally, you can sort or filter for featured/sale items here.
 */
export async function getFeaturedProducts(n = 4): Promise<Product[]> {
  const all = await fetchProducts()
  // You can sort or filter here if needed for your homepage display
  return all.slice(0, n)
}
