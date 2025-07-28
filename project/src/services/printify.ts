import { Product } from '../types';
import { COLOR_NAME_TO_HEX, getColorNameFromHex } from '../constants/productConstants';

const API_URL = '/.netlify/functions/printify-products';

// Use getColorNameFromHex from productConstants for all color name lookups
export { getColorNameFromHex };

export async function fetchPrintifyProducts(): Promise<Product[]> {
  try {
    const response = await fetch(API_URL)
    
    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }
    
    const data = await response.json()
    
    // The Netlify function already returns properly structured data
    return data.products || []
  } catch (error) {
    console.error('Error fetching Printify products:', error)
    return []
  }
}

// Helper function to extract size from variant title
export function extractSizeFromTitle(title: string): string | undefined {
  const sizeMatch = title.match(/\b(XS|S|M|L|XL|XXL|2XL|3XL|4XL|5XL)\b/i);
  if (!sizeMatch) return undefined;
  
  const size = sizeMatch[1].toUpperCase();
  
  // Normalize size naming to match UI conventions
  if (size === 'XXL') return '2XL';
  
  return size;
}

// Helper function to extract color from variant title
export function extractColorFromTitle(title: string): string | undefined {
  const colorNames = Object.keys(COLOR_NAME_TO_HEX);
  const lowerTitle = title.toLowerCase();
  return colorNames.find(color => lowerTitle.includes(color.toLowerCase()));
}

// Normalize image URL to a consistent format
export function normalizeImageUrl(image: any): string {
  if (!image) return '/assets/logo_big.png'
  
  // If it's already a string URL, return it
  if (typeof image === 'string') {
    return image
  }
  
  // If it's an object with src property
  if (image && typeof image === 'object' && image.src) {
    return image.src
  }
  
  // If it's an object with url property
  if (image && typeof image === 'object' && image.url) {
    return image.url
  }
  
  // Fallback
  console.warn('Could not normalize image:', image)
  return '/assets/logo_big.png'
}