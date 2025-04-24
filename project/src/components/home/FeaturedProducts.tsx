import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';
import { getFeaturedProducts } from '../../data/products';
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-maroon mb-4">
            New Arrivals
          </h2>
          <p className="text-neutral-700 max-w-2xl mx-auto">
            Our latest collection features iconic designs from some of Bollywood's most legendary films.
            Each t-shirt tells a unique story from Indian cinema history.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
                <h3 className="font-medium text-neutral-800 mb-1 group-hover:text-maroon transition-colors">
                  {product.name}
                </h3>
                <p className="text-neutral-600 text-sm mb-2">{product.description}</p>
                <span className="text-maroon font-semibold">${product.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
