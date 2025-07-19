import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Heart, Package, Shield, ChevronUp, ChevronDown } from 'lucide-react';
import { Product } from '../types';
import { fetchProducts } from '../data/products';
import { useCart } from '../context/CartContext';
import placeholderImg from '../assets/logo_big.png'

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']

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
  const [quantity, setQuantity] = useState(1)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['about']))

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
        // Handle different image formats
        const firstImage = typeof found.image === 'string' 
          ? found.image 
          : found.image?.src || placeholderImg
        setMainImage(firstImage)
        setSelectedColor(found.colors?.[0]?.hex || found.colors?.[0]?.name || '')
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
            <ArrowLeft className="w-4 h-4" />
            Back to products
          </button>
        </div>
      </div>
    )
  }

  // Get all images for the product
  const productImages = product.images && product.images.length > 0 
    ? product.images.map(img => typeof img === 'string' ? img : img.src).filter(Boolean)
    : [typeof product.image === 'string' ? product.image : product.image?.src || placeholderImg]

  return (
    <div className="min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/shop')}
          className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to products
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
            >
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-contain"
                onError={handleImageError}
              />
            </motion.div>
            
            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.slice(0, 8).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                      mainImage === img ? 'border-orange-500' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-full object-contain"
                      onError={handleImageError}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{decodeHTMLEntities(product.name)}</h1>
              <p className="text-2xl font-semibold text-orange-600">${product.price.toFixed(2)}</p>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => {
                    const colorValue = color.hex || color.name || color
                    return (
                      <button
                        key={colorValue}
                        onClick={() => setSelectedColor(colorValue)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === colorValue ? 'border-gray-800 scale-110' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color.hex || COLOR_NAME_TO_HEX[color.name] || color }}
                        title={color.name || hexToName(colorValue)}
                      />
                    )
                  })}
                </div>
                {selectedColor && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {hexToName(selectedColor)}
                  </p>
                )}
              </div>
            )}

            {/* Size Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Size</h3>
              <div className="grid grid-cols-4 gap-2">
                {AVAILABLE_SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-4 border rounded-lg transition-colors ${
                      selectedSize === size
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 hover:border-gray-400 flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 hover:border-gray-400 flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart & Wishlist */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Return Policy */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="w-4 h-4" />
                <span>30 days return policy.</span>
                <a href="/terms" className="text-orange-500 hover:text-orange-600 underline">
                  See details
                </a>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Secure payments accepted</span>
              </div>
            </div>

            {/* Product Information Sections */}
            <div className="border-t pt-6">
              {getProductInfoSections(product).map((section) => (
                <div key={section.id} className="border-b border-gray-200">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full py-4 px-0 flex items-center justify-between text-left hover:text-orange-600 transition-colors"
                  >
                    <h2 className="text-lg font-semibold">{section.title}</h2>
                    {expandedSections.has(section.id) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {expandedSections.has(section.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 text-gray-700">
                          {section.id === 'about' && section.content && typeof section.content === 'object' && 'designTitle' in section.content && (
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold mb-2">The Design</h3>
                                <p className="font-medium mb-2">{section.content.designTitle}</p>
                                <p>{section.content.designDescription}</p>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
