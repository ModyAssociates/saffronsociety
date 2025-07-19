// project/src/data/products.ts
// Provides fallback mock data for development and handles API errors gracefully

import type { Product } from '../types'
import { fetchPrintifyProducts } from '../services/printify'

// Fallback mock data that matches the Product interface exactly
const MOCK_PRODUCTS: Product[] = [
  {
    id: "mock-1",
    name: "Vintage Bollywood Hero Tee",
    description: "Channel the essence of classic Bollywood heroes with this vintage-inspired design featuring iconic retro typography and nostalgic color schemes.",
    price: 29.99,
    image: "/assets/male-model.png",
    category: "T-Shirts",
    tags: ["bollywood", "vintage", "hero", "retro"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#1A2237" },
      { name: "Maroon", hex: "#642838" }
    ],
    variants: [
      { id: "mock-1-s", title: "Black / S", price: 29.99, is_enabled: true },
      { id: "mock-1-m", title: "Black / M", price: 29.99, is_enabled: true },
      { id: "mock-1-l", title: "Black / L", price: 29.99, is_enabled: true }
    ]
  },
  {
    id: "mock-2", 
    name: "Classic Cinema Design",
    description: "A tribute to the golden age of Indian cinema with artistic typography and cultural motifs that celebrate timeless storytelling.",
    price: 32.99,
    image: "/assets/female-model.png",
    category: "T-Shirts",
    tags: ["cinema", "classic", "artistic", "cultural"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Royal", hex: "#274D91" },
      { name: "Forest", hex: "#223B26" }
    ],
    variants: [
      { id: "mock-2-s", title: "White / S", price: 32.99, is_enabled: true },
      { id: "mock-2-m", title: "White / M", price: 32.99, is_enabled: true }
    ]
  },
  {
    id: "mock-3",
    name: "Modern Fusion Streetwear", 
    description: "Contemporary streetwear meets traditional aesthetics in this bold design that bridges past and present with striking visual elements.",
    price: 27.99,
    image: "/assets/male-model-2.png",
    category: "T-Shirts",
    tags: ["fusion", "streetwear", "modern", "traditional"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Gray", hex: "#808080" },
      { name: "Cherry Red", hex: "#A82235" }
    ],
    variants: [
      { id: "mock-3-s", title: "Gray / S", price: 27.99, is_enabled: true },
      { id: "mock-3-m", title: "Gray / M", price: 27.99, is_enabled: true }
    ]
  },
  {
    id: "mock-4",
    name: "Retro Dialogue Design",
    description: "Featuring iconic dialogue and memorable quotes from beloved films, this design celebrates the wit and wisdom of classic cinema.",
    price: 31.99,
    image: "/assets/male-model-3.png", 
    category: "T-Shirts",
    tags: ["retro", "dialogue", "quotes", "memorable"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#1A2237" }
    ],
    variants: [
      { id: "mock-4-s", title: "Black / S", price: 31.99, is_enabled: true },
      { id: "mock-4-m", title: "Black / M", price: 31.99, is_enabled: true }
    ]
  }
];

export async function fetchProducts(): Promise<Product[]> {
  console.log('[products.ts] Fetching products from Printify API...')
  
  try {
    const products = await fetchPrintifyProducts()
    
    if (!Array.isArray(products) || products.length === 0) {
      console.log('[products.ts] No products returned from API, using fallback mock data')
      return MOCK_PRODUCTS
    }
    
    console.log(`[products.ts] Successfully fetched ${products.length} products from API`)
    return products
    
  } catch (error) {
    console.error('[products.ts] Error fetching from API, using fallback mock data:', error)
    return MOCK_PRODUCTS
  }
}

export async function getFeaturedProducts(n = 4): Promise<Product[]> {
  const all = await fetchProducts()
  return all.slice(0, n)
}