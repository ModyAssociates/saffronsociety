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
  description: string  // now plain-text
  price: number
  image: string
  category: string
}

const NETLIFY_FN = '/.netlify/functions'

/** Strip all HTML tags and collapse spaces */
function stripHtml(html: string): string {
  return html
    .replace(/<\/?[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Fetch via our Netlify function and map to Product[] */
export async function fetchPrintifyProducts(): Promise<Product[]> {
  const res = await fetch(`${NETLIFY_FN}/printify-products`)
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Printify proxy error: ${res.status} ${err}`)
  }
  const { data } = (await res.json()) as { data: PrintifyProduct[] }

  return data.map((p) => {
    const defaultImage  = p.images.find((i) => i.is_default) || p.images[0]
    const activeVariant = p.variants.find((v) => v.is_enabled) || p.variants[0]
    const category      = p.tags?.[0]?.toLowerCase() || 'classics'

    // strip HTML here
    const description = p.description
      ? stripHtml(p.description)
      : 'Vintage Bollywood T-Shirt'

    const price = activeVariant
      ? parseFloat(activeVariant.price.toString())
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
