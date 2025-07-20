import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import ProductCard from '../product/ProductCard'
import { fetchPrintifyProducts } from '../../services/printify'
import type { Product } from '../../types'

interface FeaturedProductsProps {
  products?: Product[];
  loading?: boolean;
}

const FeaturedProducts = ({ products: propProducts, loading: propLoading }: FeaturedProductsProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (propProducts !== undefined) {
      setProducts(propProducts);
      setLoading(propLoading || false);
      return;
    }

    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const featured = await fetchPrintifyProducts()
        setProducts(featured.slice(0, 4)) // Take first 4 as featured
      } catch (err) {
        console.error('Failed to load featured products:', err)
        setError('Failed to load featured products. Please check your API configuration.')
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [propProducts, propLoading])

  if (loading) {
    return (
      <section className="section-padding bg-cream-50 relative">
        <div className="container-custom">
          <div className="text-center">
            <motion.div
              className="inline-block w-12 h-12 border-4 border-saffron-200 border-t-saffron-500 rounded-full animate-spin"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="mt-4 text-neutral-600 font-montserrat">Loading featured products...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="section-padding bg-cream-50 relative">
        <div className="container-custom">
          <div className="text-center">
            <div className="card p-8 max-w-md mx-auto">
              <p className="text-error-600 mb-6 leading-relaxed">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Retry Loading
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="section-padding bg-cream-50 relative">
        <div className="container-custom">
          <div className="text-center">
            <div className="card p-8 max-w-md mx-auto">
              <Sparkles className="w-16 h-16 text-saffron-400 mx-auto mb-4" />
              <h3 className="text-xl font-playfair font-semibold text-neutral-900 mb-2">
                Coming Soon
              </h3>
              <p className="text-neutral-600">
                Our featured collection is being curated. Check back soon for amazing designs!
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-cream-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-paisley opacity-3"></div>
      
      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 bg-saffron-100 text-saffron-800 rounded-full px-4 py-2 text-sm font-montserrat font-medium mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Sparkles className="w-4 h-4" />
              Handpicked for You
            </motion.div>
            
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-neutral-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Featured <span className="text-gradient">Heritage</span> Collection
            </motion.h2>
            
            <motion.p
              className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Discover our most celebrated designs that perfectly capture the essence of 
              vintage Bollywood glamour reimagined for today's streetwear enthusiasts.
            </motion.p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <ProductCard
                  product={product}
                />
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.button
              className="btn-primary btn-lg group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/products'}
            >
              <span>Explore Full Collection</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
            
            <p className="mt-4 text-sm text-neutral-500 font-montserrat">
              Over 50+ unique designs available
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedProducts