import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Filter } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
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

  const categories = ['all', ...new Set(products.map(product => product.category))];
  
  const filteredProducts = selectedCategory && selectedCategory !== 'all'
    ? products.filter(product => product.category === selectedCategory)
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
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="font-playfair text-4xl font-bold text-maroon mb-4">
            Bollywood Collection
          </h1>
          <p className="text-neutral-700 max-w-2xl mx-auto">
            Explore our unique collection of t-shirts featuring iconic vintage Bollywood movie designs.
            Each piece is crafted with premium fabric and vibrant prints.
          </p>
        </motion.div>

        {/* Filter Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category === 'all' ? null : category)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    (category === 'all' && !selectedCategory) || selectedCategory === category
                      ? 'bg-maroon text-white'
                      : 'bg-white text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="flex items-center px-4 py-2 bg-white rounded-md shadow-sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Mobile Filters */}
        {isMobileFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 md:hidden overflow-x-auto whitespace-nowrap pb-2 no-scrollbar"
          >
            <div className="flex space-x-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category === 'all' ? null : category);
                    setIsMobileFilterOpen(false);
                  }}
                  className={`px-4 py-2 rounded-md whitespace-nowrap ${
                    (category === 'all' && !selectedCategory) || selectedCategory === category
                      ? 'bg-maroon text-white'
                      : 'bg-white text-neutral-700'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
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
              
              <div onClick={() => navigate(`/products/${product.id}`)} className="cursor-pointer">
                <h2 className="font-medium text-neutral-800 mb-1 group-hover:text-maroon transition-colors">
                  {product.name}
                </h2>
                <p className="text-neutral-600 text-sm mb-2">{product.description}</p>
                <span className="text-maroon font-semibold">${product.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;