// project/src/components/home/FeaturedProducts.tsx

import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import type { CartItem } from '../../types/cart'
import { Product } from '../../services/printify'
import { getFeaturedProducts } from '../../data/products'
import { useEffect, useState } from 'react'

const DEFAULT_SIZE = 'M'

const FeaturedProducts = () => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getFeaturedProducts()
        setProducts(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return <p className="text-center py-16">Loading…</p>
  }
  if (products.length === 0) {
    return <p className="text-center py-16">No featured products.</p>
  }

  return (
    <section className="py-16">
      <div className="container-custom">
        <h2 className="font-playfair text-4xl text-maroon mb-8 text-center">
          New Arrivals
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col relative group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              onClick={() => navigate(`/products/${product.id}`)}
            >
              {/* Product Image */}
              <div className="w-full aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-3">
                <img
                  src={product.images?.[0] || '/placeholder.png'}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Color Swatches */}
              <div className="flex items-center space-x-1 mb-2 min-h-[28px]">
                {product.colors?.slice(0, 5).map((hex) => (
                  <span
                    key={hex}
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: hex }}
                    title={hex}
                  />
                ))}
                {product.colors && product.colors.length > 5 && (
                  <span className="ml-1 text-xs text-neutral-600 font-semibold">
                    +{product.colors.length - 5}
                  </span>
                )}
              </div>

              {/* Product Name */}
              <div className="mt-1 mb-0.5">
                <span className="block text-base font-medium text-neutral-900 leading-tight">
                  {product.name}
                </span>
              </div>

              {/* Price */}
              <div>
                <span className="text-lg font-bold text-neutral-900">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={e => {
                  e.stopPropagation()
                  const cartItem: CartItem = {
                    ...product,
                    selectedColor: product.colors?.[0] || '',
                    selectedSize: DEFAULT_SIZE,
                    quantity: 1,
                  }
                  addToCart(cartItem)
                }}
                className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Add to cart"
              >
                🛒
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
