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
  option1?: string    // e.g. Size **or** Colour
  option2?: string
  option3?: string
  options?: Record<string, string> // { color: 'Black', size: 'M', … }
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
  // Basic colors
  Black: "#000000",
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
  
  // Common t-shirt colors
  "Heather Gray": "#9E9E9E",
  "Heather Grey": "#9E9E9E",
  "Dark Gray": "#4A4A4A",
  "Dark Grey": "#4A4A4A",
  "Light Gray": "#D3D3D3",
  "Light Grey": "#D3D3D3",
  "Sport Grey": "#8A8D8F",
  "Ash": "#B2BEB5",
  "Charcoal": "#36454F",
  
  // Additional colors
  "Royal Blue": "#4169E1",
  "Light Blue": "#ADD8E6",
  "Forest Green": "#228B22",
  "Kelly Green": "#4CBB17",
  "Olive": "#808000",
  "Maroon": "#800000",
  "Burgundy": "#800020",
  "Cardinal": "#C41E3A",
  "Gold": "#FFD700",
  "Silver": "#C0C0C0",
  "Tan": "#D2B48C",
  "Khaki": "#F0E68C",
  "Beige": "#F5F5DC",
  "Coral": "#FF7F50",
  "Mint": "#98FF98",
  "Lavender": "#E6E6FA",
  "Teal": "#008080",
  "Turquoise": "#40E0D0",
  
  // Printify-specific colors
  "Sand": "#D2B48C",
  "Pistachio": "#93C572",
  "Safety Pink": "#FF69B4",
  "Galapagos Blue": "#5F9EA0",
  "Heather Indigo": "#4B0082",
  "Blue Dusk": "#2F4F4F",
  "Natural": "#F5F5DC",
  "Dark Chocolate": "#3C1810",
  "Daisy": "#FFFF31",
  "Azalea": "#F778A1",
  "Irish Green": "#009A49",
  "Light Pink": "#FFB6C1",
  "Carolina Blue": "#56A0D3",
  "Indigo Blue": "#3F0FBF",
  "Heliconia": "#AA2B1D",
  "Sunset": "#FAD5A5",
  "Kiwi": "#8EE53F",
  "Safety Green": "#32CD32",
  "Tangerine": "#F28500",
  "Heather Sapphire": "#082567",
  "Mint Green": "#98FB98",
  "Iris": "#5A4FCF",
  "Metro Blue": "#003366",
  "Vegas Gold": "#C5B358",
  "Ice Grey": "#F0F8FF",
  "Heather Cardinal": "#C41E3A",
  "Safety Orange": "#FF6600",
  "Sapphire": "#0F52BA",
  "Prairie Dust": "#D2B48C",
  "Stone Blue": "#4682B4",
  "Cornsilk": "#FFF8DC",
  "Lime": "#00FF00",
  "Texas Orange": "#FF4500",
  "Heather Navy": "#1C2841",
  "Jade Dome": "#00A86B",
  "Military Green": "#4B5320",
  "Antique Irish Green": "#228B22",
  "Antique Royal": "#436B95",
  "Antique Cherry Red": "#B22222",
  "Cherry Red": "#DE3163",
  "Cardinal Red": "#C41E3A",
  "Orchid": "#DA70D6",
  "Sky": "#87CEEB",
  
  // Case variations
  "black": "#000000",
  "white": "#FFFFFF",
  "navy": "#1A2E5F",
  "red": "#E3342F",
  "blue": "#3490DC",
  "green": "#38A169",
  "gray": "#A0AEC0",
  "grey": "#A0AEC0",
  "pink": "#ED64A6",
  "yellow": "#ECC94B",
  "orange": "#F6AD55",
  "purple": "#9F7AEA",
  "brown": "#8D5524",
  "sand": "#D2B48C",
  "pistachio": "#93C572",
  "natural": "#F5F5DC",
  "ash": "#B2BEB5",
  "charcoal": "#36454F",
  "maroon": "#800000",
  "gold": "#FFD700",
  "tan": "#D2B48C",
};

export async function fetchPrintifyProducts(): Promise<Product[]> {
  const res = await fetch(`${NETLIFY_FN}/printify-products`)
  if (!res.ok) throw new Error(`Proxy error ${res.status}`)
  const { data } = (await res.json()) as { data: (PrintifyProduct & { colors?: string[] })[] }

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

    // 4) Use colors that were processed by our Netlify function
    const colourSwatches = p.colors || []

    // Debug logging
    console.log(`Product: ${p.title}`);
    console.log(`Final color swatches:`, colourSwatches);

    return {
      id:          p.id,
      name:        p.title,
      description,
      price,
      images:      allImages,
      category,
      colors:      colourSwatches, // <-- now uses colors from Netlify function
      // Do NOT include selectedColor here
    }
  })
}
