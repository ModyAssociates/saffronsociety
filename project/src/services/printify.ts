// project/src/services/printify.ts

/**
 * Mirror of Printify’s API Product model.
 */
interface PrintifyImage { src: string; is_default: boolean }
interface PrintifyVariant { id: number; price: number; is_enabled: boolean }
interface PrintifyProduct {
  id: string
  title: string
  description: string
  images: PrintifyImage[]
  variants: PrintifyVariant[]
  tags: string[]
}

/** What our UI needs. */
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

const NETLIFY_FN = '/.netlify/functions'

/** Strip all HTML tags and collapse whitespace */
function stripHtml(html: string): string {
  return html
    .replace(/<\/?[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Fetch via our Netlify function and map to Product[],
 * using the lowest enabled variant price.
 */
export async function fetchPrintifyProducts(): Promise<Product[]> {
  const res = await fetch(`${NETLIFY_FN}/printify-products`)
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Printify proxy error: ${res.status} ${err}`)
  }
  const { data } = (await res.json()) as { data: PrintifyProduct[] }

  return data.map((p) => {
    // pick the default image
    const defaultImage = p.images.find((i) => i.is_default) || p.images[0]
    const category     = p.tags?.[0]?.toLowerCase() || 'classics'

    // strip HTML description
    const description = p.description
      ? stripHtml(p.description)
      : 'Vintage Bollywood T-Shirt'

    // gather prices from enabled variants (or all if none enabled)
    const relevantVariants = p.variants.filter((v) => v.is_enabled)
    const pricesToConsider = (relevantVariants.length > 0
      ? relevantVariants
      : p.variants
    ).map((v) => Number(v.price))

    // pick the lowest
    const price = pricesToConsider.length > 0
      ? Math.min(...pricesToConsider)
      : 29.99

    return {
      id:          p.id,
      name:        p.title,
      description,
      price,
      image:       defaultImage.src,
      category,
    }
  })
}
