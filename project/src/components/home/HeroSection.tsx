import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, Sparkles } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-bollywood">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-paisley opacity-5"></div>
      
      {/* Background Images */}
      <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-8 opacity-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="aspect-card bg-neutral-300 rounded-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.8 }}
          />
        ))}
      </div>
      
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          {/* Left Side - Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-montserrat text-neutral-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Sparkles className="w-4 h-4 text-saffron-500" />
              New Collection Available
            </motion.div>
            
            {/* Main Heading */}
            <div className="space-y-4">
              <motion.h1
                className="text-hero text-neutral-900 leading-none"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="text-accent text-3xl md:text-4xl lg:text-5xl block mb-2">
                  Vintage Bollywood
                </span>
                <span className="text-gradient block">
                  Meets Modern
                </span>
                <span className="block">Hustle</span>
              </motion.h1>
              
              <motion.p
                className="text-lg md:text-xl text-neutral-700 max-w-xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Discover streetwear that tells your story. From retro-fusion designs 
                to bold cultural expressions, every piece is crafted for the modern 
                individual who honors the past while creating the future.
              </motion.p>
            </div>
            
            {/* Social Proof */}
            <motion.div
              className="flex items-center gap-6 text-sm text-neutral-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-saffron-400 to-maroon-500 border-2 border-white"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span className="font-montserrat font-medium">2,500+ Happy Customers</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-saffron-500 fill-current" />
                  ))}
                </div>
                <span className="font-montserrat font-medium">4.9/5 Reviews</span>
              </div>
            </motion.div>
            
            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <button className="btn-primary btn-lg group">
                <span>Shop Collection</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button className="btn-outline btn-lg">
                View Lookbook
              </button>
            </motion.div>
            
            {/* Features */}
            <motion.div
              className="grid grid-cols-3 gap-4 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {[
                { label: 'Premium Quality', value: '100%' },
                { label: 'Eco-Friendly', value: 'Organic' },
                { label: 'Free Shipping', value: '$50+' },
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-playfair font-bold text-neutral-900">
                    {feature.value}
                  </div>
                  <div className="text-sm text-neutral-600 font-montserrat">
                    {feature.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Right Side - Lifestyle Images */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              {/* Main Image */}
              <motion.div
                className="col-span-2 aspect-card rounded-2xl overflow-hidden shadow-large hover-lift"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/src/assets/male-model.png"
                  alt="Stylish streetwear model showcasing vintage-inspired design"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </motion.div>
              
              {/* Secondary Images */}
              <motion.div
                className="aspect-card rounded-xl overflow-hidden shadow-medium hover-lift"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/src/assets/female-model.png"
                  alt="Modern streetwear collection piece"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <motion.div
                className="aspect-card rounded-xl overflow-hidden shadow-medium hover-lift"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/src/assets/male-model-2.png"
                  alt="Heritage-inspired streetwear design"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
            
            {/* Floating Elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-20 h-20 bg-saffron-400 rounded-full blur-xl opacity-30"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <motion.div
              className="absolute -bottom-8 -left-8 w-32 h-32 bg-maroon-400 rounded-full blur-xl opacity-20"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-neutral-400 rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="w-1 h-3 bg-neutral-600 rounded-full mt-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
