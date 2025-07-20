import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Heart } from 'lucide-react'
import type { Product } from '../../types/index'
import { useCart } from '../../context/CartContext'
import { normalizeImageUrl } from '../../services/printify'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
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

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
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

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="flex flex-col h-full">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          )}
          
          <img
            src={imageError ? '/assets/logo_big.png' : currentImage}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          
          {/* Quick Add Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-4 left-4 right-4"
          >
            <button
              onClick={handleQuickAdd}
              className="w-full bg-white/90 backdrop-blur-sm text-gray-900 py-2 px-4 rounded-full flex items-center justify-center gap-2 hover:bg-white transition-colors duration-200 shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              Quick Add to Cart
            </button>
          </motion.div>
          
          {/* Wishlist Button */}
          <button
            className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
          </button>
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          {/* Title with fixed height for 2 lines */}
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>
          
          <p className="text-xl font-bold text-orange-600 mb-3">
            ${(product.variants && product.variants.length > 0
              ? Math.min(...product.variants.filter((v: any) => v.is_enabled).map((v: any) => v.price))
              : product.price
            ).toFixed(2)}
          </p>
          
          {/* Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-2 mt-auto">
              {product.colors.slice(0, 4).map((color: any, index: number) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setSelectedColorIndex(index)
                  }}
                  className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                    index === selectedColorIndex
                      ? 'border-gray-900 shadow-md scale-110'
                      : 'border-gray-300 hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                  +{product.colors.length - 4}
                </div>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard