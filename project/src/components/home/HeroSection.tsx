import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
          {/* Left side - Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center lg:justify-start order-2 lg:order-1"
          >
            <div className="relative">
              <img
                src="/assets/hero-shirt.png"
                alt="Featured Bollywood T-shirt"
                className="w-full max-w-md h-auto object-contain drop-shadow-2xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/assets/logo_big.png';
                }}
              />
            </div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left order-1 lg:order-2"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Bollywood
              <br />
              Style Redefined
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Express your love for Bollywood with our premium collection of iconic t-shirts. 
              From classic dialogues to legendary characters, wear your passion with pride.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/shop"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Shop Collection
              </Link>
              <Link
                to="/about"
                className="border-2 border-orange-500 text-orange-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-500 hover:text-white transform hover:scale-105 transition-all duration-300"
              >
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
