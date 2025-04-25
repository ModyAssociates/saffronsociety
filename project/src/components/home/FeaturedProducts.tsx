import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Product } from '../../services/printify';
import { getFeaturedProducts } from '../../data/products';
import { useEffect, useState } from 'react';

const FeaturedProducts = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ;(async () => {
      try {
        const featured = await getFeaturedProducts();
        setProducts(featured);
      } catch (err) {
        console.error('FeaturedProducts load error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center">
            <p>Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container-custom">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-playfair text-4xl text-maroon mb-8 text-center"
        >
          New Arrivals
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {/* IMAGE CARD */}
              <div
                onClick={() => navigate(`/products/${product.id}`)}
                className="relative overflow-hidden rounded-xl shadow-lg group"
              >
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
                <h3
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="font-medium text-gray-800 hover:text-maroon transition-colors"
                >
                  {product.name}
                </h3>

                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl font-semibold text-maroon">
                    ${product.price.toFixed(2)}
                  </span>
                </div>

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

export default FeaturedProducts;
