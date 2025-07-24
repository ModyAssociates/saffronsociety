import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { getProductInfoSections } from '../../constants/productConstants'
import { formatPrintifyDescription } from '../../utils/productUtils'
import { Product } from '../../types'

interface ProductInfoSectionsProps {
  product: Product;
  expandedSections?: Set<string>;
  setExpandedSections?: React.Dispatch<React.SetStateAction<Set<string>>>;
  returnsRef?: React.RefObject<HTMLDivElement>;
}

const ProductInfoSections: React.FC<ProductInfoSectionsProps> = ({ product, expandedSections: expandedSectionsProp, setExpandedSections: setExpandedSectionsProp, returnsRef }) => {
  const [internalExpandedSections, internalSetExpandedSections] = useState<Set<string>>(new Set(['about']));
  const expandedSections = expandedSectionsProp ?? internalExpandedSections;
  const setExpandedSections = setExpandedSectionsProp ?? internalSetExpandedSections;

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  const sections = getProductInfoSections(product)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/70 backdrop-blur-lg rounded-2xl border border-white/40 shadow-xl overflow-hidden"
    >
      {sections.map((section) => (
        <div
          key={section.id}
          className="border-b border-white/30 last:border-b-0"
          ref={section.id === 'returns' && returnsRef ? returnsRef : undefined}
        >
          <motion.button
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            onClick={() => toggleSection(section.id)}
            className="w-full py-5 px-6 flex items-center justify-between text-left hover:text-orange-600 transition-colors"
          >
            <h2 className="text-lg font-bold">{section.title}</h2>
            <motion.div
              animate={{ rotate: expandedSections.has(section.id) ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.button>
          
          <AnimatePresence>
            {expandedSections.has(section.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pb-6 px-6 text-gray-700">
                  {section.id === 'about' && section.content && typeof section.content === 'object' && 'designTitle' in section.content && (
                    <div className="space-y-6">
                      {/* Design Header */}
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                        <h3 className="text-xl font-bold font-playfair text-gray-900 mb-2 flex items-center gap-2">
                          🎬 The Design
                        </h3>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3 leading-tight">
                          {section.content.designTitle}
                        </h4>
                      </div>

                      {/* Rich Description */}
                      <div className="bg-white/50 rounded-xl p-4 border border-gray-100">
                        <div 
                          className="prose prose-sm max-w-none text-gray-700 leading-relaxed
                            [&>h2]:text-lg [&>h2]:font-bold [&>h2]:font-playfair [&>h2]:text-gray-900 [&>h2]:mt-4 [&>h2]:mb-3 [&>h2]:first:mt-0 [&>h2]:border-b [&>h2]:border-orange-200 [&>h2]:pb-2
                            [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-gray-800 [&>h3]:mt-4 [&>h3]:mb-2 [&>h3]:flex [&>h3]:items-center [&>h3]:gap-2
                            [&>h4]:text-sm [&>h4]:font-semibold [&>h4]:text-gray-800 [&>h4]:mt-3 [&>h4]:mb-2 [&>h4]:text-orange-700
                            [&>p]:text-sm [&>p]:text-gray-700 [&>p]:mb-3 [&>p]:leading-relaxed [&>p]:text-justify
                            [&>p.font-bold]:text-base [&>p.font-bold]:mt-6 [&>p.font-bold]:text-center
                            [&>ul]:text-sm [&>ul]:text-gray-700 [&>ul]:mb-3 [&>ul]:space-y-2
                            [&>ul>li]:flex [&>ul>li]:items-start [&>ul>li]:gap-2
                            [&>ul>li]:before:content-['•'] [&>ul>li]:before:text-orange-500 [&>ul>li]:before:font-bold [&>ul>li]:before:text-base
                            [&>ul>li>strong]:font-bold [&>ul>li>strong]:text-gray-900 [&>ul>li>strong]:bg-transparent
                            [&>strong]:font-bold [&>strong]:text-gray-900 [&>strong]:bg-yellow-100 [&>strong]:px-1 [&>strong]:rounded
                            [&>em]:italic [&>em]:text-orange-600 [&>em]:font-medium
                            [&_img]:rounded-lg [&_img]:shadow-md [&_img]:my-3"
                          dangerouslySetInnerHTML={{ 
                            __html: formatPrintifyDescription(section.content.designDescription || '')
                          }} 
                        />
                      </div>

                      {/* Features Grid */}
                      {section.content.features && (
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                          <h4 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                            ⭐ Why You'll Love This Design
                          </h4>
                          <div className="grid gap-3">
                            {section.content.features.map((feature: string, idx: number) => (
                              <div key={idx} className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                                <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <span className="text-sm text-gray-700 font-medium">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {section.id === 'details' && Array.isArray(section.content) && (
                    <div className="space-y-4">
                      {section.content.map((detail: any, idx: number) => (
                        <div key={idx}>
                          {typeof detail === 'object' && detail.title ? (
                            <>
                              <h4 className="font-semibold mb-1">{detail.title}</h4>
                              <p className="text-sm">{detail.description}</p>
                            </>
                          ) : (
                            <p className="text-sm">{typeof detail === 'string' ? detail : ''}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {section.id === 'care' && Array.isArray(section.content) && (
                    <ul className="space-y-1">
                      {(section.content as string[]).map((instruction: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-orange-500 mr-2">•</span>
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {section.id === 'shipping' && typeof section.content === 'string' && (
                    <p>{section.content}</p>
                  )}
                  
                  {section.id === 'returns' && typeof section.content === 'string' && (
                    <div className="space-y-3">
                      {section.content.split('\n\n').map((paragraph: string, idx: number) => (
                        <p key={idx}>
                          {paragraph.includes('Terms of Use') ? (
                            <>
                              {paragraph.split('Terms of Use')[0]}
                              <a href="/terms-of-use" className="text-orange-500 hover:text-orange-600 underline">
                                Terms of Use
                              </a>
                            </>
                          ) : (
                            paragraph
                          )}
                        </p>
                      ))}
                    </div>
                  )}
                  
                  {section.id === 'gpsr' && section.content && typeof section.content === 'object' && 'euRep' in section.content && (
                    <div className="space-y-3 text-sm">
                      <p>{section.content.euRep}</p>
                      <p>{section.content.productInfo}</p>
                      <p>{section.content.warnings}</p>
                      <p>{section.content.care}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </motion.div>
  )
}

export default ProductInfoSections
