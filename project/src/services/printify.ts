// project/src/services/printify.ts

/**
 * Mirror of Printify’s API models for a shop’s products.
 */
const API_URL = 'https://api.printify.com/v1'
const PRINTIFY_API_TOKEN = process.env.PRINTIFY_API_TOKEN!
const PRINTIFY_SHOP_ID   = process.env.PRINTIFY_SHOP_ID!

interface PrintifyImage {
  src: string
  is_default: boolean
}

interface PrintifyVariant {
  id: number
  price: number    // price in cents
  is_enabled: boolean
  option1?: string // often color, if available
}

interface PrintifyProduct {
  id: string
  title: string
  description: string
  images: PrintifyImage[]
  variants: PrintifyVariant[]
  tags: string[]
}

/**
 * The shape your UI expects.
 */
export interface Product {
  id: string
  name: string
  description: string
  price: number       // in dollars
  image: string
  category: string
  colors: string[]    // hex codes for swatches
}

const headers = {
  Authorization: `Bearer ${PRINTIFY_API_TOKEN}`,
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

/** Strip HTML tags from the Printify description */
function stripHtml(html: string): string {
  return html.replace(/<\/?[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

/**
 * Fetch products via Printify’s API and map to our UI model.
 */
export async function fetchPrintifyProducts(): Promise<Product[]> {
  // 1) Fetch the shop’s product list
  const listRes = await fetch(
    `${API_URL}/shops/${PRINTIFY_SHOP_ID}/products.json`,
    { headers }
  )
  if (!listRes.ok) {
    const err = await listRes.text()
    throw new Error(`Printify list error: ${listRes.status} ${err}`)
  }
  const { data } = (await listRes.json()) as { data: PrintifyProduct[] }

  return data.map((p) => {
    // pick a default image
    const defaultImg = p.images.find((i) => i.is_default) || p.images[0]
    const category   = p.tags[0]?.toLowerCase() || 'classics'
    const desc       = p.description
      ? stripHtml(p.description)
      : 'Vintage Bollywood T-Shirt'

    // collect all enabled-variant prices (in dollars)
    const enabled = p.variants.filter((v) => v.is_enabled)
    const prices  = (enabled.length ? enabled : p.variants)
      .map((v) => Number(v.price) / 100)
    const price   = prices.length ? Math.min(...prices) : 29.99

    // stub colors array (you can replace this with real variant.option1→hex mapping)
    const colors: string[] = []

    return {
      id:          p.id,
      name:        p.title,
      description: desc,
      price,
      image:       defaultImg.src,
      category,
      colors,
    }
  })
}
