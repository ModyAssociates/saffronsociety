import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { Product } from '../../services/printify'
import { getFeaturedProducts } from '../../data/products'
import { useEffect, useState } from 'react'

const FeaturedProducts = () => {
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const featured = await getFeaturedProducts()
        setProducts(featured)
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
    return <p className="text-center py-16">No products to show</p>
  }

  return (
    <section className="py-16">
      <div className="container-custom">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-playfair text-4xl text-maroon mb-8 text-center"
        >
          New Arrivals
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              className="cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              {/* MAIN IMAGE */}
              <div
                onClick={() => navigate(`/products/${product.id}`)}
                className="relative overflow-hidden rounded-xl shadow-lg group"
              >
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
                  className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingBag className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* THUMBNAILS */}
              <div className="flex space-x-2 mt-3 overflow-x-auto">
                {product.images.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                ))}
              </div>

              {/* INFO */}
              <div className="mt-4">
                <h3
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="font-medium text-gray-800 hover:text-maroon transition-colors"
                >
                  {product.name}
                </h3>
                <p className="text-maroon font-semibold mt-1">
                  ${product.price.toFixed(2)}
                </p>

                {/* COLORS */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.colors.length > 0 ? (
                    product.colors.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-1 text-xs bg-neutral-100 rounded"
                      >
                        {c}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">
                      No color data
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
