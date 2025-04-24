import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import femaleModel from '../../assets/female-model.png';
import maleModel   from '../../assets/male-model.png';

const Hero = () => {
  return (
    <section className="bg-off-white py-10 md:py-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 md:order-1"
          >
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-maroon leading-tight mb-4">
              Celebrate Iconic Bollywood
            </h1>
            <p className="text-lg md:text-xl text-neutral-700 mb-8">
              Limited edition tees inspired by legendary films.
            </p>
            <Link to="/products" className="btn-primary">
              Shop Now
            </Link>
          </motion.div>

          {/* Image Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 md:order-2 relative h-[500px]"
          >
            <motion.div
              initial={{ y: 40, opacity: 0, rotate: -5 }}
              animate={{ y: 0, opacity: 1, rotate: -5 }}
              transition={{ 
                duration: 0.7, 
                delay: 0.3,
                bounce: 0.4,
                type: "spring"
              }}
              whileHover={{ 
                scale: 1.05, 
                rotate: 0,
                transition: { duration: 0.3 } 
              }}
              className="absolute top-0 left-0 w-2/3 rounded-lg overflow-hidden shadow-lg bg-white p-4 z-10"
            >
              <img
                src={femaleModel}
                alt="Female model wearing Bollywood t-shirt"
                className="w-full h-auto object-cover rounded"
              />
            </motion.div>
            
            <motion.div
              initial={{ y: 60, opacity: 0, rotate: 5 }}
              animate={{ y: 100, opacity: 1, rotate: 5 }}
              transition={{ 
                duration: 0.7, 
                delay: 0.5,
                bounce: 0.4,
                type: "spring"
              }}
              whileHover={{ 
                scale: 1.05, 
                rotate: 0,
                transition: { duration: 0.3 } 
              }}
              className="absolute top-0 right-0 w-2/3 rounded-lg overflow-hidden shadow-lg bg-white p-4"
            >
              <img
                src={maleModel}
                alt="Male model wearing Bollywood t-shirt"
                className="w-full h-auto object-cover rounded"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;