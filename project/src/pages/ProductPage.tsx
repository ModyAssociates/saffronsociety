import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Filter } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../data/products';
import { Product } from '../types';

const ProductPage = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const allProducts = await fetchProducts();
      setProducts(allProducts);
      setLoading(false);
    };
    loadProducts();
  }, []);

  const categories = ['all', ...new Set(products.map(p => p.category))];
  const filtered = selectedCategory && selectedCategory !== 'all'
    ? products.filter(p => p.category === selectedCategory)
    : products;

  if (loading) {
    return (
      <div className="py-8 md:py-12">
        <div className="container-custom">
          <div className="text-center">
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <div className="container-custom">
        {/* Header & Filters omitted for brevity */}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group"
            >
              <div 
                className="aspect-[3/4] mb-4 bg-neutral-100 overflow-hidden cursor-pointer relative"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-neutral-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingBag className="h-5 w-5" />
                </button>
              </div>
              
              <div
                onClick={() => navigate(`/products/${product.id}`)}
                className="cursor-pointer"
              >
                <h2 className="font-medium text-neutral-800 mb-1 group-hover:text-maroon transition-colors">
                  {product.name}
                </h2>
                <span className="text-maroon font-semibold">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
