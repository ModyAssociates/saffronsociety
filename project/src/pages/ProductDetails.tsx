import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Info } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { Product } from '../types';
import { fetchProducts } from '../data/products.ts';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      const products = await fetchProducts();
      const foundProduct = products.find(p => p.id === id);
      setProduct(foundProduct || null);
      setLoading(false);
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container-custom py-16">
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-16">
        <h1 className="text-2xl font-bold text-maroon">Product not found</h1>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 flex items-center text-neutral-700 hover:text-maroon transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="container-custom py-16">
      <button
        onClick={() => navigate('/products')}
        className="mb-8 flex items-center text-neutral-700 hover:text-maroon transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-maroon mb-4">
            {product.name}
          </h1>
          <p className="text-neutral-700 mb-6">{product.description}</p>
          
          <div className="mb-8">
            <span className="text-2xl font-bold text-maroon">${product.price}</span>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                addToCart(product);
                navigate('/cart');
              }}
              className="w-full bg-saffron hover:bg-opacity-90 text-neutral-900 py-4 px-8 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center space-x-3"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>

            <Link 
              to="/shirt-quality" 
              className="flex items-center justify-center text-neutral-700 hover:text-maroon transition-colors"
            >
              <Info className="h-4 w-4 mr-1" />
              Shirt Quality Information
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;