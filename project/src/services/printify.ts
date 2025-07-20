import { Product } from '../types';

const API_URL = '/.netlify/functions/printify-products';

// Color mapping for Printify hex codes to Gildan color names
export const COLOR_NAME_TO_HEX: Record<string, string> = {
  'black': '#000000',
  'white': '#FFFFFF',
  'gray': '#808080',
  'grey': '#808080',
  'red': '#FF0000',
  'blue': '#0000FF',
  'navy': '#000080',
  'green': '#008000',
  'yellow': '#FFFF00',
  'orange': '#FFA500',
  'purple': '#800080',
  'pink': '#FFC0CB',
  'brown': '#964B00',
  'beige': '#F5F5DC',
  'tan': '#D2B48C',
  'maroon': '#800000',
  'olive': '#808000',
  'lime': '#00FF00',
  'aqua': '#00FFFF',
  'teal': '#008080',
  'silver': '#C0C0C0',
  'gold': '#FFD700',
  'coral': '#FF7F50',
  'salmon': '#FA8072',
  'khaki': '#F0E68C',
  'crimson': '#DC143C',
  'fuchsia': '#FF00FF',
  'magenta': '#FF00FF',
  'indigo': '#4B0082',
  'turquoise': '#40E0D0',
  'chocolate': '#D2691E',
  'charcoal': '#36454F',
  'heather': '#9D9D9D',
  'burgundy': '#800020',
  'lavender': '#E6E6FA',
  'mint': '#3EB489',
  'rose': '#FF007F',
  'sand': '#C2B280',
  'sky': '#87CEEB',
  'steel': '#4682B4',
  'stone': '#918A84',
  'wine': '#722F37'
};

// Add the missing hexToColorName function
export function hexToColorName(hex: string): string {
  // Normalize the hex code
  const normalizedHex = hex.toUpperCase()
  
  // Find the color name by hex value
  for (const [name, hexValue] of Object.entries(COLOR_NAME_TO_HEX)) {
    if (hexValue.toUpperCase() === normalizedHex) {
      return name.charAt(0).toUpperCase() + name.slice(1)
    }
  }
  
  // Return the hex if no name match found
  return hex
}

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