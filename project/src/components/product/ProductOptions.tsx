import React from 'react'
import { motion } from 'framer-motion'
import {
   AVAILABLE_SIZES,
   COLOR_NAME_TO_HEX,
   getColorNameFromHex      // ← we’ll use this in a second
} from "../../constants/productConstants";

interface ProductOptionsProps {
  colors: any[]
  selectedColor: string
  selectedSize: string
  onColorSelect: (color: string) => void
  onSizeSelect: (size: string) => void
  isSizeAvailable: (size: string) => boolean
}

const ProductOptions: React.FC<ProductOptionsProps> = ({
  colors,
  selectedColor,
  selectedSize,
  onColorSelect,
  onSizeSelect,
  isSizeAvailable,
  // removed hexToName
}) => {
  return (
    <>
      {/* Color Selection */}
      {colors && colors.length > 0 && (
        <div className="mb-5">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Color</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const colorValue = typeof color === 'string' ? color : (color.hex || color.name)
              const colorHex = typeof color === 'string' 
                ? COLOR_NAME_TO_HEX[color] || color
                : color.hex || COLOR_NAME_TO_HEX[color.name] || color.name
              const colorName = typeof color === 'string' ? color : color.name
              
              return (
                <motion.button
                  key={colorValue}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onColorSelect(colorValue)}
                  className={`w-8 h-8 rounded-full border-2 transition-all shadow-md ${
                    selectedColor === colorValue 
                      ? 'border-gray-800 shadow-lg' 
                      : 'border-white/60 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: colorHex }}
                  title={colorName || getColorNameFromHex(colorValue)}
                />
              )
            })}
          </div>
          {selectedColor && (
            <p className="text-sm text-gray-600 mt-2 font-medium">
              Selected: {colors?.find(c => c.hex === selectedColor)?.name || getColorNameFromHex(selectedColor)}
            </p>
          )}
        </div>
      )}

      {/* Size Selection */}
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Size</h3>
        <div className="grid grid-cols-4 gap-2">
          {AVAILABLE_SIZES.map(size => {
            const isAvailable = isSizeAvailable(size)
            const isSelected = selectedSize === size
            
            return (
              <motion.button
                key={size}
                whileHover={isAvailable ? { scale: 1.05 } : {}}
                whileTap={isAvailable ? { scale: 0.95 } : {}}
                onClick={() => isAvailable && onSizeSelect(size)}
                disabled={!isAvailable}
                className={`py-2 px-3 border-2 rounded-lg font-semibold transition-all text-sm ${
                  isSelected && isAvailable
                    ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md'
                    : isAvailable
                    ? 'border-white/60 bg-white/50 hover:border-orange-300 hover:bg-orange-50/50'
                    : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className={isAvailable ? '' : 'line-through'}>{size}</span>
                  {!isAvailable && (
                    <span className="text-xs text-gray-400 mt-0.5">Sold Out</span>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default ProductOptions
