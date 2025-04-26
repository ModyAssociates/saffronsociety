// project/src/pages/ProductPage.tsx

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { fetchProducts } from '../data/products'
import { Product } from '../services/printify'

const ProductPage = () => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await fetchProducts()
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
    return <p className="text-center py-16">No products found.</p>
  }

  return (
    <section className="py-8 md:py-12">
      <div className="container-custom">
        <h1 className="font-playfair text-4xl text-maroon mb-6 text-center">
          Bollywood Collection
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              onClick={() => navigate(`/products/${product.id}`)}
            >
              {/* IMAGE */}
              <div className="relative overflow-hidden rounded-lg bg-white shadow">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    addToCart(product)
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
                {product.colors.length > 0 ? (
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

export default ProductPage
