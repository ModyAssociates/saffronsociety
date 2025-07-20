import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Smooth transition section */}
      <div className="relative -mt-20 z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-50 to-[#ffe4cc]"></div>
        <div className="relative h-32"></div>
      </div>

      {/* Featured Products Section with gradient background */}
      <section className="relative bg-gradient-to-b from-[#ffe4cc] to-[#fff0e5] pb-20">
        <FeaturedProducts />
      </section>
    </div>
  );
};

export default HomePage;