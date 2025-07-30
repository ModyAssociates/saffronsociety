import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import type { CartItem } from '../types/cart';

const CartPage = () => {
  const { items, removeItem, updateQuantity, total } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };


  if (items.length === 0) {
    return (
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto text-center"
        >
          <ShoppingBag className="h-16 w-16 mx-auto text-neutral-300 mb-6" />
          <h1 className="font-playfair text-3xl font-bold text-maroon mb-4">
            Your cart is empty
          </h1>
          <p className="text-neutral-700 mb-8">
            Looks like you haven't added any items to your cart yet.
            Browse our collection to find the perfect Bollywood-inspired tee for you.
          </p>
          <Link to="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-playfair text-3xl font-bold text-maroon">Your Cart</h1>
          <Link to="/products" className="flex items-center text-neutral-700 hover:text-maroon transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Headers (Desktop) */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-2 border-b border-neutral-200 text-neutral-500 font-medium">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Cart Items */}
            {items.map((item: CartItem) => (
              <motion.div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColorHex || item.selectedColorName || 'no-color'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-4 border-b border-neutral-200"
              >
                {/* Product */}
                <div className="col-span-6 flex items-center">
                  <img
                    src={item.product.images?.[0] || '/placeholder.png'}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.product.name}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Color:
                        <span className="inline-block w-4 h-4 rounded-full ml-1 mr-1 border border-gray-300" style={{ backgroundColor: item.selectedColorHex }}></span>
                        {item.selectedColorName && (
                          <span className="ml-1 text-xs text-neutral-700 font-medium">{item.selectedColorName}</span>
                        )}
                      </span>
                      <span>Size: {item.selectedSize}</span>
                    </div>
                  </div>
                </div>

                {/* Price (Desktop) */}
                <div className="hidden md:block col-span-2 text-center text-neutral-800 font-medium">
                  {formatPrice(item.price ?? item.product.price)}
                </div>

                {/* Quantity */}
                <div className="col-span-2">
                  <div className="flex items-center justify-center border border-neutral-200 rounded-md max-w-32 mx-auto">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.selectedSize || '', item.selectedColorHex || '', item.quantity - 1)}
                      className="text-neutral-600 hover:text-maroon transition-colors p-2"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="mx-3">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.selectedSize || '', item.selectedColorHex || '', item.quantity + 1)}
                      className="text-neutral-600 hover:text-maroon transition-colors p-2"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="col-span-2 flex items-center justify-between md:justify-end">
                  <span className="font-semibold text-maroon">
                    {formatPrice((item.price ?? item.product.price) * item.quantity)}
                  </span>
                  {/* Delete Button (Desktop) */}
                  <button
                    onClick={() => {
                      removeItem(item.product.id, item.selectedSize || '', item.selectedColorHex || '');
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-playfair text-xl font-bold text-neutral-800 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="text-neutral-800 font-medium">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="text-neutral-800 font-medium">Free</span>
                </div>
                <div className="pt-3 border-t border-neutral-200 flex justify-between">
                  <span className="font-medium text-neutral-800">Total</span>
                  <span className="font-bold text-xl text-maroon">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="btn-primary w-full text-center"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CartPage;