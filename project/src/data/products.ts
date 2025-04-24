import { Product } from '../types';
import { fetchPrintifyProducts } from '../services/printify';

// Fallback products in case the API fails
const fallbackProducts: Product[] = [
  {
    id: '1',
    name: 'Sholay Gabbar T-Shirt',
    description: 'Iconic "Kitne Aadmi The?" design featuring the legendary Gabbar Singh',
    price: 29.99,
    image: '/placeholder.jpg',
    category: 'classics'
  },
  // Add more fallback products if needed
];

export async function fetchProducts(): Promise<Product[]> {
  const products = await fetchPrintifyProducts();
  return products.length > 0 ? products : fallbackProducts;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await fetchProducts();
  return products.slice(0, 4);
}