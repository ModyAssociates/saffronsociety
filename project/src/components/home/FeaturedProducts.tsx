import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { Product } from '../../services/printify.ts';
import { getFeaturedProducts } from '../../data/products.tsx';
import { useEffect, useState } from 'react';

const FeaturedProducts = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const featured = await getFeaturedProducts();
        setProducts(featured);
      } catch (err) {
        console.error('FeaturedProducts load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
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
        {/* ... header omitted for brevity ... */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              /* animation props */
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
                  /* styling omitted */
                >
                  <ShoppingBag className="h-5 w-5" />
                </button>
              </div>

              <div
                onClick={() => navigate(`/products/${product.id}`)}
                className="cursor-pointer"
              >
                <h3 className="font-medium text-neutral-800 mb-1 group-hover:text-maroon transition-colors">
                  {product.name}
                </h3>
                {/* plain text description */}
                <p className="text-neutral-600 text-sm mb-2">
                  {product.description}
                </p>
                <span className="text-maroon font-semibold">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
