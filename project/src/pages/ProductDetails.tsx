// project/src/pages/ProductDetails.tsx

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { fetchProducts } from '../data/products'
import { Product } from '../services/printify'

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL']  // stub; swap if dynamic

const ProductDetails = () => {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>(AVAILABLE_SIZES[0])
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    ;(async () => {
      try {
        const all = await fetchProducts()
        const found = all.find((p) => p.id === id) || null
        if (found) {
          setProduct(found)
          setMainImage(found.images[0])
          setSelectedColor(found.colors[0] || '')
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) {
    return <p className="text-center py-16">Loading…</p>
  }
  if (!product) {
    return <p className="text-center py-16">Product not found.</p>
  }

  return (
    <div className="container-custom py-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* LEFT: Thumbnails + Main Image */}
      <div className="flex">
        <div className="flex flex-col space-y-2 overflow-y-auto pr-2">
          {product.images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${product.name} ${i + 1}`}
              className="w-20 h-20 object-cover rounded cursor-pointer border-2"
              onClick={() => setMainImage(src)}
            />
          ))}
        </div>
        <motion.img
          src={mainImage}
          alt={product.name}
          className="flex-1 object-cover rounded-lg shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* RIGHT: Details */}
      <div className="space-y-6">
        {/* Name & Price */}
        <h1 className="font-playfair text-3xl text-maroon">
          {product.name}
        </h1>
        <p className="text-2xl font-semibold">${product.price.toFixed(2)}</p>

        {/* Color Selector */}
        <div>
          <h3 className="font-medium mb-2">Color</h3>
          <div className="flex items-center space-x-3">
            {product.colors.length > 0 ? (
              product.colors.map((hex) => (
                <button
                  key={hex}
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedColor === hex
                      ? 'border-maroon'
                      : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: hex }}
                  onClick={() => setSelectedColor(hex)}
                />
              ))
            ) : (
              <span className="text-gray-500">No colors available</span>
            )}
          </div>
        </div>

        {/* Size Selector */}
        <div>
          <h3 className="font-medium mb-2">Size</h3>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SIZES.map((sz) => (
              <button
                key={sz}
                className={`px-3 py-1 border rounded ${
                  selectedSize === sz
                    ? 'border-maroon bg-maroon/10'
                    : 'border-gray-300'
                }`}
                onClick={() => setSelectedSize(sz)}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity + Add to Cart */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center border rounded">
            <button
              className="px-3 py-1"
              onClick={() =>
                setQuantity((q) => Math.max(1, q - 1))
              }
            >
              –
            </button>
            <span className="px-4">{quantity}</span>
            <button
              className="px-3 py-1"
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>
          <button
            className="bg-maroon text-white px-6 py-2 rounded hover:bg-maroon/90 transition"
            onClick={() =>
              addToCart({
                ...product,
                // if your cart context accepts size & color, pass them here:
                // selectedColor,
                // selectedSize,
                // quantity,
              })
            }
          >
            Add to Cart
          </button>
        </div>

        {/* Description */}
        <div>
          <h3 className="font-medium mb-2">About this product</h3>
          <p className="text-neutral-700">{product.description}</p>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
