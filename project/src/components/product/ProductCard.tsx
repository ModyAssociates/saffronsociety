import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import type { Product } from '../../types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Get the first image from the product
  const displayImage = product.images?.[0] || '/src/assets/logo_big.png'

  return (
    <motion.div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Add to wishlist"
          >
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </motion.button>
          
          <motion.button
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4 text-gray-600 hover:text-[#D2691E]" />
          </motion.button>
        </div>

        {/* Product Image */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <img
            src={imageError ? '/src/assets/logo_big.png' : displayImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick Add Button */}
          <motion.button
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#D2691E] text-white px-6 py-2 rounded-full font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#A0522D] shadow-lg"
            initial={{ y: 20 }}
            animate={{ y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart className="w-4 h-4 inline mr-2" />
            Quick Add
          </motion.button>
        </div>

        {/* Product Info */}
        <div className="p-6">
          <Link to={`/products/${product.id}`} className="block">
            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-[#1a4d4d] transition-colors duration-200">
              {product.name}
            </h3>
            
            {/* Price */}
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-[#D2691E]">
                ${product.price}
              </span>
              
              {/* Rating stars placeholder */}
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.5 3 1.5-6.5L0 6l6.5-.5L10 0l3.5 5.5L20 6l-6 5.5L15.5 18z" />
                  </svg>
                ))}
                <span className="ml-1 text-sm text-gray-500">(32)</span>
              </div>
            </div>
            
            {/* Color options placeholder */}
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-gray-600">Colors:</span>
              <div className="flex gap-1">
                {['#000000', '#FFFFFF', '#1a4d4d', '#D2691E'].map((color, index) => (
                  <div
                    key={index}
                    className="w-5 h-5 rounded-full border-2 border-gray-200 cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}