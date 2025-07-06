// project/src/pages/ProductPage.tsx

import { useState, useEffect } from 'react'
import { fetchProducts } from '../data/products'
import { Product } from '../services/printify'
import ProductCard from '../components/product/ProductCard'

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await fetchProducts()
        setProducts(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
        setProducts([])
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              isBestSeller={i < 3} // Mark first 3 products as best sellers
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductPage
