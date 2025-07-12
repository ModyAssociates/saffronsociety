// project/src/data/products.ts
// Updated to remove mock data fallback entirely, forcing real API data.
// Added error handling in components instead.

import type { Product } from '../services/printify'
import { fetchPrintifyProducts } from '../services/printify'

export async function fetchProducts(): Promise<Product[]> {
  console.log('[products.ts] Fetching products from Printify API...')
  const products = await fetchPrintifyProducts()
  
  if (!Array.isArray(products) || products.length === 0) {
    console.error('[products.ts] No products returned from API')
    return []
  }
  
  console.log(`[products.ts] Successfully fetched ${products.length} products from API`)
  return products
}

export async function getFeaturedProducts(n = 4): Promise<Product[]> {
  const all = await fetchProducts()
  return all.slice(0, n)
}