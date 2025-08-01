import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.tsx';
// import { AVAILABLE_SIZES, COLOR_NAME_TO_HEX, getColorNameFromHex } from "../../constants/productConstants";
import type { CartItem } from '../../types/cart';

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDropdown = ({ isOpen, onClose }: CartDropdownProps) => {
  const { items, removeItem, updateQuantity, total } = useCart();

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-end"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="w-full max-w-md bg-white h-full overflow-auto shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 bg-maroon text-white flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                <h2 className="font-playfair font-bold text-xl">Your Cart</h2>
              </div>
              <button 
                onClick={onClose}
                className="hover:text-saffron transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-grow overflow-auto p-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <ShoppingBag className="h-16 w-16 text-neutral-300 mb-4" />
                  <h3 className="font-playfair text-xl font-bold text-neutral-800 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    Looks like you haven't added any items to your cart yet.
                  </p>
                  <button
                    onClick={onClose}
                    className="btn-primary"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item: CartItem) => (
                    <div 
                      key={item.product.id + '-' + (item.selectedColor || '') + '-' + (item.selectedSize || '')} 
                      className="flex items-center border-b border-neutral-200 pb-4"
                    >
                      <img 
                        src={item.product.images?.[0] || '/placeholder.png'} 
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="ml-4 flex-grow">
                        <h3 className="font-medium text-neutral-800">{item.product.name}</h3>
                        <p className="text-neutral-600 text-sm mt-1">
                          {formatPrice(item.product.price)} x {item.quantity}
                        </p>
                        {/* Show color and size if available */}
                        <div className="text-xs text-neutral-500 mt-1">
                          {item.selectedColorHex && (
                            <span>
                              Color: <span style={{ backgroundColor: item.selectedColorHex }} className="inline-block w-3 h-3 rounded-full align-middle mr-1 border" /> {item.selectedColorName}
                            </span>
                          )}
                          {item.selectedSize && (
                            <span className="ml-2">Size: {item.selectedSize}</span>
                          )}
                        </div>
                        {/* Quantity Control */}
                        <div className="flex items-center mt-2">
                          <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize || '', item.selectedColorHex || '', item.quantity - 1)}
                            className="text-neutral-600 hover:text-maroon transition-colors p-1"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="mx-2 min-w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize || '', item.selectedColorHex || '', item.quantity + 1)}
                            className="text-neutral-600 hover:text-maroon transition-colors p-1"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="ml-2 flex flex-col items-end">
                        <span className="font-semibold text-neutral-800">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.product.id, item.selectedSize || '', item.selectedColorHex || '')}
                          className="text-neutral-400 hover:text-error-500 transition-colors mt-2"
                          aria-label={`Remove ${item.product.name} from cart`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-neutral-200 p-4 bg-neutral-50">
                <div className="flex justify-between mb-4">
                  <span className="font-medium text-neutral-800">Total:</span>
                  <span className="font-bold text-xl text-maroon">
                    {formatPrice(total)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/cart"
                    className="btn-secondary text-center"
                    onClick={onClose}
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    className="btn-primary text-center"
                    onClick={onClose}
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartDropdown;