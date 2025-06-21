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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              onClick={() => navigate(`/products/${product.id}`)}
            >
              {/* IMAGE */}
              <div className="relative overflow-hidden rounded-lg bg-white shadow">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* ADD TO CART ICON */}
                <button
                  onClick={(e) => {
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
              </div>

              {/* PRICE */}
              <p className="mt-4 text-center text-xl font-semibold text-maroon">
                ${product.price.toFixed(2)}
              </p>

              {/* COLORS */}
              <div className="mt-2 flex justify-center space-x-2">
                {product.colors && product.colors.length > 0 ? (
                  product.colors.map((hex) => (
                    <span
                      key={hex}
                      className="w-5 h-5 rounded-full border"
                      style={{ backgroundColor: hex }}
                    />
                  ))
                ) : (
                  <span className="text-sm text-gray-400">No colors</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
