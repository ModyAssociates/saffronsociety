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
    return products
  } catch (error) {
    console.error('[products.ts] fetchProducts() error:', error)
    // Fallback to an empty array (or local mock data if you like)
    return []
  }
}

/**
 * Return the first N as “featured.”
 */
export async function getFeaturedProducts(n = 4): Promise<Product[]> {
  const all = await fetchProducts()
  return all.slice(0, n)
}
