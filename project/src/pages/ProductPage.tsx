import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Filter } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../data/products';
import { Product } from '../services/printify';   // ← import from services

const ProductPage = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const all = await fetchProducts();
        console.log('🛒 All products:', all);
        setProducts(all);
      } catch (err) {
        console.error('ProductPage load error:', err);
      } finally {
        setLoading(false);
      }
    })();
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
          <p>Loading products…</p>
        </div>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="py-8 md:py-12">
        <div className="container-custom text-center">
          <p>No products found in this category.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 md:py-12">
      <div className="container-custom">
        {/* Header & Filters omitted for brevity */}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
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
                  {product.colors.length > 0 ? (
                    product.colors.map((hex) => ( 
                      <span
                        key={hex}
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: hex }}
                      />
                    ))
                  ) : (
                    <span className="text-sm text-neutral-500">
                      No color data
                    </span>
                  )}
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
