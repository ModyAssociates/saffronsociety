import { motion } from 'framer-motion'
import { Shield, Globe, Cookie, AlertTriangle } from 'lucide-react'

const PrivacyPolicy = () => {
  return (
    <div className="container-custom py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="font-playfair text-4xl font-bold text-maroon mb-8">
          Privacy Policy
        </h1>
        
        <div className="prose prose-lg max-w-none text-neutral-700">
          <p className="lead">
            At Saffron Society, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you visit our website or make a purchase.
          </p>

          <section className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-orange-500" />
              <h2 className="font-playfair text-2xl font-bold text-neutral-800 m-0">
                Information We Collect
              </h2>
            </div>
            <p>
              We collect information you provide directly to us, such as when you create an account, 
              make a purchase, or contact us. This may include:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>Name and contact information</li>
              <li>Billing and shipping addresses</li>
              <li>Payment information</li>
              <li>Order history</li>
              <li>Communication preferences</li>
            </ul>
          </section>

          <section className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-orange-500" />
              <h2 className="font-playfair text-2xl font-bold text-neutral-800 m-0">
                How We Use Your Information
              </h2>
            </div>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-orange-500" />
              <h2 className="font-playfair text-2xl font-bold text-neutral-800 m-0">
                Data Security
              </h2>
            </div>
            <p>
              We implement appropriate technical and organizational security measures to protect 
              your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-orange-500" />
              <h2 className="font-playfair text-2xl font-bold text-neutral-800 m-0">
                Third Party Services
              </h2>
            </div>
            <p>
              We may share your information with third-party service providers who perform services on our behalf, 
              such as payment processing, order fulfillment, and email delivery. These providers have access to 
              personal information needed to perform their functions but may not use it for other purposes.
            </p>
          </section>

          <section className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="w-6 h-6 text-orange-500" />
              <h2 className="font-playfair text-2xl font-bold text-neutral-800 m-0">
                Cookies
              </h2>
            </div>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and hold certain 
              information. You can instruct your browser to refuse all cookies or to indicate when a cookie is 
              being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
            </p>
          </section>

          <section className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-orange-500" />
              <h2 className="font-playfair text-2xl font-bold text-neutral-800 m-0">
                Contact Us
              </h2>
            </div>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="ml-4">
              Email: support@saffronsociety.com<br />
              Address: Saffron Society, Ontario, CA
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-neutral-200 text-sm text-neutral-600">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default PrivacyPolicy