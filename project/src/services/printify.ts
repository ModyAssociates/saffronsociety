import { Product } from '../types';

const API_URL = '/.netlify/functions/printify-products';

// Color mapping for Printify hex codes to Gildan color names
export const COLOR_NAME_TO_HEX: Record<string, string> = {
  "#000000": "#25282A",  // Black
  "#DCD2BE": "#D7D2CB",  // Ice Grey
  "#642838": "#5B2B42",  // Maroon
  "#31221D": "#382F2D",  // Dark Chocolate
  "#005C70": "#005D6F",  // Galapagos Blue
  "#FF8E9D": "#DD74A1",  // Azalea
  "#FFFFFF": "#FFFFFF",  // White / PFD White
  "#F7E1B0": "#F4D1A1",  // Vegas Gold
  "#FFF6E3": "#FFFFFF",  // White / PFD White
  "#223B26": "#273B33",  // Forest
  "#454545": "#333F48",  // Heather Navy
  "#274D91": "#224D8F",  // Royal
  "#1A2237": "#263147",  // Navy
  "#A82235": "#AC2B37",  // Cherry Red
  "#B54557": "#B15533",  // Texas Orange
  "#F6F6F6": "#FFFFFF",  // White / PFD White
  "#D3D590": "#F4D1A1",  // Vegas Gold (closest)
  "#6A798E": "#4D6995",  // Heather Indigo
  "Black": "#000000",
  "White": "#FFFFFF",
  "Navy": "#1A2237",
  "Red": "#A82235",
  "Maroon": "#642838",
  "Forest": "#223B26",
  "Royal": "#274D91"
};

export async function fetchPrintifyProducts(): Promise<Product[]> {
  try {
    console.log('[printify.ts] Fetching products from:', API_URL);
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      console.error('[printify.ts] Failed to fetch products:', response.status, response.statusText);
      return [];
    }
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('[printify.ts] Response is not JSON:', contentType);
      const text = await response.text();
      console.error('[printify.ts] Response text:', text.substring(0, 100));
      return [];
    }
    
    const data = await response.json();
    console.log('[printify.ts] Raw response:', data);
    
    // Ensure we have an array
    const products = Array.isArray(data) ? data : [];
    
    if (products.length === 0) {
      console.log('[printify.ts] No products in response');
      return [];
    }
    
    // Transform Printify products to our Product type
    return products.map((item: any) => {
      const images = Array.isArray(item.images) 
        ? item.images.filter(Boolean) 
        : [item.image].filter(Boolean);
      
      const colors = Array.isArray(item.colors) 
        ? item.colors 
        : [];
      
      const price = typeof item.price === 'number' ? item.price : 29.99;
      const mainImage = images[0] || '/src/assets/logo_big.png';
      
      return {
        id: item.id || String(Math.random()),
        name: item.title || item.name || 'Untitled Product',
        price: price,
        image: mainImage,
        images: images.length > 0 ? images : [mainImage],
        colors: colors,
        description: item.description || '',
        category: item.category || 'T-Shirts'
      };
    });
  } catch (error) {
    console.error('[printify.ts] Error fetching Printify products:', error);
    return [];
  }
}

// Helper function to extract color name from hex
export function hexToColorName(hex: string): string {
  const entry = Object.entries(COLOR_NAME_TO_HEX).find(([_, value]) => 
    value.toLowerCase() === hex.toLowerCase()
  );
  return entry ? entry[0] : hex;
}

// Helper function to validate hex color
export function isValidHex(color: string): boolean {
  return /^#([0-9A-F]{3}){1,2}$/i.test(color);
}