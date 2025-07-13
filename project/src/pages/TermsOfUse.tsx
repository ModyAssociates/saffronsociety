import { motion } from 'framer-motion'
import { FileText, ShoppingBag, AlertCircle, Users, Ban, Scale } from 'lucide-react'

const TermsOfUse = () => {
  const sections = [
    {
      icon: ShoppingBag,
      title: 'Orders and Payment',
      items: [
        'All prices are in CAD and subject to change without notice',
        'Payment is required at the time of purchase',
        'We reserve the right to refuse or cancel orders',
        'Order confirmation does not guarantee product availability',
        'Shipping costs are calculated at checkout'
      ]
    },
    {
      icon: FileText,
      title: 'Intellectual Property',
      items: [
        'All designs are protected by copyright and trademark laws',
        'You may not reproduce, distribute, or create derivative works',
        'User-generated content grants us a license to use for marketing',
        'We respect intellectual property rights and respond to valid claims'
      ]
    },
    {
      icon: Users,
      title: 'User Conduct',
      items: [
        'You must be 18 years or older to make purchases',
        'Provide accurate and complete information',
        'Do not use the site for illegal or unauthorized purposes',
        'Do not interfere with site security or functionality',
        'Respect other users and our community guidelines'
      ]
    },
    {
      icon: Ban,
      title: 'Prohibited Activities',
      items: [
        'Attempting to hack or compromise our systems',
        'Using automated tools to scrape or access our site',
        'Impersonating others or providing false information',
        'Posting harmful, offensive, or illegal content',
        'Violating any applicable laws or regulations'
      ]
    }
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Use</h1>
          <p className="text-gray-600">Effective Date: {new Date().toLocaleDateString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-gray max-w-none"
        >
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
            <p className="text-gray-800">
              Welcome to Saffron Society. By using our website and services, you agree to these terms. 
              Please read them carefully before making any purchase.
            </p>
          </div>

          {sections.map((section, index) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <section.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
              </div>
              <ul className="space-y-2 ml-11">
                {section.items.map((item, i) => (
                  <li key={i} className="text-gray-700 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          ))}

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mb-10"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <Scale className="w-6 h-6 text-blue-600" />
              Returns and Refunds
            </h2>
            <div className="ml-8 space-y-3 text-gray-700">
              <p>• Returns accepted within 30 days of delivery for unworn items</p>
              <p>• Items must be in original condition with tags attached</p>
              <p>• Custom or personalized items cannot be returned</p>
              <p>• Refunds processed within 5-10 business days</p>
              <p>• Shipping costs are non-refundable</p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mb-10"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Limitation of Liability</h2>
            <p className="text-gray-700">
              To the fullest extent permitted by law, Saffron Society shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages resulting from your use of our services. 
              Our total liability shall not exceed the amount paid for the product in question.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mb-10"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Disclaimers</h2>
            <div className="space-y-3 text-gray-700">
              <p>• Products are provided "as is" without warranties of any kind</p>
              <p>• Colors may vary slightly from screen to actual product</p>
              <p>• We do not guarantee continuous or error-free service</p>
              <p>• Product availability is subject to change</p>
            </div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 bg-gray-100 rounded-lg p-6"
          >
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Changes to Terms</h3>
                <p className="text-gray-700">
                  We reserve the right to update these terms at any time. Continued use of our services 
                  after changes constitutes acceptance of the new terms.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-8 bg-blue-100 rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-3 text-gray-900">Questions?</h2>
            <p className="text-gray-700">
              If you have any questions about these terms, please contact us at:
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Email:</strong> legal@saffronsociety.store<br />
              <strong>Address:</strong> Ontario, Canada
            </p>
          </motion.section>
        </motion.div>
      </div>
    </div>
  )
}

export default TermsOfUse
