// src/data/products.ts

import type { Product } from '../services/printify'
import { fetchPrintifyProducts } from '../services/printify'

// Mock data for testing when API is not available
const mockProducts: Product[] = [
  {
    id: 'mock-1',
    name: 'Classic T-Shirt',
    description: 'A comfortable cotton t-shirt perfect for everyday wear.',
    price: 25.99,
    images: [
      'https://via.placeholder.com/400x500/000000/FFFFFF?text=Black+Shirt',
      'https://via.placeholder.com/400x500/FFFFFF/000000?text=White+Shirt'
    ],
    category: 'apparel',
    colors: ['#000000', '#FFFFFF', '#3490DC', '#E3342F', '#38A169']
  },
  {
    id: 'mock-2',
    name: 'Premium Hoodie',
    description: 'Soft and warm hoodie made from premium materials.',
    price: 49.99,
    images: [
      'https://via.placeholder.com/400x500/9E9E9E/FFFFFF?text=Grey+Hoodie',
      'https://via.placeholder.com/400x500/1A2E5F/FFFFFF?text=Navy+Hoodie'
    ],
    category: 'apparel',
    colors: ['#9E9E9E', '#1A2E5F', '#000000', '#800000']
  },
  {
    id: 'mock-3',
    name: 'Vintage Tee',
    description: 'Retro style t-shirt with vintage wash.',
    price: 29.99,
    images: [
      'https://via.placeholder.com/400x500/8D5524/FFFFFF?text=Brown+Tee',
      'https://via.placeholder.com/400x500/808000/FFFFFF?text=Olive+Tee'
    ],
    category: 'apparel',
    colors: ['#8D5524', '#808000', '#36454F', '#F6AD55']
  },
  {
    id: 'mock-4',
    name: 'Sport Tank',
    description: 'Breathable tank top perfect for workouts.',
    price: 19.99,
    images: [
      'https://via.placeholder.com/400x500/ED64A6/FFFFFF?text=Pink+Tank',
      'https://via.placeholder.com/400x500/ECC94B/000000?text=Yellow+Tank'
    ],
    category: 'apparel',
    colors: ['#ED64A6', '#ECC94B', '#40E0D0', '#98FF98']
  }
];

/**
 * Load all products (from Printify).
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    console.log('[products.ts] Fetching products from Printify API...')
    const products = await fetchPrintifyProducts()
    
    if (!Array.isArray(products)) {
      console.error('[products.ts] fetchProducts() error: products is not an array', products)
      console.log('[products.ts] Using mock data instead')
      return mockProducts
    }
    
    console.log(`[products.ts] Successfully fetched ${products.length} products from API`)
    
    // If API returned products, use them
    if (products.length > 0) {
      console.log('[products.ts] Using real products from Printify API')
      return products
    }
    
    // Only use mock data if API returned empty array
    console.log('[products.ts] API returned empty array, using mock data')
    return mockProducts
    
  } catch (error) {
    console.error('[products.ts] fetchProducts() error:', error)
    console.log('[products.ts] Using mock data as fallback due to API error')
    return mockProducts
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
