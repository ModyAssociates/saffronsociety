import { motion } from 'framer-motion'
import { Heart, Palette, Sparkles, Users } from 'lucide-react'

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Quality First',
      description: 'Premium materials and print quality that lasts'
    },
    {
      icon: Palette,
      title: 'Unique Designs',
      description: 'Original artwork created by independent artists'
    },
    {
      icon: Sparkles,
      title: 'Sustainable',
      description: 'Eco-friendly printing and ethically sourced materials'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Supporting artists and creative expression worldwide'
    }
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About Saffron Society
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Where vibrant culture meets contemporary fashion. We're more than just a t-shirt brand - 
            we're a celebration of diversity, creativity, and self-expression.
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-12 items-center mb-20"
        >
          <div>
            <h2 className="text-3xl font-semibold mb-4 text-gray-900">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2024, Saffron Society emerged from a simple idea: fashion should be 
              a canvas for cultural expression and artistic creativity. Our name reflects the 
              rich, vibrant essence of saffron - a spice that has connected cultures for millennia.
            </p>
            <p className="text-gray-600 mb-4">
              We partner with talented artists from around the world to bring you unique designs 
              that tell stories, spark conversations, and celebrate the beautiful tapestry of 
              human creativity.
            </p>
            <p className="text-gray-600">
              Every t-shirt is more than just clothing - it's a statement, a piece of art, 
              and a connection to a global community of free-thinkers and culture enthusiasts.
            </p>
          </div>
          <div className="relative">
            <img
              src="/api/proxy-image?url=https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600"
              alt="Colorful t-shirts hanging"
              className="rounded-lg shadow-xl"
            />
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-semibold text-center mb-12 text-gray-900">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Join the Society</h2>
          <p className="text-xl mb-8 opacity-90">
            Discover unique designs that speak to your soul
          </p>
          <a
            href="/products"
            className="inline-block bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </a>
        </motion.div>
      </div>
    </div>
  )
}

export default About
