import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About Saffron Society</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-gray-700">
              Welcome to Saffron Society, where we celebrate the magic of Bollywood through unique, 
              high-quality t-shirt designs inspired by cult classic films and iconic moments from Indian cinema.
            </p>

            <section className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-700">
                Born from a love of Bollywood's golden era and its timeless characters, Saffron Society 
                brings you wearable art that captures the essence of Indian cinema. Each design is carefully 
                crafted to pay homage to the films that shaped our culture and continue to inspire generations.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700">
                We believe that fashion should tell a story. Our mission is to create clothing that not only 
                looks great but also connects you to the rich tapestry of Bollywood history. From the haunting 
                melodies of "Bhoot Bangla" to the comedic genius of "Andaz Apna Apna," each t-shirt is a 
                conversation starter and a piece of cinema history.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quality & Sustainability</h2>
              <p className="text-gray-700">
                All our products are printed on-demand using eco-friendly materials and processes. We partner 
                with Printify to ensure high-quality prints that last, while minimizing waste and environmental impact.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Join the Society</h2>
              <p className="text-gray-700">
                Whether you're a die-hard Bollywood fan or simply appreciate unique design, Saffron Society 
                has something for you. Wear your favorite films, share your passion, and become part of our 
                growing community of cinema enthusiasts.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
