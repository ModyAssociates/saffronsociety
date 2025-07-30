// project/src/pages/ProductDetails.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  ChevronLeft,
  Package,
  Shield,
} from 'lucide-react';
import { motion } from 'framer-motion';

import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { fetchPrintifyProducts } from '../services/printify';
import { useAuth } from '../context/AuthContext';

import placeholderImg from '../assets/logo_big.png';
import ProductGallery from '../components/product/ProductGallery';
import ProductOptions from '../components/product/ProductOptions';
import ProductInfoSections from '../components/product/ProductInfoSections';
import { extractDesignHighlights } from '../utils/extractDesignHighlights';
import { decodeHTMLEntities } from '../utils/productUtils';

import {
  COLOR_NAME_TO_HEX,
  getColorNameFromHex,
} from '../constants/productConstants';

const ProductDetails = () => {
  /* ─────────────────────────────── state ─────────────────────────────── */
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCart();
  const { profile } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedAnim, setAddedAnim] = useState(false);
  const [showAddedMsg, setShowAddedMsg] = useState(false);

  const [mainImage, setMainImage] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // Get preferred size/color from navigation state, context, or localStorage, fallback to defaults
  const navState = location.state as { preferredSize?: string; preferredColor?: string; preferredColorName?: string } | undefined;
  // ...existing code...

  // ...existing code...

  // Find color hex for preferredColorName
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [designHighlights, setDesignHighlights] = useState<any[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['about']));

  /* ─────────────────────────────── helpers ─────────────────────────────── */


  const isSizeAvailable = (size: string) => {
    if (!product) return false;
    const colorName =
      product.colors?.find(c => c.hex === selectedColor)?.name || '';
    return !!product.variants?.some(
      v =>
        v.size === size &&
        v.color?.toLowerCase() === colorName.toLowerCase() &&
        v.is_enabled,
    );
  };

  const updatePrice = () => {
    if (!product) return;

    // Debugging output
    console.log('updatePrice called:', {
      selectedSize,
      selectedColor,
      variants: product.variants,
      COLOR_NAME_TO_HEX,
    });


    // Normalize color: get both hex and name for selected color
    const colorObj = product.colors?.find(c => c.hex === selectedColor || c.name === selectedColor);
    const chosenColorName = colorObj?.name || getColorNameFromHex(selectedColor) || selectedColor;
    const chosenHex = colorObj?.hex || selectedColor;
    const chosenColorLower = chosenColorName.toLowerCase();
    const chosenHexLower = chosenHex.toLowerCase();

    // Normalize size: just use selectedSize

    const matched = product.variants?.find(v => {
      // Variant color: check both hex and name
      const variantHex = v.color?.startsWith('#') ? v.color.toLowerCase() : COLOR_NAME_TO_HEX[v.color || '']?.toLowerCase() || '';
      const variantName = v.color?.startsWith('#') ? getColorNameFromHex(v.color) : v.color;
      const variantNameLower = (variantName || '').toLowerCase();

      // Variant size: extract from size or title
      let variantSize = v.size;
      if (!variantSize && v.title) {
        const parts = v.title.split('/').map(s => s.trim());
        variantSize = parts.length > 1 ? parts[1] : parts[0];
      }

      return variantSize === selectedSize && (variantHex === chosenHexLower || variantNameLower === chosenColorLower);
    });

    if (matched) {
      console.log('Matched variant for price:', matched);
      setCurrentPrice(matched.price);
    } else {
      const lowest =
        product.variants?.length
          ? Math.min(
              ...product.variants
                .filter(v => v.is_enabled)
                .map(v => v.price),
            )
          : product.price;
      console.log('No match found, using lowest price:', lowest);
      setCurrentPrice(lowest);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    /* 1 ▸ normalise to hex */
    const normalizedHex = selectedColor.startsWith('#')
      ? selectedColor
      : COLOR_NAME_TO_HEX[selectedColor] || selectedColor;

    /* 2 ▸ find the original Printify colour (if any) */
    const colourObj = product.colors?.find(
      c =>
        c.hex?.toLowerCase() === normalizedHex.toLowerCase() ||
        c.name?.toLowerCase() === selectedColor.toLowerCase(),
    );

    /* 3 ▸ prefer the Printify label, fall back to generic helper */
    const colourName = colourObj?.name || getColorNameFromHex(normalizedHex);

    /* 4 ▸ find correct variant price */
    let variantPrice = currentPrice;
    // fallback: try to find variant price if currentPrice is not set
    if (!variantPrice && product.variants) {
      const matched = product.variants.find(v => {
        let variantSize = v.size;
        if (!variantSize && v.title) {
          const parts = v.title.split('/').map(s => s.trim());
          variantSize = parts.length > 1 ? parts[1] : parts[0];
        }
        const variantHex = v.color?.startsWith('#') ? v.color.toLowerCase() : COLOR_NAME_TO_HEX[v.color || '']?.toLowerCase() || '';
        const variantName = v.color?.startsWith('#') ? getColorNameFromHex(v.color) : v.color;
        const variantNameLower = (variantName || '').toLowerCase();
        const chosenColorName = colourName.toLowerCase();
        return variantSize === selectedSize && (variantHex === normalizedHex.toLowerCase() || variantNameLower === chosenColorName);
      });
      if (matched) variantPrice = matched.price;
    }

    /* 5 ▸ push to cart with price */
    if (addedAnim) return; // Prevent multiple rapid adds
    addItem(product, selectedSize, normalizedHex, quantity, colourName, variantPrice);
    setAddedAnim(true);
    setShowAddedMsg(true);
    setTimeout(() => setAddedAnim(false), 200); // push-in effect duration
    setTimeout(() => setShowAddedMsg(false), 1000); // message duration
  };

  /* ─────────────────────────────── effects ─────────────────────────────── */

  // initial load
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const products = await fetchPrintifyProducts();
        const found = products.find(p => p.id === id);
        if (!found) return;

        setProduct(found);
        // Set preferred color if available, else fallback to first color
        let preferredColorHex = '';
        let preferredColorName = '';
        // 1. Navigation state
        if (navState?.preferredColorName) {
          const colorObj = found.colors?.find(c => c.name?.toLowerCase() === navState.preferredColorName.toLowerCase());
          if (colorObj) {
            preferredColorHex = colorObj.hex;
            preferredColorName = colorObj.name;
          }
        }
        if (!preferredColorHex && navState?.preferredColor) {
          const colorObj = found.colors?.find(c => c.hex === navState.preferredColor);
          if (colorObj) {
            preferredColorHex = colorObj.hex;
            preferredColorName = colorObj.name;
          }
        }
        // 2. LocalStorage
        if (!preferredColorHex) {
          try {
            const localPref = JSON.parse(localStorage.getItem('userPref') || '{}');
            if (localPref.favorite_color) {
              const colorObj = found.colors?.find(c => c.hex === localPref.favorite_color);
              if (colorObj) {
                preferredColorHex = colorObj.hex;
                preferredColorName = colorObj.name;
              }
            }
            if (!preferredColorHex && localPref.favorite_color_name) {
              const colorObj = found.colors?.find(c => c.name?.toLowerCase() === localPref.favorite_color_name.toLowerCase());
              if (colorObj) {
                preferredColorHex = colorObj.hex;
                preferredColorName = colorObj.name;
              }
            }
          } catch {}
        }
        // 3. Context
        if (!preferredColorHex && profile) {
          if ('favorite_color' in profile) {
            const colorObj = found.colors?.find(c => c.hex === (profile as any).favorite_color);
            if (colorObj) {
              preferredColorHex = colorObj.hex;
              preferredColorName = colorObj.name;
            }
          }
          if (!preferredColorHex && 'favorite_color_name' in profile) {
            const colorObj = found.colors?.find(c => c.name?.toLowerCase() === (profile as any).favorite_color_name?.toLowerCase());
            if (colorObj) {
              preferredColorHex = colorObj.hex;
              preferredColorName = colorObj.name;
            }
          }
        }
        // 4. Fallbacks
        if (!preferredColorHex && found.colors?.length) {
          const blackColor = found.colors.find(c => c.name?.toLowerCase() === 'black');
          preferredColorHex = blackColor?.hex || found.colors[0].hex || '';
          preferredColorName = blackColor?.name || found.colors[0].name || '';
        }
        setSelectedColor(preferredColorHex);

        // Set preferred size if available, else fallback to Medium
        let preferredSize = '';
        // 1. Navigation state
        if (navState?.preferredSize && found.variants?.some(v => v.size === navState.preferredSize)) {
          preferredSize = navState.preferredSize;
        }
        // 2. LocalStorage
        if (!preferredSize) {
          try {
            const localPref = JSON.parse(localStorage.getItem('userPref') || '{}');
            if (localPref.preferred_size && found.variants?.some(v => v.size === localPref.preferred_size)) {
              preferredSize = localPref.preferred_size;
            }
          } catch {}
        }
        // 3. Context
        if (!preferredSize && profile && 'preferred_size' in profile && found.variants?.some(v => v.size === (profile as any).preferred_size)) {
          preferredSize = (profile as any).preferred_size;
        }
        // 4. Fallbacks
        if (!preferredSize && found.variants?.some(v => v.size === 'Medium')) {
          preferredSize = 'Medium';
        } else if (!preferredSize && found.variants?.length) {
          preferredSize = found.variants[0].size || '';
        }
        setSelectedSize(preferredSize);

        const firstImg =
          (Array.isArray(found.images) && found.images[0]) ||
          (typeof found.image === 'string' ? found.image : found.image?.src) ||
          placeholderImg;
        setMainImage(firstImg);
        setGalleryImages(Array.isArray(found.images) ? found.images : [firstImg]);

        const basePrice =
          found.variants?.length
            ? Math.min(
                ...found.variants.filter(v => v.is_enabled).map(v => v.price),
              )
            : found.price;
        setCurrentPrice(basePrice);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navState]);

  // extract design highlights
  useEffect(() => {
    if (product?.description) {
      setDesignHighlights(extractDesignHighlights(product.description));
    }
  }, [product?.description]);

  // price refresh
  useEffect(() => {
    if (product) updatePrice();
  }, [product, selectedSize, selectedColor]);

/* ───────────────────────── swap gallery when colour changes ───────────── */
useEffect(() => {
  if (!product || !selectedColor) return;

  // 1 ▸ find the colour object
  const colourObj =
    product.colors?.find(c => c.hex === selectedColor) ||
    product.colors?.find(c => c.name === selectedColor);

  const colourName = colourObj?.name || selectedColor;

  if (
    !colourName ||
    !product.imagesByColor ||
    !product.imagesByColor[colourName]
  )
    return;

  const colourImages = product.imagesByColor[colourName];

  /* 2 ▸ normalise angles into a real array */
  let angleArr: string[] = [];
  if (Array.isArray(colourImages.angles)) {
    angleArr = colourImages.angles;
  } else if (
    colourImages.angles &&
    typeof colourImages.angles === 'object'
  ) {
    angleArr = Object.values(colourImages.angles).flat() as string[];
  } else if (typeof colourImages.angles === 'string') {
    angleArr = [colourImages.angles];
  }

  /* 3 ▸ normalise models into an array too */
  const modelArr = Array.isArray(colourImages.models)
    ? colourImages.models
    : colourImages.models
    ? [colourImages.models as string]
    : [];

  /* 4 ▸ build final gallery */
  const ordered = [colourImages.main, ...angleArr, ...modelArr].filter(Boolean);
  const unique = Array.from(new Set(ordered));

  setGalleryImages(unique);
  setMainImage(
    colourImages.main || unique[0] || placeholderImg,
  );
}, [product, selectedColor]);

  /* ─────────────────────────────── render ─────────────────────────────── */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-orange-500" />
      </div>
    );
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
    );
  }

  const imagesToShow = galleryImages.length
    ? galleryImages
    : [
        (typeof product.image === 'string'
          ? product.image
          : product.image?.src) || placeholderImg,
      ];

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/shop')}
          className="mb-6 text-gray-700 hover:text-orange-600 flex items-center gap-2 transition-colors font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to products
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* ────────── gallery ────────── */}
          <ProductGallery
            productName={product.name}
            mainImage={mainImage}
            productImages={imagesToShow}
            onImageSelect={setMainImage}
            onImageError={e => (e.currentTarget.src = placeholderImg)}
            designHighlights={designHighlights}
          />

          {/* ────────── info / options ────────── */}
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-5 border border-white/40 shadow-xl">
              {/* title & price */}
              <div className="mb-5">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                  {decodeHTMLEntities(product.name)}
                </h1>
                <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  ${currentPrice.toFixed(2)}
                </p>
              </div>

              {/* colour + size selectors */}
              <ProductOptions
                colors={product.colors || []}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                onColorSelect={setSelectedColor}
                onSizeSelect={setSelectedSize}
                isSizeAvailable={isSizeAvailable}
              />

              {/* quantity */}
              <div className="mb-5">
                <h3 className="text-base font-semibold text-gray-800 mb-3">
                  Quantity
                </h3>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border-2 border-white/60 bg-white/50 hover:border-orange-300 hover:bg-orange-50/50 flex items-center justify-center transition-all font-bold"
                  >
                    –
                  </motion.button>
                  <span className="w-12 text-center font-bold text-lg">
                    {quantity}
                  </span>
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

              {/* add-to-cart */}
              <div className="flex gap-3 mb-5 relative">
                {/* Floating Added message */}
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={showAddedMsg ? { opacity: 1, y: -32 } : { opacity: 0, y: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{ position: 'absolute', left: '50%', top: '-2.5rem', transform: 'translateX(-50%)', pointerEvents: 'none' }}
                >
                  {showAddedMsg && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-lg shadow font-semibold text-sm">
                      Added!
                    </span>
                  )}
                </motion.div>
                <motion.button
                  whileTap={isSizeAvailable(selectedSize) ? { scale: 0.92 } : {}}
                  animate={addedAnim ? { scale: 0.92 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  onClick={
                    isSizeAvailable(selectedSize) && !addedAnim ? handleAddToCart : undefined
                  }
                  disabled={!isSizeAvailable(selectedSize) || addedAnim}
                  className={`flex-1 py-3 px-5 rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-md ${
                    isSizeAvailable(selectedSize)
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    {isSizeAvailable(selectedSize) ? 'Add to Cart' : 'Size Unavailable'}
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 border-2 border-white/60 bg-white/50 rounded-lg hover:border-red-300 hover:bg-red-50/50 transition-all"
                >
                  <Heart className="w-5 h-5" />
                </motion.button>
              </div>

              {/* quick policies */}
              <div className="border-t border-white/40 pt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                  <Package className="w-4 h-4 text-orange-500" />
                  <span>30-day return policy.</span>
                  <button
                    className="text-orange-600 hover:text-orange-700 underline font-semibold"
                    onClick={() => {
                      setExpandedSections(prev => new Set(prev).add('returns'));
                      setTimeout(() => {
                        // Removed returnsRef usage to fix lint error
                        // If scroll-to-returns is needed, implement with a valid ref
                      }, 100);
                    }}
                  >
                    See details
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Secure payments accepted</span>
                </div>
              </div>
            </div>

            {/* accordion sections */}
            <ProductInfoSections
              product={product}
              expandedSections={expandedSections}
              setExpandedSections={setExpandedSections}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
