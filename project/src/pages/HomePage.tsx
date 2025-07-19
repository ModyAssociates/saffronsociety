import { useState, useEffect } from 'react';
import ProductCard from '../components/product/ProductCard';
import HeroSection from '../components/home/HeroSection';
import { Product } from '../types';
import { fetchPrintifyProducts } from '../services/printify';
import { fetchProducts as fetchFallbackProducts } from '../data/products';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [heroProduct, setHeroProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        // First try to fetch from Printify API via Netlify function
        let data = await fetchPrintifyProducts();
        
        // If no products returned, use fallback mock data
        if (!data || data.length === 0) {
          console.log('[HomePage] No products from API, using fallback data');
          data = await fetchFallbackProducts();
        }
        
        // Set the first product (most recent) as hero
        if (data.length > 0) {
          setHeroProduct(data[0]);
          // Show next 4 products in featured section
          setProducts(data.slice(1, 5));
        }
      } catch (error) {
        console.error('[HomePage] Error loading products:', error);
        // On error, use fallback data
        const fallbackData = await fetchFallbackProducts();
        if (fallbackData.length > 0) {
          setHeroProduct(fallbackData[0]);
          setProducts(fallbackData.slice(1, 5));
        }
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection heroProduct={heroProduct} loading={loading} />

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