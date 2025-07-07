// project/src/components/product/ProductCard.tsx

import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import type { CartItem } from '../../types/cart'
import { Product } from '../../services/printify'

interface ProductCardProps {
  product: Product
  index: number
  isBestSeller?: boolean
}

const DEFAULT_SIZE = 'M'

const ProductCard = ({ product, index, isBestSeller = false }: ProductCardProps) => {
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    const cartItem: CartItem = {
      ...product,
      selectedColor: product.colors?.[0] || '',
      selectedSize: DEFAULT_SIZE,
      quantity: 1,
    }
    addToCart(cartItem)
  }

  return (
    <motion.div
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer relative group h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* Best Seller Badge */}
      {isBestSeller && (
        <div className="absolute top-2 left-2 bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-sm z-10">
          Best seller
        </div>
      )}

      {/* Product Image */}
      <div className="w-full aspect-[4/5] bg-gray-100 overflow-hidden flex-shrink-0">
        <img
          src={product.images?.[0] || '/placeholder.png'}
          alt={product.name}
          className="object-contain object-center w-full h-full hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Product Name */}
        <h3 className="text-sm font-medium text-gray-900 mb-3 line-clamp-2 leading-tight flex-grow-0">
          {product.name}
        </h3>

        {/* Color Swatches */}
        <div className="flex items-center space-x-1 mb-3 flex-wrap gap-1">
          {(() => {
            console.log(`ProductCard for ${product.name} received colors:`, product.colors);
            return product.colors?.slice(0, 8).map((hex, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                style={{ backgroundColor: hex }}
                title={`Color ${index + 1}: ${hex}`}
              />
            ));
          })()}
          {product.colors && product.colors.length > 8 && (
            <span className="text-xs text-gray-600 font-medium ml-1">
              +{product.colors.length - 8}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-auto">
          <span className="text-lg font-bold text-gray-900">
            CA${product.price.toFixed(2)}
          </span>
        </div>

        {/* Add to Cart Button - Hidden by default, shown on hover */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
          aria-label="Add to cart"
        >
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}

export default ProductCard
