// project/src/services/printify.ts

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

export interface Product {
  id: string
  name: string
  description: string
  price: number      // in dollars now
  image: string
  category: string
}

const NETLIFY_FN = '/.netlify/functions'

function stripHtml(html: string): string {
  return html.replace(/<\/?[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export async function fetchPrintifyProducts(): Promise<Product[]> {
  const res = await fetch(`${NETLIFY_FN}/printify-products`)
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Printify proxy error: ${res.status} ${err}`)
  }
  const { data } = (await res.json()) as { data: PrintifyProduct[] }

  return data.map((p) => {
    const defaultImage  = p.images.find(i => i.is_default) || p.images[0]
    const category      = p.tags?.[0]?.toLowerCase() || 'classics'
    const description   = p.description ? stripHtml(p.description) : ''

    // pick enabled variants (or all), convert cents→dollars
    const variantsToUse = p.variants.filter(v => v.is_enabled).length > 0
      ? p.variants.filter(v => v.is_enabled)
      : p.variants

    const dollarPrices = variantsToUse.map(v => Number(v.price) / 100)
    const lowestPrice  = dollarPrices.length > 0
      ? Math.min(...dollarPrices)
      : 29.99

    return {
      id:          p.id,
      name:        p.title,
      description,
      price:       lowestPrice,
      image:       defaultImage.src,
      category,
    }
  })
}
