import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Filter } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { fetchProducts } from '../data/products'
import { Product } from '../services/printify'

const ProductPage = () => {
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const all = await fetchProducts()
        setProducts(all)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const categories = ['all', ...new Set(products.map((p) => p.category))]
  const filtered =
    selectedCategory && selectedCategory !== 'all'
      ? products.filter((p) => p.category === selectedCategory)
      : products

  if (loading) {
    return <p className="text-center py-16">Loading…</p>
  }
  if (filtered.length === 0) {
    return (
      <p className="text-center py-16">No products found in this category</p>
    )
  }

  return (
    <section className="py-8 md:py-12">
      <div className="container-custom">
        {/* Header & filters omitted for brevity */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="group cursor-pointer"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              {/* MAIN IMAGE */}
              <div className="relative overflow-hidden rounded-xl shadow-lg">
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
                <h2 className="font-medium text-neutral-800 mb-1 group-hover:text-maroon transition-colors">
                  {product.name}
                </h2>
                <p className="text-maroon font-semibold">
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

export default ProductPage
