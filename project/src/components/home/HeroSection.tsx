import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { fetchPrintifyProducts } from '../../services/printify';
import type { Product } from '../../types';

const HeroSection: React.FC = () => {
  const [latestProduct, setLatestProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLatestProduct = async () => {
      try {
        const products = await fetchPrintifyProducts();
        if (products && products.length > 0) {
          // Get the latest product (assuming they're ordered by creation date)
          setLatestProduct(products[0]);
        }
      } catch (error) {
        console.error('Failed to load latest product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLatestProduct();
  }, []);

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-visible bg-gradient-to-br from-orange-100 to-orange-200 py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Featured Product */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative flex justify-center items-center py-8"
          >
            <div className="relative group max-w-xs mx-auto">
              {/* Product Card matching featured section style */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 border border-white/40 transform group-hover:scale-[1.02] group-hover:-translate-y-2">
                {loading ? (
                  <div className="w-full h-[280px] bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-600 font-medium text-xs">Loading latest product...</span>
                    </div>
                  </div>
                ) : latestProduct ? (
                  <>
                    {/* Image container */}
                    <div className="aspect-[3/4] bg-transparent relative overflow-hidden">
                      <img
                        src={typeof latestProduct.image === 'string' ? latestProduct.image : latestProduct.image?.src || '/src/assets/logo_big.png'}
                        alt={latestProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500 filter drop-shadow-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/src/assets/logo_big.png';
                        }}
                      />
                      
                      {/* Film Grain Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-orange-50/10 mix-blend-overlay"></div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-3 bg-gradient-to-r from-white/90 to-orange-50/80 backdrop-blur-sm text-center">
                      <h3 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-orange-700 transition-colors duration-200 uppercase tracking-wide leading-tight line-clamp-2">
                        {latestProduct.name}
                      </h3>
                      
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <span className="text-xl font-black text-orange-600">
                          ${latestProduct.price}
                        </span>
                        <div className="text-xs font-mono text-gray-500 uppercase">
                          CULT CLASSIC
                        </div>
                      </div>
                      
                      <Link
                        to={`/product/${latestProduct.id}`}
                        className="group/button inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-1.5 rounded-full font-bold text-xs hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-xl border border-white/20 backdrop-blur-sm transform hover:scale-105 hover:-translate-y-1"
                      >
                        <span className="mr-1">VIEW PRODUCT</span>
                        <FiArrowRight className="w-3 h-3 group-hover/button:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-[280px] bg-gradient-to-br from-gray-100/80 to-gray-200/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-lg">📦</span>
                      </div>
                      <span className="text-gray-500 font-medium text-xs">No products available</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Background Glow Effect matching featured cards */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200/40 via-yellow-100/30 to-orange-300/40 rounded-xl blur-xl scale-105 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              
              {/* Enhanced decorative badge */}
              <div className="absolute -top-2 -right-2 z-10">
                <div className="relative bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 rounded-full blur opacity-50"></div>
                  <span className="relative">
                    {loading ? 'Loading...' : '✨ Latest Drop'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Text content */}
          <div className="text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6"
            >
              Wear Cult Classics
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Celebrating Bollywood's Golden Era with Premium Vintage T-Shirts
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                Shop Collection
                <FiArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative Blobs */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full filter blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500 rounded-full filter blur-3xl"
      />
    </section>
  );
};

export default HeroSection;
