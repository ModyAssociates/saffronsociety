import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, ChevronDown, Star, Truck, Shield, Package } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { fetchPrintifyProducts, hexToColorName } from '../services/printify';
import placeholderImg from '../assets/logo_big.png'

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']

// Utility function to decode HTML entities
const decodeHTMLEntities = (text: string): string => {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

// Product information sections function
const getProductInfoSections = (product: Product) => [
  {
    id: 'about',
    title: 'About product',
    content: {
      designTitle: decodeHTMLEntities(product.name),
      designDescription: decodeHTMLEntities(product.description || 'Express yourself with this unique design from Saffron Society. Our premium quality t-shirts combine comfort with style, perfect for making a statement wherever you go.'),
      features: [
        'Premium quality cotton construction',
        'Vibrant, long-lasting print', 
        'Comfortable unisex fit',
        'Ethically sourced and produced'
      ]
    }
  },
  {
    id: 'details',
    title: 'Product details',
    content: [
      {
        title: 'Without side seams',
        description: 'Knitted in one piece using tubular knit, it reduces fabric waste and makes the garment more attractive'
      },
      {
        title: 'Ribbed knit collar without seam',
        description: 'Ribbed knit makes the collar highly elastic and helps retain its shape'
      },
      {
        title: 'Shoulder tape',
        description: 'Twill tape covers the shoulder seams to stabilize the back of the garment and prevent stretching'
      },
      {
        title: 'Fiber composition',
        description: 'Solid colors are 100% cotton; Heather colors are 50% cotton, 50% polyester (Sport Grey is 90% cotton, 10% polyester); Antique colors are 90% cotton, 10% polyester'
      },
      {
        title: 'Bigger shirt size',
        description: 'The t-shirt runs bigger than usual giving extra space for comfort'
      },
      {
        title: 'Fabric',
        description: 'Environmentally-friendly manufactured cotton that gives thicker vintage feel to the shirt. Long-lasting garment suitable for everyday use. The "Natural" color is made with unprocessed cotton, which results in small black flecks throughout the fabric'
      },
      {
        title: 'Age restrictions',
        description: 'For adults and teens'
      },
      {
        title: 'Other compliance information',
        description: 'Meets the formaldehyde, phthalates, lead and flammability level requirements.'
      }
    ]
  },
  {
    id: 'care',
    title: 'Care instructions',
    content: [
      'Machine wash: cold (max 30C or 90F)',
      'Non-chlorine: bleach as needed',
      'Do not tumble dry',
      'Do not iron',
      'Do not dryclean'
    ]
  },
  {
    id: 'shipping',
    title: 'Shipping & delivery',
    content: 'Accurate shipping options will be available in checkout after entering your full address.'
  },
  {
    id: 'returns',
    title: '30 day return policy',
    content: `Any goods purchased can only be returned in accordance with the Terms and Conditions and Returns Policy.

We want to make sure that you are satisfied with your order and we are committed to making things right in case of any issues. We will provide a solution in cases of any defects if you contact us within 30 days of receiving your order.

See Terms of Use`
  },
  {
    id: 'gpsr',
    title: 'GPSR',
    content: {
      euRep: 'EU representative: Saffron Society, support@saffronsociety.com, 21 Attlebery Crescent, Paris, ON, N3L0H9, CA',
      productInfo: 'Product information: Gildan 2000, 2 year warranty in EU and Northern Ireland as per Directive 1999/44/EC',
      warnings: 'Warnings, Hazard: For adults',
      care: 'Care instructions: Machine wash: cold (max 30C or 90F), Non-chlorine: bleach as needed, Do not tumble dry, Do not iron, Do not dryclean'
    }
  }
]

const COLOR_NAME_TO_HEX: Record<string, string> = {
  // Mappings from user's table: Printify HEX -> Nearest Gildan Color (using Gildan HEX as value for consistency)
  "#000000": "#25282A",  // Black
  "#DCD2BE": "#D7D2CB",  // Ice Grey
  "#642838": "#5B2B42",  // Maroon
  "#31221D": "#382F2D",  // Dark Chocolate
  "#005C70": "#005D6F",  // Galapagos Blue
  "#FF8E9D": "#DD74A1",  // Azalea
  "#FFFFFF": "#FFFFFF",  // White / PFD White
  "#F7E1B0": "#F4D1A1",  // Vegas Gold
  "#FFF6E3": "#FFFFFF",  // White / PFD White
  "#223B26": "#273B33",  // Forest
  "#454545": "#333F48",  // Heather Navy
  "#274D91": "#224D8F",  // Royal
  "#1A2237": "#263147",  // Navy
  "#A82235": "#AC2B37",  // Cherry Red
  "#B54557": "#B15533",  // Texas Orange
  "#F6F6F6": "#FFFFFF",  // White / PFD White
  "#D3D590": "#F4D1A1",  // Vegas Gold (closest)
  "#6A798E": "#4D6995",  // Heather Indigo

  // Previous colors (kept for completeness, but table takes priority if conflicts)
  "Amethyst": "#6c4b94",
  "Antique Cherry Red": "#971b2f",
  "Antique Heliconia": "#aa0061",
  "Antique Irish Green": "#00843d",
  "Antique Jade Dome": "#006269",
  "Antique Orange": "#b33d26",
  "Antique Royal": "#003087",
  "Antique Sapphire": "#006a8e",
  "Ash": "#c8c9c7",
  "Ash Grey": "#c8c9c7",
  "Azalea": "#dd74a1",
  "Baby Blue": "#69b3e7",
  "Berry": "#7f2952",
  "Black": "#25282a",
  "Blackberry": "#221c35",
  "Blue Dusk": "#253746",
  "Bright Salmon": "#e5554f",
  "Brown Savana": "#7a6855",
  "Cactus": "#788a7a",
  "Cardinal Red": "#8a1538",
  "Caribbean Blue": "#00a9ce",
  "Caribbean Mist": "#00a9ce",
  "Carolina Blue": "#7ba4db",
  "Carolina Blue Mist": "#7ba4db",
  "Cement": "#aeaeae",
  "Chalky Mint": "#5cb8b2",
  "Chambray": "#bdd6e6",
  "Charcoal": "#66676c",
  "Charity Pink": "#f8a3bc",
  "Cherry Red": "#ac2b37",
  "Chestnut": "#83635c",
  "Cobalt": "#171c8f",
  "Coral Silk": "#fb637e",
  "Cornsilk": "#f0ec74",
  "Daisy": "#fed101",
  "Dark Chocolate": "#382f2d",
  "Dark Heather": "#425563",
  "Dune Mist": "#7a7256",
  "Dusty Rose": "#e1bbb4",
  "Electric Green": "#43b02a",
  "Flo Blue": "#5576d1",
  "Forest": "#273b33",
  "Galapagos Blue": "#005d6f",
  "Garnet": "#7d2935",
  "Gold": "#eead1a",
  "Graphite Heather": "#707372",
  "Gravel": "#888b8d",
  "Gunmetal": "#939694",
  "Heather Berry": "#994878",
  "Heather Blue": "#3a5dae",
  "Heather Bronze": "#c04c36",
  "Heather Cardinal": "#9b2743",
  "Heather Caribbean Blue": "#00afd7",
  "Heather Coral Silk": "#ff808b",
  "Heather Dark Green": "#3e5d58",
  "Heather Grey": "#9ea2a2",
  "Heather Heliconia": "#e24585",
  "Heather Indigo": "#4d6995",
  "Heather Irish Green": "#5caa7f",
  "Heather Maroon": "#672e45",
  "Heather Military Green": "#7e7f74",
  "Heather Navy": "#333f48",
  "Heather Orange": "#ff8d6d",
  "Heather Purple": "#614b79",
  "Heather Radiant Orchid": "#a15a95",
  "Heather Red": "#bf0d3e",
  "Heather Royal": "#307fe2",
  "Heather Sapphire": "#0076a8",
  "Heather Seafoam": "#40c1ac",
  "Heather Sport Dark Maroon": "#651d32",
  "Heather Sport Dark Navy": "#595478",
  "Heather Sport Royal": "#1d4f91",
  "Heather Sport Scarlet Red": "#b83a4b",
  "Heliconia": "#db3e79",
  "Honey": "#edaesa",
  "Ice Grey": "#d7d2cb",
  "Indigo Blue": "#486d87",
  "Iris": "#3975b7",
  "Irish Green": "#00a74a",
  "Island Reef": "#8fd6bd",
  "Jade Dome": "#00857d",
  "Kelly": "#00805e",
  "Kelly Green": "#00805e",
  "Kelly Mist": "#00805e",
  "Kiwi": "#89a84f",
  "Lagoon Blue": "#4ac3e0",
  "Legion Blue": "#1f495b",
  "Light Blue": "#a3b3cb",
  "Light Pink": "#e4c6d4",
  "Lilac": "#563d82",
  "Lime": "#92bf55",
  "Marbled Charcoal": "#66676c",
  "Marbled Galapagos Blue": "#005d6f",
  "Marbled Heliconia": "#db3e79",
  "Marbled Navy": "#263147",
  "Marbled Royal": "#224d8f",
  "Maroon": "#5b2b42",
  "Maroon Mist": "#6d273c",
  "Meadow": "#046a38",
  "Metro Blue": "#464e7e",
  "Midnight": "#005670",
  "Military Green": "#5e7461",
  "Mint Green": "#a0cfab",
  "Moss": "#3d441e",
  "Mustard": "#c3964d",
  "Natural": "#e7ceb5",
  "Navy": "#263147",
  // ... (any additional from previous if needed)
};

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>(AVAILABLE_SIZES[2]) // Default to M
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [quantity, setQuantity] = useState(1)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['about']))

  useEffect(() => {
    loadProduct()
  }, [id])

  // Update price when size or color changes
  useEffect(() => {
    if (product && selectedSize) {
      updatePrice()
    }
  }, [product, selectedSize, selectedColor])

  // Update image when color changes
  useEffect(() => {
    if (product && selectedColor) {
      updateImageForColor()
    }
  }, [selectedColor])

  const updatePrice = () => {
    if (!product) return
    
    // Find the color name from the hex value
    const selectedColorName = product.colors?.find(c => c.hex === selectedColor)?.name
    
    // Find variant that matches selected size and color
    const matchingVariant = product.variants?.find(v => {
      const sizeMatch = v.size === selectedSize
      const colorMatch = v.color?.toLowerCase() === selectedColorName?.toLowerCase()
      return sizeMatch && colorMatch
    })
    
    if (matchingVariant) {
      setCurrentPrice(matchingVariant.price)
    } else {
      // Fallback to product base price or lowest variant price
      const lowestPrice = product.variants && product.variants.length > 0
        ? Math.min(...product.variants.filter(v => v.is_enabled).map(v => v.price))
        : product.price
      setCurrentPrice(lowestPrice)
    }
  }

  const updateImageForColor = () => {
    if (!product) return
    
    // Find color-specific image
    const selectedColorData = product.colors?.find(c => 
      c.hex === selectedColor || c.name.toLowerCase() === selectedColor.toLowerCase()
    )
    
    if (selectedColorData?.image) {
      setMainImage(selectedColorData.image)
    } else if (product.images && product.images.length > 0) {
      // Fallback to first available image
      setMainImage(product.images[0])
    }
  }

  // Check if a size is available for the current selected color
  const isSizeAvailable = (size: string): boolean => {
    if (!product || !product.variants) return false
    
    const selectedColorName = product.colors?.find(c => c.hex === selectedColor)?.name
    
    // Check if there's a variant with this size and color that's available
    return product.variants.some(v => 
      v.size === size && 
      v.color?.toLowerCase() === selectedColorName?.toLowerCase() &&
      v.is_enabled &&
      v.is_available
    )
  }

  async function loadProduct() {
    try {
      setLoading(true)
      const products = await fetchPrintifyProducts()
      const found = products.find(p => p.id === id)
      if (found) {
        setProduct(found)
        
        // Set initial image - prioritize product.images array
        const firstImage = found.images && found.images.length > 0
          ? found.images[0]
          : typeof found.image === 'string' 
            ? found.image 
            : found.image?.src || placeholderImg
        setMainImage(firstImage)
        
        // Set initial color
        setSelectedColor(found.colors?.[0]?.hex || found.colors?.[0]?.name || '')
        
        // Set initial price
        const lowestPrice = found.variants && found.variants.length > 0
          ? Math.min(...found.variants.filter(v => v.is_enabled).map(v => v.price))
          : found.price
        setCurrentPrice(lowestPrice)
      }
    } catch (error) {
      console.error('Failed to load product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    
    // Add item to cart with correct parameters
    addItem(product, selectedSize, selectedColor, quantity)
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = placeholderImg
  }

  const hexToName = (hex: string): string => {
    const entry = Object.entries(COLOR_NAME_TO_HEX).find(([_, value]) => value.toLowerCase() === hex.toLowerCase())
    return entry ? entry[0] : hex
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/shop')}
            className="text-orange-500 hover:text-orange-600 flex items-center gap-2 mx-auto"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to products
          </button>
        </div>
      </div>
    )
  }

  // Get all product images including the main image and additional images
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [typeof product.image === 'string' ? product.image : product.image?.src || placeholderImg]

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/shop')}
          className="mb-6 text-gray-700 hover:text-orange-600 flex items-center gap-2 transition-colors font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to products
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square bg-white/70 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/40 shadow-xl"
            >
              {/* Radial gradient overlay */}
              <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-orange-100/30 pointer-events-none" />
              
              {/* Cinema badge */}
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-black/80 backdrop-blur-md text-amber-300 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider border border-amber-400/30">
                  CULT CLASSICS
                </div>
              </div>
              
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-contain relative z-10"
                onError={handleImageError}
              />
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-orange-200/20 via-transparent to-transparent pointer-events-none" />
            </motion.div>
            
            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.slice(0, 8).map((img: string, idx: number) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMainImage(img)}
                    className={`aspect-square bg-white/60 backdrop-blur-md rounded-xl overflow-hidden border-2 transition-all shadow-lg ${
                      mainImage === img 
                        ? 'border-orange-400 shadow-orange-200/50' 
                        : 'border-white/40 hover:border-orange-300/60'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-full object-contain"
                      onError={handleImageError}
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/40 shadow-xl"
            >
              <div className="mb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                  {decodeHTMLEntities(product.name)}
                </h1>
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  ${currentPrice.toFixed(2)}
                </p>
              </div>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => {
                      const colorValue = typeof color === 'string' ? color : (color.hex || color.name)
                      const colorHex = typeof color === 'string' 
                        ? COLOR_NAME_TO_HEX[color] || color
                        : color.hex || COLOR_NAME_TO_HEX[color.name] || color.name
                      const colorName = typeof color === 'string' ? color : color.name
                      
                      return (
                        <motion.button
                          key={colorValue}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedColor(colorValue)}
                          className={`w-10 h-10 rounded-full border-3 transition-all shadow-lg ${
                            selectedColor === colorValue 
                              ? 'border-gray-800 shadow-lg' 
                              : 'border-white/60 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: colorHex }}
                          title={colorName || hexToName(colorValue)}
                        />
                      )
                    })}
                  </div>
                  {selectedColor && (
                    <p className="text-sm text-gray-600 mt-3 font-medium">
                      Selected: {product.colors?.find(c => c.hex === selectedColor)?.name || hexToName(selectedColor)}
                    </p>
                  )}
                </div>
              )}

              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Size</h3>
                <div className="grid grid-cols-3 gap-3">
                  {AVAILABLE_SIZES.map(size => {
                    const isAvailable = isSizeAvailable(size)
                    const isSelected = selectedSize === size
                    
                    return (
                      <motion.button
                        key={size}
                        whileHover={isAvailable ? { scale: 1.05 } : {}}
                        whileTap={isAvailable ? { scale: 0.95 } : {}}
                        onClick={() => isAvailable && setSelectedSize(size)}
                        disabled={!isAvailable}
                        className={`py-3 px-4 border-2 rounded-xl font-semibold transition-all relative ${
                          isSelected && isAvailable
                            ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-lg'
                            : isAvailable
                            ? 'border-white/60 bg-white/50 hover:border-orange-300 hover:bg-orange-50/50'
                            : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <span className={isAvailable ? '' : 'line-through'}>{size}</span>
                          {!isAvailable && (
                            <span className="text-xs text-gray-400 mt-1">Sold Out</span>
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quantity</h3>
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-xl border-2 border-white/60 bg-white/50 hover:border-orange-300 hover:bg-orange-50/50 flex items-center justify-center transition-all font-bold text-lg"
                  >
                    -
                  </motion.button>
                  <span className="w-16 text-center font-bold text-xl">{quantity}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-xl border-2 border-white/60 bg-white/50 hover:border-orange-300 hover:bg-orange-50/50 flex items-center justify-center transition-all font-bold text-lg"
                  >
                    +
                  </motion.button>
                </div>
              </div>

              {/* Add to Cart & Wishlist */}
              <div className="flex gap-4 mb-6">
                <motion.button
                  whileHover={isSizeAvailable(selectedSize) ? { scale: 1.02 } : {}}
                  whileTap={isSizeAvailable(selectedSize) ? { scale: 0.98 } : {}}
                  onClick={isSizeAvailable(selectedSize) ? handleAddToCart : undefined}
                  disabled={!isSizeAvailable(selectedSize)}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg text-lg ${
                    isSizeAvailable(selectedSize)
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isSizeAvailable(selectedSize) ? 'Add to Cart' : 'Size Not Available'}
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 border-2 border-white/60 bg-white/50 rounded-xl hover:border-red-300 hover:bg-red-50/50 transition-all"
                >
                  <Heart className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Return Policy */}
              <div className="border-t border-white/40 pt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                  <Package className="w-5 h-5 text-orange-500" />
                  <span>30 days return policy.</span>
                  <a href="/terms" className="text-orange-600 hover:text-orange-700 underline font-semibold">
                    See details
                  </a>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span>Secure payments accepted</span>
                </div>
              </div>
            </motion.div>

            {/* Product Information Sections */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/70 backdrop-blur-lg rounded-2xl border border-white/40 shadow-xl overflow-hidden"
            >
              {getProductInfoSections(product).map((section) => (
                <div key={section.id} className="border-b border-white/30 last:border-b-0">
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    onClick={() => toggleSection(section.id)}
                    className="w-full py-5 px-6 flex items-center justify-between text-left hover:text-orange-600 transition-colors"
                  >
                    <h2 className="text-lg font-bold">{section.title}</h2>
                    <motion.div
                      animate={{ rotate: expandedSections.has(section.id) ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </motion.button>
                  
                  <AnimatePresence>
                    {expandedSections.has(section.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 px-6 text-gray-700">
                          {section.id === 'about' && section.content && typeof section.content === 'object' && 'designTitle' in section.content && (
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold mb-2">The Design</h3>
                                <p className="font-medium mb-2">{section.content.designTitle}</p>
                                <div 
                                  className="prose prose-sm max-w-none
                                    [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:text-gray-800 [&>h2]:mt-6 [&>h2]:mb-3 [&>h2]:first:mt-0
                                    [&>h3]:text-base [&>h3]:font-semibold [&>h3]:text-gray-800 [&>h3]:mt-4 [&>h3]:mb-2 
                                    [&>h4]:text-sm [&>h4]:font-semibold [&>h4]:text-gray-800 [&>h4]:mt-3 [&>h4]:mb-2
                                    [&>p]:text-sm [&>p]:text-gray-700 [&>p]:mb-3 [&>p]:leading-relaxed
                                    [&>ul]:text-sm [&>ul]:text-gray-700 [&>ul]:mb-3 [&>ul]:space-y-1
                                    [&>ul>li]:flex [&>ul>li]:items-start [&>ul>li]:ml-4
                                    [&>ul>li:before]:content-['•'] [&>ul>li:before]:text-orange-500 [&>ul>li:before]:mr-2 [&>ul>li:before]:mt-0.5
                                    [&>strong]:font-semibold [&>strong]:text-gray-800
                                    [&>em]:italic [&>em]:text-gray-600"
                                  dangerouslySetInnerHTML={{ __html: product.description || 'Express yourself with this unique design from Saffron Society. Our premium quality t-shirts combine comfort with style, perfect for making a statement wherever you go.' }} 
                                />
                                <button className="text-orange-500 hover:text-orange-600 text-sm mt-2">
                                  Read more
                                </button>
                              </div>
                              {section.content.features && (
                                <ul className="space-y-2">
                                  {section.content.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start">
                                      <span className="text-orange-500 mr-2">•</span>
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                          
                          {section.id === 'details' && Array.isArray(section.content) && (
                            <div className="space-y-4">
                              {section.content.map((detail, idx) => (
                                <div key={idx}>
                                  {typeof detail === 'object' && detail.title ? (
                                    <>
                                      <h4 className="font-semibold mb-1">{detail.title}</h4>
                                      <p className="text-sm">{detail.description}</p>
                                    </>
                                  ) : (
                                    <p className="text-sm">{typeof detail === 'string' ? detail : ''}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {section.id === 'care' && Array.isArray(section.content) && (
                            <ul className="space-y-1">
                              {section.content.map((instruction, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="text-orange-500 mr-2">•</span>
                                  {typeof instruction === 'string' ? instruction : ''}
                                </li>
                              ))}
                            </ul>
                          )}
                          
                          {section.id === 'shipping' && typeof section.content === 'string' && (
                            <p>{section.content}</p>
                          )}
                          
                          {section.id === 'returns' && typeof section.content === 'string' && (
                            <div className="space-y-3">
                              {section.content.split('\n\n').map((paragraph, idx) => (
                                <p key={idx}>
                                  {paragraph.includes('Terms of Use') ? (
                                    <>
                                      {paragraph.split('Terms of Use')[0]}
                                      <a href="/terms" className="text-orange-500 hover:text-orange-600 underline">
                                        Terms of Use
                                      </a>
                                    </>
                                  ) : (
                                    paragraph
                                  )}
                                </p>
                              ))}
                            </div>
                          )}
                          
                          {section.id === 'gpsr' && section.content && typeof section.content === 'object' && 'euRep' in section.content && (
                            <div className="space-y-3 text-sm">
                              <p>{section.content.euRep}</p>
                              <p>{section.content.productInfo}</p>
                              <p>{section.content.warnings}</p>
                              <p>{section.content.care}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
