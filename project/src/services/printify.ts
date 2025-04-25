// src/services/printify.ts
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
  price: number
  image: string
  category: string
}

const NETLIFY_FN = '/.netlify/functions'

function stripHtml(html: string): string {
  return html.replace(/<\/?[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export async function fetchPrintifyProducts(): Promise<Product[]> {
  const res = await fetch(`${NETLIFY_FN}/printify-products`)
  if (!res.ok) throw new Error(await res.text())

  const { data } = (await res.json()) as { data: PrintifyProduct[] }

  return data.map((p) => {
    const defaultImage  = p.images.find((i) => i.is_default) || p.images[0]
    const activeVariant = p.variants.find((v) => v.is_enabled) || p.variants[0]
    const category      = p.tags?.[0]?.toLowerCase() || 'classics'

    const description = p.description
      ? stripHtml(p.description)
      : 'Vintage Bollywood T-Shirt'

    console.log('📝 stripped description:', description)

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
