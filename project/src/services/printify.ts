// project/src/services/printify.ts
// Updated with fallback color extraction from variant titles if no dedicated color option.

const NETLIFY_FN = '/.netlify/functions'

interface PrintifyImage {
  src: string
  is_default: boolean
}

interface PrintifyVariant {
  id: number
  price: number       // in cents
  is_enabled: boolean
  title: string       // e.g., "Black / S"
  options: number[]   // Array of option value IDs
}

interface PrintifyOptionValue {
  id: number
  title: string
  colors?: string[]   // Hex colors
}

interface PrintifyOption {
  type: string
  values: PrintifyOptionValue[]
}

interface PrintifyProduct {
  id: string
  title: string
  description: string
  images: PrintifyImage[]
  variants: PrintifyVariant[]
  tags: string[]
  options: PrintifyOption[]
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  colors?: string[] // Hex colors from enabled variants
}

function stripHtml(html: string): string {
  return html.replace(/<\/?[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function isValidHex(color: string): boolean {
  return /^#([0-9A-F]{3}){1,2}$/i.test(color)
}

function unique(array: string[]): string[] {
  return [...new Set(array)]
}

const COLOR_NAME_TO_HEX: Record<string, string> = {
  // Your full color map here (as before, omitted for brevity)
  "Black": "#000000",
  "White": "#FFFFFF",
  // ... add all others from your original code
};

export async function fetchPrintifyProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${NETLIFY_FN}/printify-products`)
    if (!res.ok) throw new Error(`Proxy error ${res.status}`)
    const { data } = (await res.json()) as { data: PrintifyProduct[] }

    if (!Array.isArray(data)) {
      console.error('[printify.ts] fetchPrintifyProducts: data is not an array', data)
      return []
    }

    return data.map((p) => {
      // Images
      const allImages = Array.isArray(p.images) 
        ? p.images.map((i) => i.src).filter((src) => typeof src === 'string' && src.startsWith('http'))
        : []

      // Category
      const category = Array.isArray(p.tags) && p.tags[0] ? p.tags[0].toLowerCase() : 't-shirts'

      // Description
      const description = p.description ? stripHtml(p.description) : ''

      // Enabled variants
      const enabledVariants = Array.isArray(p.variants) ? p.variants.filter((v) => v.is_enabled) : []

      // Price
      const variantsToUse = enabledVariants.length ? enabledVariants : (Array.isArray(p.variants) ? p.variants : [])
      const dollarPrices = variantsToUse.map((v) => v.price / 100).filter((price) => price > 0)
      const price = dollarPrices.length ? Math.min(...dollarPrices) : 0

      // Colors: Primary extraction from options
      let colors: string[] = []
      const colorOptionIndex = Array.isArray(p.options) ? p.options.findIndex((opt) => opt.type === 'color' || opt.name.toLowerCase().includes('color')) : -1 // Flexible for name variations
      if (colorOptionIndex !== -1) {
        const colorOption = p.options[colorOptionIndex]
        const usedColorValueIds = new Set(enabledVariants.map((v) => v.options[colorOptionIndex]))
        colors = colorOption.values
          .filter((val) => usedColorValueIds.has(val.id))
          .flatMap((val) => val.colors || [])
          .filter((c): c is string => typeof c === 'string' && isValidHex(c))
        colors = unique(colors)
      }

      // Fallback: If no colors from options, extract from variant titles and map to hex
      if (colors.length === 0) {
        const variantColorNames = unique(
          enabledVariants
            .map((v) => v.title.split(' / ')[0]?.trim()) // e.g., "Black / S" -> "Black"
            .filter((name): name is string => !!name && COLOR_NAME_TO_HEX[name])
        )
        colors = variantColorNames.map((name) => COLOR_NAME_TO_HEX[name])
        console.log(`[printify.ts] Used fallback color extraction for "${p.title}": ${colors.length} colors from variant titles`)
      }

      console.log(`[printify.ts] Processed product "${p.title}": ${colors.length} available colors found`)

      return {
        id: p.id,
        name: p.title,
        description,
        price,
        images: allImages.length ? allImages : ['/placeholder-product.jpg'],
        category,
        colors,
      }
    })
  } catch (error) {
    console.error('[printify.ts] Error fetching products:', error)
    return []
  }
}