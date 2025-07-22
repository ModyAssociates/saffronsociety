import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import type { Product } from '../../types/index'
import { useCart } from '../../context/CartContext'
import { normalizeImageUrl } from '../../services/printify'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const { addItem } = useCart()

  // Get the current image URL based on selected color
  const currentImage = (() => {
    try {
      if (!product.images || product.images.length === 0) {
        return '/assets/logo_big.png'
      }

      // If we have color-specific images
      if (product.images[selectedColorIndex]) {
        const img = product.images[selectedColorIndex]
        return normalizeImageUrl(img)
      }

      // Fallback to first image
      const firstImg = product.images[0]
      return normalizeImageUrl(firstImg)
    } catch (error) {
      console.error('Error getting product image:', error)
      return '/assets/logo_big.png'
    }
  })()

  const handleAddToCart = () => {
    const selectedColor = product.colors?.[selectedColorIndex]?.hex || '#000000'
    const selectedSize = product.sizes?.[0] || 'M'
    addItem(product, selectedSize, selectedColor)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  // Extract "Why You'll Love It" from description or use fallback
  const getWhyYoullLoveIt = () => {
    const description = product.description || ''
    // Look for common patterns or just use first sentence
    if (description.includes('Soft cotton') || description.includes('vintage') || description.includes('bollywood')) {
      return description.slice(0, 80) + '...'
    }
    return 'Soft cotton. Iconic vibes. Designed for Desi streetwear heads.'
  }

  // Use imagesByColor for color-specific images, fallback to generic images
  let colorImages = undefined;
  if (product.imagesByColor && product.colors && product.colors[selectedColorIndex]) {
    const colorName = product.colors[selectedColorIndex].name;
    colorImages = product.imagesByColor[colorName];
  }
  // Only use colorImages if defined, otherwise fallback to product.images
  const angles = colorImages && colorImages.angles ? Object.values(colorImages.angles).flat() as string[] : [];
  const allImages = colorImages
    ? [colorImages.main, ...angles, ...(colorImages.models || [])].filter(Boolean)
    : (product.images || []).filter(Boolean);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative w-full aspect-[4/5] overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          )}
          
          <img
            src={imageError ? '/assets/logo_big.png' : currentImage}
            alt={product.name}
            className={`object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          
          {product.createdAt && (() => {
            const created = new Date(product.createdAt)
            const now = new Date()
            const diffMs = now.getTime() - created.getTime()
            const diffDays = diffMs / (1000 * 60 * 60 * 24)
            if (diffDays <= 7) {
              return (
                <div className="absolute top-2 right-2 bg-white text-black text-xs font-semibold px-2 py-1 rounded-md shadow">
                  NEW
                </div>
              )
            }
            return null
          })()}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold font-playfair leading-tight text-gray-900 line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mt-3">
            <span className="text-base font-bold text-gray-900">
              ${(product.variants && product.variants.length > 0
                ? Math.min(...product.variants.filter((v: any) => v.is_enabled).map((v: any) => v.price))
                : product.price
              ).toFixed(2)}
            </span>
            
            <div className="flex gap-1">
              {product.colors && product.colors.length > 0 ? (
                <>
                  {product.colors.slice(0, 3).map((color: any, index: number) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setSelectedColorIndex(index)
                      }}
                      className={`w-4 h-4 rounded-full border transition-all duration-200 ${
                        index === selectedColorIndex
                          ? 'border-gray-700 ring-2 ring-gray-700 ring-offset-1'
                          : 'border-gray-300 hover:border-gray-500'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                  {product.colors.length > 3 && (
                    <span className="text-xs text-gray-500 ml-1">+{product.colors.length - 3}</span>
                  )}
                </>
              ) : (
                // Fallback colors for demo
                <>
                  <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: '#000000' }} />
                  <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: '#ffffff' }} />
                  <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: '#A82235' }} />
                </>
              )}
            </div>
          </div>

          <div className="mt-4">
            <button 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleAddToCart()
              }}
              className="w-full bg-black text-white text-sm py-2 px-4 rounded-md hover:bg-gray-900 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
          </div>

          <div className="mt-3 text-xs text-gray-500 italic">
            ✨ Why You'll Love It:
            <span className="block text-gray-700 not-italic font-normal mt-1">
              {getWhyYoullLoveIt()}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard