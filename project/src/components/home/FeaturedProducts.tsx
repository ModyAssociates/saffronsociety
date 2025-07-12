// project/src/components/home/FeaturedProducts.tsx
// Updated to handle empty products gracefully without mock.

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '../product/ProductCard'
import { getFeaturedProducts } from '../../data/products'
import type { Product } from '../../services/printify'

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const featured = await getFeaturedProducts(4)
        setProducts(featured)
      } catch (err) {
        console.error('Failed to load featured products:', err)
        setError('Failed to load featured products. Please check your API configuration.')
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-maroon"></div>
            <p className="mt-4 text-gray-600">Loading featured products...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center">
            <p className="text-gray-600">No featured products available yet.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Featured Collection
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our most popular designs celebrating iconic moments and characters from Indian cinema
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                isBestSeller={index < 2}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedProducts