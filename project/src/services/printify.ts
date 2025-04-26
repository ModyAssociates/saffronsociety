// project/src/services/printify.ts
const NETLIFY_FN = '/.netlify/functions'

interface PrintifyImage { src: string; is_default: boolean }
interface PrintifyVariant { id: number; price: number; is_enabled: boolean; option1?: string }
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
  price: number      // now in dollars
  image: string
  category: string
  colors: string[]   // hex codes
}

function stripHtml(html: string): string {
  return html.replace(/<\/?[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export async function fetchPrintifyProducts(): Promise<Product[]> {
  console.log('[printify.ts] calling netlify fn…')
  const res = await fetch(`${NETLIFY_FN}/printify-products`)
  console.log('[printify.ts] fn status:', res.status)
  if (!res.ok) {
    const err = await res.text().catch(() => '<no body>')
    console.error('[printify.ts] fn error body:', err)
    throw new Error(`Printify proxy returned ${res.status}`)
  }

  const { data } = (await res.json()) as { data: PrintifyProduct[] }

  return data.map((p) => {
    // pick default image
    const defaultImg  = p.images.find((i) => i.is_default) || p.images[0]
    const category    = p.tags[0]?.toLowerCase() || 'classics'
    const description = p.description ? stripHtml(p.description) : ''

    // choose enabled variants (or all if none enabled)
    const enabledVariants = p.variants.filter((v) => v.is_enabled)
    const variantsToUse   = enabledVariants.length ? enabledVariants : p.variants

    // convert cents→dollars and pick lowest
    const dollarPrices = variantsToUse.map((v) => v.price / 100)
    const lowestPrice  = dollarPrices.length ? Math.min(...dollarPrices) : 0

    return {
      id:          p.id,
      name:        p.title,
      description,
      price:       lowestPrice,
      image:       defaultImg.src,
      category,
      colors:      [],  // fill this in later from variant.option1→hex
    }
  })
}
