import { motion } from 'framer-motion'
import { Shield, Globe, AlertTriangle } from 'lucide-react'

const TermsOfUse = () => {
  return (
    <div className="container-custom py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="font-playfair text-4xl font-bold text-maroon mb-8">
          Terms of Use
        </h1>
        
        <div className="prose prose-lg max-w-none text-neutral-700">
          <p className="lead">
            By accessing and using the Saffron Society website, you accept and agree to be bound by 
            the terms and provision of this agreement.
          </p>

          <section className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-orange-500" />
              <h2 className="font-playfair text-2xl font-bold text-neutral-800 m-0">
                Use of Website
              </h2>
            </div>
            <p>
              You may use our website for lawful purposes only. You agree not to use the website:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>In any way that violates any applicable federal, state, local, or international law</li>
              <li>To transmit any unauthorized advertising or promotional material</li>
              <li>To impersonate any person or entity</li>
              <li>In any way that infringes upon the rights of others</li>
            </ul>
          </section>

          <section className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-orange-500" />
              <h2 className="font-playfair text-2xl font-bold text-neutral-800 m-0">
                Intellectual Property
              </h2>
            </div>
            <p>
              The content on this website, including but not limited to text, graphics, images, logos, 
              and software, is the property of Saffron Society and is protected by copyright and other 
              intellectual property laws.
            </p>
          </section>

          <section className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-orange-500" />
              <h2 className="font-playfair text-2xl font-bold text-neutral-800 m-0">
                Product Information
              </h2>
            </div>
            <p>
              We strive to provide accurate product descriptions and pricing. However, we do not warrant 
              that product descriptions or other content is accurate, complete, reliable, current, or error-free.
            </p>
          </section>

          <section className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-orange-500" />
              <h2 className="font-playfair text-2xl font-bold text-neutral-800 m-0">
                Orders and Payment
              </h2>
            </div>
            <p>
              By placing an order, you warrant that you are legally capable of entering into binding contracts. 
              All orders are subject to acceptance by us. We reserve the right to refuse any order.
            </p>
          </section>

          <section className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-orange-500" />
              <h2 className="font-playfair text-2xl font-bold text-neutral-800 m-0">
                Third Party Links
              </h2>
            </div>
            <p>
              Our website may contain links to third-party websites. We have no control over the content 
              and assume no responsibility for the content, privacy policies, or practices of any third-party websites.
            </p>
          </section>

          <section className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
              <h2 className="font-playfair text-2xl font-bold text-neutral-800 m-0">
                Limitations of Liability
              </h2>
            </div>
            <p>
              In no event shall Saffron Society, its directors, employees, partners, agents, suppliers, or 
              affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, 
              including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
              <h2 className="font-playfair text-2xl font-bold text-neutral-800 m-0">
                Disclaimers
              </h2>
            </div>
            <p>
              The information on this website is provided on an "as is" basis. Saffron Society makes no 
              representations or warranties of any kind, express or implied, as to the operation of this 
              website or the information, content, materials, or products included on this website.
            </p>
          </section>

          <section className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-orange-500" />
              <h2 className="font-playfair text-2xl font-bold text-neutral-800 m-0">
                Contact Information
              </h2>
            </div>
            <p>
              For questions about these Terms of Use, please contact us at:
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

export default TermsOfUse