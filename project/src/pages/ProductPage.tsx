import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Filter } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../data/products';
import { Product } from '../services/printify';

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

  const categories = ['all', ...new Set(products.map((p) => p.category))];
  const filtered =
    selectedCategory && selectedCategory !== 'all'
      ? products.filter((p) => p.category === selectedCategory)
      : products;

  if (loading) {
    return (
      <div className="py-8 md:py-12">
        <div className="container-custom text-center">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 md:py-12">
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
            Explore our unique collection of t-shirts featuring iconic vintage
            Bollywood movie designs.
          </p>
        </motion.div>

        {/* Filter Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="hidden md:flex space-x-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(
                    category === 'all' ? null : category
                  )
                }
                className={`px-4 py-2 rounded-md transition-colors ${
                  (!selectedCategory && category === 'all') ||
                  selectedCategory === category
                    ? 'bg-maroon text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {category.charAt(0).toUpperCase() +
                  category.slice(1)}
              </button>
            ))}
          </div>
          <button
            className="md:hidden flex items-center px-4 py-2 bg-white rounded-md shadow-sm"
            onClick={() => setIsMobileFilterOpen((o) => !o)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>

        {/* Mobile Filters */}
        {isMobileFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 overflow-x-auto whitespace-nowrap no-scrollbar"
          >
            <div className="flex space-x-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(
                      category === 'all' ? null : category
                    );
                    setIsMobileFilterOpen(false);
                  }}
                  className={`px-4 py-2 rounded-md whitespace-nowrap ${
                    (!selectedCategory && category === 'all') ||
                    selectedCategory === category
                      ? 'bg-maroon text-white'
                      : 'bg-white text-neutral-700'
                  }`}
                >
                  {category.charAt(0).toUpperCase() +
                    category.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group cursor-pointer"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              {/* IMAGE */}
              <div className="relative overflow-hidden rounded-xl shadow-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingBag className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* INFO */}
              <div className="mt-4">
                <h2 className="font-medium text-neutral-800 mb-1 group-hover:text-maroon transition-colors">
                  {product.name}
                </h2>
                <span className="text-maroon font-semibold">
                  ${product.price.toFixed(2)}
                </span>

                {/* COLOR SWATCHES */}
                <div className="flex items-center space-x-2 mt-3">
                  {product.colors.map((hex) => (
                    <span
                      key={hex}
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
