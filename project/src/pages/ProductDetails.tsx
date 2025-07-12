// project/src/pages/ProductDetails.tsx
// Updated COLOR_NAME_TO_HEX with mappings from provided table for Printify HEX to Gildan names.

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { fetchProducts } from '../data/products'
import type { Product } from '../services/printify'
import type { CartItem } from '../types/cart'
import placeholderImg from '../assets/logo_big.png'

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']

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
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>(AVAILABLE_SIZES[2]) // Default to M
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    loadProduct()
  }, [id])

 async function loadProduct() {
    try {
      setLoading(true)
      const products = await fetchProducts()
      const found = products.find(p => p.id === id)
      if (found) {
        setProduct(found)
        setMainImage(`/api/proxy-image?url=${encodeURIComponent(found.images[0] || placeholderImg)}`)
        setSelectedColor(found.colors?.[0] || '')
      }
    } catch (error) {
      console.error('Failed to load product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    
    const cartItem: CartItem = {
      ...product,
      selectedColor,
      selectedSize,
      quantity,
    }
    addToCart(cartItem)
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
      <div className="container-custom py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-maroon"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container-custom py-16">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-12 md:py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
      >
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={mainImage}
              alt={product.name}
              onError={handleImageError}
              className="w-full h-full object-contain"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(`/api/proxy-image?url=${encodeURIComponent(image)}`)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden ${
                    mainImage.includes(image) ? 'ring-2 ring-maroon' : ''
                  }`}
                >
                  <img
                    src={ `/api/proxy-image?url=${encodeURIComponent(image)}` }
                    alt={`View ${index + 1}`}
                    onError={handleImageError}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
            {product.name}
          </h1>
          <p className="text-2xl font-bold text-gray-900">
            CA${product.price.toFixed(2)}
          </p>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">Color</h3>
            <p className="text-base font-medium text-gray-700">
              {hexToName(selectedColor) || 'Select a color'}
            </p>
            <div className="flex flex-wrap gap-3">
              {product.colors?.map((hex, idx) => (
                <button
                  key={idx}
                  className={`w-10 h-10 rounded-full border-2 ${
                    selectedColor === hex ? 'border-maroon' : 'border-gray-300'
                  } hover:border-maroon focus:outline-none focus:border-maroon`}
                  style={{ backgroundColor: hex }}
                  onClick={() => setSelectedColor(hex)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Size</h3>
            <div className="flex flex-wrap gap-3">
              {AVAILABLE_SIZES.map((size) => (
                <button
                  key={size}
                  className={`px-4 py-2 border rounded-md font-medium ${
                    selectedSize === size
                      ? 'bg-maroon text-white border-maroon'
                      : 'border-gray-300 hover:border-maroon'
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Quantity</h3>
            <div className="flex items-center border border-gray-300 rounded-md w-fit">
              <button
                className="px-4 py-2 text-xl"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="px-6 py-2 border-x border-gray-300">{quantity}</span>
              <button
                className="px-4 py-2 text-xl"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <button
            className="w-full bg-maroon text-white py-4 rounded-md font-semibold hover:bg-maroon/90 transition-colors"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>

          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-gray-800">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ProductDetails
