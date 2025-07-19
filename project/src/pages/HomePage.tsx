import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/product/ProductCard';
import { Product } from '../types';
import { fetchProducts } from '../data/products';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [heroProduct, setHeroProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const data = await fetchProducts();
      
      // Set the first product (most recent) as hero
      if (data.length > 0) {
        setHeroProduct(data[0]);
        // Show next 4 products in featured section
        setProducts(data.slice(1, 5));
      }
      
      setLoading(false);
    }
    loadProducts();
  }, []);

  // Get hero image URL
  const getHeroImage = () => {
    if (!heroProduct) return '/assets/logo_big.png';
    
    // Handle both string and object image formats
    const imageUrl = typeof heroProduct.image === 'string' 
      ? heroProduct.image 
      : heroProduct.image?.src || '/assets/logo_big.png';
    
    return imageUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#f5e6d3] py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              {loading ? (
                <div className="w-full max-w-md mx-auto aspect-square bg-gray-200 animate-pulse rounded-lg" />
              ) : (
                <div className="relative group cursor-pointer">
                  <Link to={heroProduct ? `/product/${heroProduct.id}` : '/shop'}>
                    <img
                      src={getHeroImage()}
                      alt={heroProduct?.name || 'Featured T-shirt'}
                      className="w-full max-w-md mx-auto rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/logo_big.png';
                      }}
                    />
                    {heroProduct && (
                      <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-sm font-medium text-gray-900 truncate">{heroProduct.name}</p>
                        <p className="text-lg font-bold text-gray-900">
                          ${heroProduct.variants[0]?.price || heroProduct.price}
                        </p>
                      </div>
                    )}
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 lg:order-2 text-center lg:text-left"
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Wear the<br />
                Cult Classics.
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                {heroProduct ? `Featuring: ${heroProduct.name}` : 'Exclusive Bollywood-inspired designs'}
              </p>
              <Link
                to="/shop"
                className="inline-block bg-yellow-500 text-gray-900 font-semibold px-8 py-3 rounded hover:bg-yellow-400 transition duration-300"
              >
                SHOP NOW
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No featured products available</p>
          )}
        </div>
      </section>
    </div>
  );
}