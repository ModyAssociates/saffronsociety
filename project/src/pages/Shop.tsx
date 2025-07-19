import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/product/ProductCard';
import { Product } from '../types';
import { fetchPrintifyProducts } from '../services/printify';
import { fetchProducts as fetchFallbackProducts } from '../data/products';
import { Loader2 } from 'lucide-react';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError(null);
      
      try {
        // First try to fetch from Printify API via Netlify function
        let data = await fetchPrintifyProducts();
        
        // If no products returned, use fallback mock data
        if (!data || data.length === 0) {
          console.log('[Shop] No products from API, using fallback data');
          data = await fetchFallbackProducts();
        }
        
        setProducts(data);
      } catch (err) {
        console.error('[Shop] Error loading products:', err);
        setError('Failed to load products');
        
        // On error, try to use fallback data
        try {
          const fallbackData = await fetchFallbackProducts();
          setProducts(fallbackData);
          setError(null); // Clear error if fallback succeeds
        } catch (fallbackErr) {
          console.error('[Shop] Fallback also failed:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Shop All Products</h1>
          
          {loading && (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          )}
          
          {error && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          {!loading && products.length === 0 && !error && (
            <div className="text-center py-12">
              <p className="text-gray-600">No products available at the moment.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}