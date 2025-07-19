import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductCard from '../components/product/ProductCard'
import { fetchProducts } from '../data/products'
import type { Product } from '../types'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchProducts()
        setFeaturedProducts(products.slice(0, 4))
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#F5E6D3] py-8 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Hero Image - Featured T-shirt */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex justify-center lg:justify-start order-2 lg:order-1"
            >
              <div className="relative max-w-lg">
                {/* T-shirt mockup */}
                <div className="relative bg-gradient-to-br from-[#F5E6D3] to-[#E5D6C3] rounded-3xl p-8 shadow-2xl">
                  <img
                    src="/src/assets/bhoot-bangla-shirt.svg"
                    alt="Bhoot Bangla 1965 - Featured T-shirt"
                    className="w-full h-auto object-contain transform hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = '/src/assets/logo_big.png'
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="text-center lg:text-left order-1 lg:order-2"
            >
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#1a4d4d] mb-6 lg:mb-8 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                Wear the<br />
                <span className="text-[#2C1810]">Cult Classics.</span>
              </motion.h1>
              
              <motion.p
                className="text-lg lg:text-xl text-gray-700 mb-8 lg:mb-10 max-w-lg mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Vintage Bollywood meets modern streetwear. Express your love for classic cinema with premium quality tees.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <Link
                  to="/products"
                  className="inline-block bg-[#D2691E] text-white px-10 py-4 text-lg font-bold rounded-xl hover:bg-[#A0522D] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
                >
                  SHOP NOW
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Featured</h2>
            <div className="w-24 h-1 bg-[#D2691E] mx-auto rounded-full"></div>
          </motion.div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <motion.div 
                  key={index} 
                  className="animate-pulse"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="bg-gray-200 aspect-square rounded-2xl mb-6 shadow-lg"></div>
                  <div className="h-6 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-5 bg-gray-200 rounded-lg w-2/3"></div>
                </motion.div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-6">🎬</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Loading Classic Cinema Collection</h3>
                <p className="text-gray-600 text-lg mb-6">
                  Our vintage Bollywood-inspired designs are being fetched from the studio...
                </p>
                <div className="flex justify-center space-x-2">
                  <div className="w-3 h-3 bg-[#D2691E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-3 bg-[#D2691E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-3 bg-[#D2691E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <p className="text-sm text-gray-500 mt-6">
                  Products will appear once the Printify API connection is established.
                </p>
              </div>
            </motion.div>
          )}

          {featuredProducts.length > 0 && (
            <motion.div 
              className="text-center mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link
                to="/products"
                className="inline-block bg-[#1a4d4d] text-white px-10 py-4 text-lg font-bold rounded-xl hover:bg-[#0f3333] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                View All Products
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}