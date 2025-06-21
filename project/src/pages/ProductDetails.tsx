// project/src/pages/ProductDetails.tsx

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { fetchProducts } from '../data/products'
import type { Product } from '../services/printify'
import type { CartItem } from '../types/cart'

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL']

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
        const found = all.find((p) => String(p.id) === String(id)) || null
        if (found) {
          setProduct(found)
          setMainImage(found.images?.[0] || '')
          setSelectedColor(found.colors?.[0] || '')
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
    <div className="container-custom py-16 flex flex-col lg:flex-row gap-12">
      {/* LEFT: Main Image and Thumbnails */}
      <div className="flex flex-col items-center w-full lg:w-1/2">
        <div className="w-full max-w-md aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-4">
          <motion.img
            src={mainImage}
            alt={product.name}
            className="object-cover w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex flex-row gap-2 mt-2">
          {product.images?.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${product.name} ${i + 1}`}
              className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                mainImage === src ? 'border-maroon' : 'border-gray-300'
              }`}
              onClick={() => setMainImage(src)}
            />
          ))}
        </div>
        {/* Color Swatches below image */}
        <div className="flex items-center space-x-1 mt-6 min-h-[28px]">
          {product.colors?.slice(0, 5).map((hex) => (
            <span
              key={hex}
              className={`w-7 h-7 rounded-full border-2 cursor-pointer ${
                selectedColor === hex ? 'border-maroon' : 'border-gray-300'
              }`}
              style={{ backgroundColor: hex }}
              title={hex}
              onClick={() => setSelectedColor(hex)}
            />
          ))}
          {product.colors && product.colors.length > 5 && (
            <span className="ml-1 text-xs text-neutral-600 font-semibold">
              +{product.colors.length - 5}
            </span>
          )}
        </div>
      </div>

      {/* RIGHT: Details */}
      <div className="flex-1 flex flex-col justify-center space-y-6">
        {/* Name */}
        <h1 className="font-playfair text-3xl text-maroon text-left">
          {product.name}
        </h1>
        {/* Price */}
        <p className="text-2xl font-bold text-neutral-900 text-left">
          {typeof product.price === 'number'
            ? `$${product.price.toFixed(2)}`
            : product.price}
        </p>

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
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              –
            </button>
            <span className="px-4">{quantity}</span>
            <button
              className="px-3 py-1"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            className="bg-maroon text-white px-6 py-2 rounded hover:bg-maroon/90 transition"
            onClick={() => {
              const cartItem: CartItem = {
                ...product,
                selectedColor,
                selectedSize,
                quantity,
              }
              addToCart(cartItem)
            }}
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
