import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

const CheckoutPage = () => {
  const { state, clearCart } = useCart();
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsOrderComplete(true);
      clearCart();
    }, 1500);
  };

  if (isOrderComplete) {
    return (
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto text-center"
        >
          <CheckCircle className="h-16 w-16 mx-auto text-success-500 mb-6" />
          <h1 className="font-playfair text-3xl font-bold text-maroon mb-4">
            Order Confirmed!
          </h1>
          <p className="text-neutral-700 mb-8">
            Thank you for your purchase! Your order has been confirmed and will be shipped shortly.
            We've sent a confirmation email with all the details.
          </p>
          <Link to="/" className="btn-primary">
            Back to Home
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
          <h1 className="font-playfair text-3xl font-bold text-maroon">Checkout</h1>
          <Link to="/cart" className="flex items-center text-neutral-700 hover:text-maroon transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              {/* Contact Information */}
              <div className="mb-8">
                <h2 className="font-playfair text-xl font-bold text-neutral-800 mb-4">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-neutral-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-neutral-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="mb-8">
                <h2 className="font-playfair text-xl font-bold text-neutral-800 mb-4">
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-neutral-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      required
                      className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-neutral-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      required
                      className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-neutral-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      required
                      className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-neutral-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      required
                      className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon"
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-neutral-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      required
                      className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="country" className="block text-neutral-700 mb-1">
                      Country
                    </label>
                    <select
                      id="country"
                      required
                      className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon"
                    >
                      <option value="">Select a country</option>
                      <option value="US">United States</option>
                      <option value="IN">India</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h2 className="font-playfair text-xl font-bold text-neutral-800 mb-4">
                  Payment Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardName" className="block text-neutral-700 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      required
                      className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon"
                    />
                  </div>
                  <div className="relative">
                    <label htmlFor="cardNumber" className="block text-neutral-700 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="cardNumber"
                        placeholder="0000 0000 0000 0000"
                        required
                        className="w-full p-2 pl-10 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon"
                      />
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expDate" className="block text-neutral-700 mb-1">
                        Expiration Date
                      </label>
                      <input
                        type="text"
                        id="expDate"
                        placeholder="MM/YY"
                        required
                        className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-neutral-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        placeholder="123"
                        required
                        className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-playfair text-xl font-bold text-neutral-800 mb-4">
                Order Summary
              </h2>

              <div className="max-h-60 overflow-y-auto mb-6 space-y-3">
                {state.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-neutral-100">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="ml-3">
                        <p className="text-neutral-800 font-medium">{item.name}</p>
                        <p className="text-neutral-600 text-sm">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-neutral-800 font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="text-neutral-800 font-medium">{formatPrice(state.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="text-neutral-800 font-medium">Free</span>
                </div>
                <div className="pt-3 border-t border-neutral-200 flex justify-between">
                  <span className="font-medium text-neutral-800">Total</span>
                  <span className="font-bold text-xl text-maroon">{formatPrice(state.totalAmount)}</span>
                </div>
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isProcessing}
                className="btn-primary w-full text-center flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Complete Purchase'
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutPage;