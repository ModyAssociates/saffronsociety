import React from 'react'
import { motion } from 'framer-motion'
import { parseDesignHighlights } from '../../utils/productUtils'

interface DesignHighlightsProps {
  description: string
}

const DesignHighlights: React.FC<DesignHighlightsProps> = ({ description }) => {
  const highlights = parseDesignHighlights(description)

  if (!description || highlights.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/40 shadow-xl"
    >
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        🎨 Design Highlights
      </h3>
      <div
        className="flex flex-col gap-4 text-left"
        style={{ listStyle: 'none', paddingLeft: 0, marginLeft: 0 }}
      >
        {highlights.map((highlight, idx) => (
          <div key={idx}>
            <span className="font-semibold text-gray-900">{highlight.title}:</span>{' '}
            <span className="text-gray-600">{highlight.description}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default DesignHighlights
