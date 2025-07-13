import { motion } from 'framer-motion'
import { Shield, Eye, Mail, Globe } from 'lucide-react'

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Eye,
      title: 'Information We Collect',
      content: [
        'Personal information (name, email, shipping address) when you place an order',
        'Payment information (processed securely through our payment partners)',
        'Browsing data and cookies for site functionality',
        'Communication preferences and customer service interactions'
      ]
    },
    {
      icon: Shield,
      title: 'How We Protect Your Data',
      content: [
        'SSL encryption for all data transmission',
        'Secure payment processing through trusted partners',
        'Limited access to personal information by authorized personnel only',
        'Regular security audits and updates'
      ]
    },
    {
      icon: Globe,
      title: 'How We Use Your Information',
      content: [
        'Process and fulfill your orders',
        'Send order confirmations and shipping updates',
        'Provide customer support',
        'Send promotional emails (only with your consent)',
        'Improve our website and services'
      ]
    },
    {
      icon: Mail,
      title: 'Your Rights',
      content: [
        'Access your personal data',
        'Request correction of inaccurate data',
        'Request deletion of your data',
        'Opt-out of marketing communications',
        'Data portability upon request'
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-gray max-w-none"
        >
          <div className="bg-orange-50 border-l-4 border-orange-500 p-6 mb-8">
            <p className="text-gray-800">
              At Saffron Society, we take your privacy seriously. This policy describes how we collect, 
              use, and protect your personal information when you use our website and services.
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
                <div className="bg-orange-100 p-2 rounded-lg">
                  <section.icon className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
              </div>
              <ul className="space-y-2 ml-11">
                {section.content.map((item, i) => (
                  <li key={i} className="text-gray-700 flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          ))}

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Third-Party Services</h2>
            <p className="text-gray-700 mb-4">
              We use trusted third-party services for:
            </p>
            <ul className="space-y-2 ml-6 text-gray-700">
              <li>• Payment processing (Stripe, PayPal)</li>
              <li>• Order fulfillment (Printify)</li>
              <li>• Analytics (Google Analytics)</li>
              <li>• Email communications (if applicable)</li>
            </ul>
            <p className="text-gray-700 mt-4">
              These services have their own privacy policies and we encourage you to review them.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Cookies</h2>
            <p className="text-gray-700">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
              You can control cookie preferences through your browser settings.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 bg-gray-100 rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-3 text-gray-900">Contact Us</h2>
            <p className="text-gray-700">
              If you have questions about this privacy policy or your personal data, please contact us at:
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Email:</strong> privacy@saffronsociety.store<br />
              <strong>Address:</strong> Ontario, Canada
            </p>
          </motion.section>
        </motion.div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
