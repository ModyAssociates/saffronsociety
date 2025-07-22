
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ChevronLeft, Package, Shield } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { fetchPrintifyProducts } from '../services/printify';
import placeholderImg from '../assets/logo_big.png';
import ProductGallery from '../components/product/ProductGallery';
import { extractDesignHighlights } from '../utils/extractDesignHighlights';
import ProductOptions from '../components/product/ProductOptions';
import DesignHighlights from '../components/product/DesignHighlights';
import ProductInfoSections from '../components/product/ProductInfoSections';
import { AVAILABLE_SIZES, COLOR_NAME_TO_HEX } from '../constants/productConstants';
import { decodeHTMLEntities } from '../utils/productUtils';





const ProductDetails = () => {
  // Design Highlights modal state and handlers (must be inside component)
  const [showHighlights, setShowHighlights] = useState(false);
  const highlightsBtnRef = useRef<HTMLButtonElement>(null);
  const highlightsModalRef = useRef<HTMLDivElement>(null);
  // Trap focus in modal
  useEffect(() => {
    if (!showHighlights || !highlightsModalRef.current) return;
    const focusable = highlightsModalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Tab') {
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
      } else if (e.key === 'Escape') {
        e.preventDefault();
        highlightsBtnRef.current?.focus();
        (highlightsModalRef.current as any)?.closeModal?.();
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [showHighlights, highlightsModalRef, highlightsBtnRef]);
  // Modal close handler
  const closeHighlights = () => {
    setShowHighlights(false);
    setTimeout(() => highlightsBtnRef.current?.focus(), 0);
  };
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [selectedSize, setSelectedSize] = useState<string>(AVAILABLE_SIZES[2]) // Default to M
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    loadProduct()
  }, [id])

  // Update price when size or color changes
  useEffect(() => {
    if (product && selectedSize) {
      updatePrice()
    }
  }, [product, selectedSize, selectedColor])


  // Update gallery images and main image when color changes
  useEffect(() => {
    if (!product || !selectedColor) return;
    // Find color name (from hex or name)
    let colorName = product.colors?.find(c => c.hex === selectedColor)?.name || selectedColor;
    if (product.imagesByColor && product.imagesByColor[colorName]) {
      const colorImages = product.imagesByColor[colorName];
      // Handle angles as array or object
      let angles: string[] = [];
      if (colorImages.angles) {
        if (Array.isArray(colorImages.angles)) {
          angles = colorImages.angles;
        } else if (typeof colorImages.angles === 'object') {
          angles = Object.values(colorImages.angles).flat();
        }
      }
      // Sort angles for logical order: front, back, front collar closeup, folded, others
      const angleOrder = [
        'front',
        'back',
        'front collar closeup',
        'folded',
      ];
      // Find the original image objects for sorting
      const allProductImages = product.images || [];
      const sortedAngles = [...angles].sort((a, b) => {
        const aObj = allProductImages.find(img => {
          if (typeof img === 'string') return img === a;
          return (img as any)?.src === a;
        });
        const bObj = allProductImages.find(img => {
          if (typeof img === 'string') return img === b;
          return (img as any)?.src === b;
        });
        const aPos = (aObj && typeof aObj === 'object' && 'position' in aObj ? (aObj as any).position : '').toLowerCase();
        const bPos = (bObj && typeof bObj === 'object' && 'position' in bObj ? (bObj as any).position : '').toLowerCase();
        const aIdx = angleOrder.findIndex(pos => aPos === pos);
        const bIdx = angleOrder.findIndex(pos => bPos === pos);
        if (aIdx === -1 && bIdx === -1) return 0;
        if (aIdx === -1) return 1;
        if (bIdx === -1) return -1;
        return aIdx - bIdx;
      });
      // Compose gallery: main, sorted angles, models (no duplicates)
      const allImages = [colorImages.main, ...sortedAngles, ...colorImages.models].filter(Boolean);
      const uniqueImages = Array.from(new Set(allImages));
      setGalleryImages(uniqueImages);
      setMainImage(colorImages.main || uniqueImages[0] || product.images?.[0] || (typeof product.image === 'string' ? product.image : product.image?.src) || placeholderImg);
    } else if (product.images && product.images.length > 0) {
      setGalleryImages(product.images);
      setMainImage(product.images[0]);
    } else {
      setGalleryImages([(typeof product.image === 'string' ? product.image : product.image?.src) || placeholderImg]);
      setMainImage((typeof product.image === 'string' ? product.image : product.image?.src) || placeholderImg);
    }
  }, [product, selectedColor]);

  const updatePrice = () => {
    if (!product) return
    
    // Find the color name from the hex value
    const selectedColorName = product.colors?.find(c => c.hex === selectedColor)?.name
    
    // Find variant that matches selected size and color
    const matchingVariant = product.variants?.find(v => {
      const sizeMatch = v.size === selectedSize
      const colorMatch = v.color?.toLowerCase() === selectedColorName?.toLowerCase()
      return sizeMatch && colorMatch
    })
    
    if (matchingVariant) {
      setCurrentPrice(matchingVariant.price)
    } else {
      // Fallback to product base price or lowest variant price
      const lowestPrice = product.variants && product.variants.length > 0
        ? Math.min(...product.variants.filter(v => v.is_enabled).map(v => v.price))
        : product.price
      setCurrentPrice(lowestPrice)
    }
  }

  // updateImageForColor is now handled by the above useEffect

  // Check if a size is available for the current selected color
  const isSizeAvailable = (size: string): boolean => {
    if (!product || !product.variants) return false
    
    const selectedColorName = product.colors?.find(c => c.hex === selectedColor)?.name
    
    // Check if there's a variant with this size and color that's available
    return product.variants.some(v => 
      v.size === size && 
      v.color?.toLowerCase() === selectedColorName?.toLowerCase() &&
      v.is_enabled
    )
  }

  async function loadProduct() {
    try {
      setLoading(true)
      const products = await fetchPrintifyProducts()
      const found = products.find(p => p.id === id)
      if (found) {
        setProduct(found)
        
        // Set initial image - prioritize product.images array
        const firstImage = found.images && found.images.length > 0
          ? found.images[0]
          : typeof found.image === 'string' 
            ? found.image 
            : found.image?.src || placeholderImg
        setMainImage(firstImage)
        
        // Set initial color
        setSelectedColor(found.colors?.[0]?.hex || found.colors?.[0]?.name || '')
        
        // Set initial price
        const lowestPrice = found.variants && found.variants.length > 0
          ? Math.min(...found.variants.filter(v => v.is_enabled).map(v => v.price))
          : found.price
        setCurrentPrice(lowestPrice)
      }
    } catch (error) {
      console.error('Failed to load product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    
    // Add item to cart with correct parameters
    addItem(product, selectedSize, selectedColor, quantity)
  }



  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = placeholderImg
  }

  const hexToName = (hex: string): string => {
    const entry = Object.entries(COLOR_NAME_TO_HEX).find(([_, value]) => value.toLowerCase() === hex.toLowerCase())
    return entry ? entry[0] : hex
  }



  // Extract just the bolded titles from the Design Highlights section
  const designHighlights = product && product.description ? extractDesignHighlights(product.description) : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/shop')}
            className="text-orange-500 hover:text-orange-600 flex items-center gap-2 mx-auto"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to products
          </button>
        </div>
      </div>
    )
  }


  // Use galleryImages for the gallery
  const productImages = galleryImages.length > 0 ? galleryImages : [typeof product.image === 'string' ? product.image : product.image?.src || placeholderImg]

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/shop')}
          className="mb-6 text-gray-700 hover:text-orange-600 flex items-center gap-2 transition-colors font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to products
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <ProductGallery
            productImages={productImages}
            mainImage={mainImage}
            onImageSelect={setMainImage}
            productName={product.name}
            onImageError={handleImageError}
            designHighlights={designHighlights}
          />

          {/* Product Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 backdrop-blur-lg rounded-2xl p-5 border border-white/40 shadow-xl"
            >
              <div className="mb-5">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                  {decodeHTMLEntities(product.name)}
                </h1>
                {/* Design Highlights Trigger Button */}
                {Array.isArray(designHighlights) && designHighlights.length > 0 && (
                  <button
                    ref={highlightsBtnRef}
                    type="button"
                    className="mt-2 mb-3 inline-block font-bold text-white bg-[#FF7A1A] px-6 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#FFBA66] focus:ring-offset-2 transition-colors duration-150 hover:bg-[#e86a0e]"
                    style={{ fontSize: 14, borderRadius: 999 }}
                    onClick={() => setShowHighlights(true)}
                    aria-haspopup="dialog"
                    aria-expanded={showHighlights}
                  >
                    Design Highlights
                  </button>
                )}
      {/* Design Highlights Modal */}
      <AnimatePresence>
        {showHighlights && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={closeHighlights}
              aria-hidden="true"
            />
            {/* Modal */}
            <motion.div
              key="modal"
              ref={highlightsModalRef}
              className="fixed z-50 left-1/2 top-1/2 max-w-[600px] w-[90vw] md:w-[600px] p-8 rounded-2xl bg-[#1A1A1A] text-[#FAFAFA] shadow-2xl border border-[#323232]"
              style={{ transform: 'translate(-50%, -50%)', maxHeight: '80vh', overflowY: 'auto' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
            >
              <div className="text-lg font-bold mb-3 border-b border-[#323232] pb-2" style={{ fontSize: 20 }}>
                Design Highlights
              </div>
              <ul className="mb-6 space-y-3">
                {designHighlights.map((item: any, idx: number) => (
                  <li key={idx} className="leading-5 text-sm flex items-start">
                    <span className="font-bold text-[#FF7A1A] mr-2">{item.label}</span>
                    <span className="text-[#FAFAFA] font-normal">{item.detail}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-center">
                <button
                  type="button"
                  className="font-bold text-white bg-[#FF7A1A] px-6 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#FFBA66] focus:ring-offset-2 transition-colors duration-150 hover:bg-[#e86a0e]"
                  style={{ fontSize: 14, borderRadius: 999 }}
                  onClick={closeHighlights}
                  autoFocus
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
                <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  ${currentPrice.toFixed(2)}
                </p>
              </div>

              <ProductOptions
                colors={product.colors || []}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                onColorSelect={setSelectedColor}
                onSizeSelect={setSelectedSize}
                isSizeAvailable={isSizeAvailable}
                hexToName={hexToName}
              />

              {/* Quantity */}
              <div className="mb-5">
                <h3 className="text-base font-semibold text-gray-800 mb-3">Quantity</h3>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border-2 border-white/60 bg-white/50 hover:border-orange-300 hover:bg-orange-50/50 flex items-center justify-center transition-all font-bold"
                  >
                    -
                  </motion.button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border-2 border-white/60 bg-white/50 hover:border-orange-300 hover:bg-orange-50/50 flex items-center justify-center transition-all font-bold"
                  >
                    +
                  </motion.button>
                </div>
              </div>

              {/* Add to Cart & Wishlist */}
              <div className="flex gap-3 mb-5">
                <motion.button
                  whileHover={isSizeAvailable(selectedSize) ? { scale: 1.02 } : {}}
                  whileTap={isSizeAvailable(selectedSize) ? { scale: 0.98 } : {}}
                  onClick={isSizeAvailable(selectedSize) ? handleAddToCart : undefined}
                  disabled={!isSizeAvailable(selectedSize)}
                  className={`flex-1 py-3 px-5 rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-md ${
                    isSizeAvailable(selectedSize)
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {isSizeAvailable(selectedSize) ? 'Add to Cart' : 'Size Not Available'}
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 border-2 border-white/60 bg-white/50 rounded-lg hover:border-red-300 hover:bg-red-50/50 transition-all"
                >
                  <Heart className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Return Policy */}
              <div className="border-t border-white/40 pt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                  <Package className="w-4 h-4 text-orange-500" />
                  <span>30 days return policy.</span>
                  <a href="/terms" className="text-orange-600 hover:text-orange-700 underline font-semibold">
                    See details
                  </a>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Secure payments accepted</span>
                </div>
              </div>
            </motion.div>

            {/* Design Highlights Component */}
            {product.description && (
              <DesignHighlights description={product.description} />
            )}

            {/* Product Information Sections */}
            <ProductInfoSections product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
