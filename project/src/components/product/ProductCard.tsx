import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const firstVariant = product.variants[0];
  const displayImage = typeof product.image === 'string' ? product.image : product.image?.src || '/assets/logo_big.png';

  return (
    <motion.div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/product/${product.id}`} className="block group">
        <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          {/* Product Image */}
          <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
            <img
              src={imageError ? '/assets/logo_big.png' : displayImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
            
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.button
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Add to wishlist"
              >
                <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
              </motion.button>
              
              <motion.button
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Quick view"
              >
                <Eye className="w-4 h-4 text-gray-600 hover:text-[#D2691E]" />
              </motion.button>
            </div>

            {/* Quick Add Button */}
            <motion.button
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#D2691E] text-white px-6 py-2 rounded-full font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#A0522D] shadow-lg"
              initial={{ y: 20 }}
              animate={{ y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="w-4 h-4 inline mr-2" />
              Quick Add
            </motion.button>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-[#1a4d4d] transition-colors duration-200">
              {product.name}
            </h3>
            <p className="text-lg font-semibold text-gray-900">
              ${firstVariant?.price || product.price}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}