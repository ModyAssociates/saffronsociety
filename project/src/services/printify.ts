// project/src/services/printify.ts

/**
 * Printify “Shop Products” shape (what your Netlify fn returns).
 */
interface PrintifyImage {
  src: string;
  is_default: boolean;
}

interface PrintifyVariant {
  id: number;
  price: number;       // in *cents*
  is_enabled: boolean;
  option1?: string;    // (e.g. “Color”)
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
 * The shape your React UI expects.
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;       // in dollars
  image: string;
  category: string;
  colors: string[];    // hex codes for swatches
}

const NETLIFY_FN = '/.netlify/functions';

/** Strip out any HTML tags from Printify descriptions */
function stripHtml(html: string): string {
  return html
    .replace(/<\/?[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Fetches your Printify products by calling your
 * Netlify Function at /.netlify/functions/printify-products
 */
export async function fetchPrintifyProducts(): Promise<Product[]> {
  console.log('[printify.ts] calling Netlify fn…');
  const res = await fetch(`${NETLIFY_FN}/printify-products`);
  console.log('[printify.ts] fn status:', res.status);

  if (!res.ok) {
    const errText = await res.text().catch(() => '<no body>');
    console.error('[printify.ts] fn error body:', errText);
    throw new Error(`Printify proxy returned ${res.status}`);
  }

  const { data } = (await res.json()) as { data: PrintifyProduct[] };

  return data.map((p) => {
    // 1) Default image & metadata
    const defaultImg  = p.images.find((i) => i.is_default) || p.images[0];
    const category    = p.tags[0]?.toLowerCase() || 'classics';
    const description = p.description
      ? stripHtml(p.description)
      : '';

    // 2) Enabled variants (or fall back to all)
    const enabled = p.variants.filter((v) => v.is_enabled);
    const variantsToUse = enabled.length ? enabled : p.variants;

    // 3) Cents → dollars & pick the lowest
    const pricesInDollars = variantsToUse.map((v) => v.price / 100);
    const lowestPrice     = pricesInDollars.length
      ? Math.min(...pricesInDollars)
      : 0;

    // 4) Stub out colors for now (you can replace with real option1→hex mapping later)
    const colors: string[] = [];

    return {
      id:          p.id,
      name:        p.title,
      description,
      price:       lowestPrice,
      image:       defaultImg?.src ?? '',
      category,
      colors,
    };
  });
}
