// src/data/products.ts

import type { Product } from '../services/printify.ts';
import { fetchPrintifyProducts } from '../services/printify.ts';

/**
 * Load all products (from Printify).
 */
export async function fetchProducts(): Promise<Product[]> {
  console.log('[products.ts] fetchProducts() start');
  try {
    const products = await fetchPrintifyProducts();
    console.log('[products.ts] fetchProducts() got', products.length, 'items');
    return products;
  } catch (error) {
    console.error('[products.ts] fetchProducts() error:', error);
    // Fallback to an empty array (or local mock data if you like)
    return [];
  }
}

/**
 * Return the first N as “featured.”
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await fetchProducts();
  return all.slice(0, 4);
}
