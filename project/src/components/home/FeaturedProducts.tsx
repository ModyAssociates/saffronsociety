// project/src/components/home/FeaturedProducts.tsx

import { Product } from '../../services/printify'
import { getFeaturedProducts } from '../../data/products'
import { useEffect, useState } from 'react'
import ProductCard from '../product/ProductCard'

const FeaturedProducts = () => {
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
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              isBestSeller={i < 2} // Mark first 2 products as best sellers
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
