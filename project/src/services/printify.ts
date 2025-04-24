// src/services/printify.ts

/**
 * These mirror Printify’s API models.
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
 * The shape your UI expects.
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
 * Points at your Netlify Functions.
 */
const NETLIFY_FN = '/.netlify/functions';

/**
 * Fetch all of the shop’s products via your
 * `printify-products` Function.
 */
export async function fetchPrintifyProducts(): Promise<Product[]> {
  console.log('[printify.ts] fetching:', `${NETLIFY_FN}/printify-products`);
  const res = await fetch(`${NETLIFY_FN}/printify-products`);
  console.log('[printify.ts] status:', res.status);
  if (!res.ok) {
    const text = await res.text();
    console.error('[printify.ts] error body:', text);
    throw new Error(`Printify proxy error: ${res.status} ${text}`);
  }

  // Parse it — your Function returns exactly what Printify did,
  // i.e. { data: PrintifyProduct[] }
  const payload = (await res.json()) as { data: PrintifyProduct[] };
  console.log('[printify.ts] got payload.data length =', payload.data.length);

  return payload.data.map((p) => {
    const defaultImage   = p.images.find((i) => i.is_default) || p.images[0];
    const activeVariant  = p.variants.find((v) => v.is_enabled) || p.variants[0];
    const categoryTag    = p.tags?.[0]?.toLowerCase() || 'classics';

    return {
      id:          p.id,
      name:        p.title,
      description: p.description || 'Vintage Bollywood T-Shirt',
      price:       activeVariant?.price ?? 29.99,
      image:       defaultImage?.src ?? '/placeholder.jpg',
      category:    categoryTag,
    };
  });
}
