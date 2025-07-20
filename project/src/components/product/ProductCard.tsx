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
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-200/40 via-yellow-100/30 to-orange-300/40 rounded-xl blur-xl scale-105 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <Link to={`/product/${product.id}`} className="block group relative z-10">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/40 flex flex-col">
          {/* Product Image */}
          <div className="aspect-[4/5] bg-transparent relative overflow-hidden flex-shrink-0">
            <img
              src={imageError ? '/assets/logo_big.png' : displayImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500 filter drop-shadow-lg"
              onError={() => setImageError(true)}
            />
            
            {/* Film Grain Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-orange-50/10 mix-blend-overlay"></div>
            
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
                <Eye className="w-4 h-4 text-gray-600 hover:text-orange-600" />
              </motion.button>
            </div>

            {/* Quick Add Button */}
            <motion.button
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-full font-semibold text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 hover:from-orange-600 hover:to-yellow-600 shadow-xl border border-white/20 backdrop-blur-sm"
              initial={{ y: 20, scale: 0.8 }}
              animate={{ y: isHovered ? 0 : 20, scale: isHovered ? 1 : 0.8 }}
              transition={{ duration: 0.3, ease: "backOut" }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="w-3 h-3 inline mr-1" />
              ADD TO CART
            </motion.button>
          </div>

          {/* Product Info */}
          <div className="p-4 bg-gradient-to-r from-white/90 to-orange-50/80 backdrop-blur-sm rounded-b-xl mt-0 border-t border-white/30 flex-1 flex flex-col">
            <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-700 transition-colors duration-200 uppercase tracking-wide h-10 leading-tight flex items-start">
              {product.name}
            </h3>
            <div className="flex items-center justify-between mt-auto">
              <p className="text-2xl font-black text-orange-600">
                ${firstVariant?.price || product.price}
              </p>
              <div className="text-xs font-mono text-gray-500 uppercase">
                CULT CLASSIC
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}