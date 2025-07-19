import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmation() {
  const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-4 text-center"
      >
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
        <p className="text-lg text-gray-700 mb-8">
          Thank you for your order. We've sent a confirmation email with your order details.
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <p className="text-gray-600 mb-2">Order number:</p>
          <p className="text-2xl font-semibold text-gray-900">#{orderNumber}</p>
        </div>

        <div className="space-y-4">
          <Link
            to="/shop"
            className="inline-block bg-orange-500 text-white font-semibold px-6 py-3 rounded-md hover:bg-orange-600 transition-colors"
          >
            Continue Shopping
          </Link>
          <p className="text-sm text-gray-600">
            You will receive an email confirmation shortly.
          </p>
        </div>
      </motion.div>
    </div>
  );
}