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
  description: string;  // plain-text now
  price: number;
  image: string;
  category: string;
}

/**
 * Points at your Netlify Functions.
 */
const NETLIFY_FN = '/.netlify/functions';

/**
 * Utility: strip HTML tags from a string.
 */
function stripHtml(html: string): string {
  return html.replace(/<\/?[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Fetch all of the shop’s products via your
 * `printify-products` Function, then map → Product.
 */
export async function fetchPrintifyProducts(): Promise<Product[]> {
  const res = await fetch(`${NETLIFY_FN}/printify-products`);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Printify proxy error: ${res.status} ${err}`);
  }
  const payload = (await res.json()) as { data: PrintifyProduct[] };

  return payload.data.map((p) => {
    const defaultImage  = p.images.find((i) => i.is_default) || p.images[0];
    const activeVariant = p.variants.find((v) => v.is_enabled) || p.variants[0];
    const category      = p.tags?.[0]?.toLowerCase() || 'classics';

    // strip tags, collapse whitespace, fallback to a short default
    const description = p.description
      ? stripHtml(p.description)
      : 'Vintage Bollywood T-Shirt';

    // coerce to number, fallback if missing
    const price = activeVariant
      ? parseFloat(activeVariant.price.toString())
      : 29.99;

    return {
      id:          p.id,
      name:        p.title,
      description,
      price,
      image:       defaultImage.src,
      category,
    };
  });
}
