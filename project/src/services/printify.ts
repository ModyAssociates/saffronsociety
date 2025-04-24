// src/services/printify.ts

/**
 * These mirror Printify's response shapes.
 */
interface PrintifyImage {
  src: string;
  is_default: boolean;
}

interface PrintifyVariant {
  id: number;
  price: number;
  is_enabled: boolean;
}

interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  images: PrintifyImage[];
  variants: PrintifyVariant[];
  tags: string[];
}

/**
 * Your app's product shape.
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

/**
 * Netlify Function prefix.
 * Netlify will expose your two functions at:
 * /.netlify/functions/printify-shops
 * /.netlify/functions/printify-products
 */
const NETLIFY_FN = '/.netlify/functions';

/**
 * Fetches from your `printify-products` Netlify Function,
 * then maps PrintifyProduct → your Product type.
 */
export async function fetchPrintifyProducts(): Promise<Product[]> {
  const res = await fetch(`${NETLIFY_FN}/printify-products`);
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to fetch Printify products: ${errText}`);
  }

  // The Netlify function returns the same JSON as Printify:
  // { data: PrintifyProduct[] }
  const payload = (await res.json()) as { data: PrintifyProduct[] };

  return payload.data.map((p) => {
    // pick the default image (or first)
    const defaultImage = p.images.find((img) => img.is_default) || p.images[0];
    // pick an enabled variant (or first)
    const activeVariant = p.variants.find((v) => v.is_enabled) || p.variants[0];
    // use the first tag (or fallback)
    const category = p.tags?.[0]?.toLowerCase() || 'classics';

    return {
      id:          p.id,
      name:        p.title,
      description: p.description || 'Vintage Bollywood T-Shirt',
      price:       activeVariant?.price ?? 29.99,
      image:       defaultImage?.src ?? '/placeholder.jpg',
      category,
    };
  });
}
