import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { HighlightItem } from '../../utils/extractDesignHighlights'

interface ProductGalleryProps {
  productName: string;
  mainImage: string;
  productImages: string[];
  onImageSelect: (image: string) => void;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  designHighlights?: HighlightItem[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  productName,
  mainImage,
  productImages,
  onImageSelect,
  onImageError,
  designHighlights = []
}) => {
  const [showHighlights, setShowHighlights] = useState(false);
  const highlightsBtnRef = useRef<HTMLButtonElement | null>(null);
  const highlightsModalRef = useRef<HTMLDivElement | null>(null);

  // Focus trap for modal
  useEffect(() => {
    if (showHighlights && highlightsModalRef.current) {
      const focusable = highlightsModalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length) focusable[0].focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setShowHighlights(false);
        }
        if (e.key === 'Tab' && focusable.length) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
    // Return focus to button
    if (!showHighlights && highlightsBtnRef.current) {
      highlightsBtnRef.current.focus();
    }
  }, [showHighlights]);

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-white/40 shadow-xl"
      >
        {/* Design Highlights Button - absolute on image card */}
        {designHighlights.length > 0 && (
          <button
            ref={highlightsBtnRef}
            type="button"
            className="absolute top-3 right-3 z-20 inline-flex items-center gap-1 bg-gradient-to-r from-orange-400 to-amber-400 text-white font-semibold text-xs px-3 py-1.5 rounded-full shadow-md border border-orange-300 hover:scale-105 transition focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
            onClick={() => setShowHighlights(true)}
            aria-haspopup="dialog"
            aria-expanded={showHighlights}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l-1.414-1.414M6.05 6.05L4.636 4.636" /></svg>
            Design&nbsp;Highlights
          </button>
        )}

        <img
          src={mainImage}
          alt={productName}
          className="w-full h-full object-contain relative z-10"
          onError={onImageError}
        />
      </motion.div>

      {/* Modal for Design Highlights */}
      <AnimatePresence>
        {showHighlights && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHighlights(false)}
          >
            <motion.div
              ref={highlightsModalRef}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-orange-100"
              onClick={e => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowHighlights(false)}
                aria-label="Close Design Highlights"
                className="absolute top-3 right-3 text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-full p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <h2 className="text-lg font-bold text-orange-500 mb-4">Design Highlights</h2>

              <ul className="space-y-3 text-sm leading-relaxed text-gray-800 list-none">
                {designHighlights.map(({ label, detail }, idx) => (
                  <li key={label + idx} className="grid grid-cols-[max-content_1fr] gap-x-2">
                    <span className="font-semibold text-orange-500">{label}:</span>
                    <span className="flex-1">{detail}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thumbnail Gallery */}
      {productImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {productImages.slice(0, 8).map((img: string, idx: number) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onImageSelect(img)}
              className={`aspect-square bg-white/60 backdrop-blur-md rounded-xl overflow-hidden border-2 transition-all shadow-lg ${
                mainImage === img 
                  ? 'border-orange-400 shadow-orange-200/50' 
                  : 'border-white/40 hover:border-orange-300/60'
              }`}
            >
              <img
                src={img}
                alt={`${productName} view ${idx + 1}`}
                className="w-full h-full object-contain"
                onError={onImageError}
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductGallery