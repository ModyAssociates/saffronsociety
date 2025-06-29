// project/src/services/printify.ts

const NETLIFY_FN = '/.netlify/functions'

interface PrintifyImage {
  src: string
  is_default: boolean
}

interface PrintifyVariant {
  id: number
  price: number       // in cents
  is_enabled: boolean
  option1?: string    // typically the “Color” name
}

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
  images: string[]
  category: string
  colors?: string[]
  // Do NOT include selectedColor here; it should be in CartItem only
}

function stripHtml(html: string): string {
  return html.replace(/<\/?[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

const COLOR_NAME_TO_HEX: Record<string, string> = {
  Black: "#222222",
  White: "#FFFFFF",
  Navy: "#1A2E5F",
  Red: "#E3342F",
  Blue: "#3490DC",
  Green: "#38A169",
  Gray: "#A0AEC0",
  Grey: "#A0AEC0",
  Pink: "#ED64A6",
  Yellow: "#ECC94B",
  Orange: "#F6AD55",
  Purple: "#9F7AEA",
  Brown: "#8D5524",
  // Add more as needed
};


export async function fetchPrintifyProducts(): Promise<Product[]> {
  const res = await fetch(`${NETLIFY_FN}/printify-products`)
  if (!res.ok) throw new Error(`Proxy error ${res.status}`)
  const { data } = (await res.json()) as { data: PrintifyProduct[] }

  if (!Array.isArray(data)) {
    console.error('[printify.ts] fetchPrintifyProducts: data is not an array', data)
    return []
  }

  return data.map((p) => {
    // 1) All image URLs
    const allImages = Array.isArray(p.images) ? p.images.map((i) => i.src) : []

    // 2) Default metadata
    const category    = Array.isArray(p.tags) && p.tags[0] ? p.tags[0].toLowerCase() : 'classics'
    const description = p.description ? stripHtml(p.description) : ''

    // 3) Price logic (enabled variants → dollars → lowest)
    const enabled = Array.isArray(p.variants) ? p.variants.filter((v) => v.is_enabled) : []
    const variantsToUse = enabled.length ? enabled : (Array.isArray(p.variants) ? p.variants : [])
    const dollarPrices = variantsToUse.map((v) => v.price / 100)
    const price        = dollarPrices.length ? Math.min(...dollarPrices) : 0

    // 4) Color names from option1, unique
    const colorNames = Array.from(
      new Set(
        variantsToUse
          .map((v) => v.option1?.trim() || '')
          .filter((n) => n)
      )
    );

    // Map color names to hex codes for swatches
    const colorSwatches = colorNames.map(
      (name) => COLOR_NAME_TO_HEX[name] || "#CCCCCC" // fallback gray
    );

    return {
      id:          p.id,
      name:        p.title,
      description,
      price,
      images:      allImages,
      category,
      colors:      colorSwatches, // <-- now hex codes for swatches
      // Do NOT include selectedColor here
    }
  })
}
