import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ChevronLeft, Package, Shield } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { fetchPrintifyProducts } from '../services/printify';
import placeholderImg from '../assets/logo_big.png';
import ProductGallery from '../components/product/ProductGallery';
import { extractDesignHighlights, HighlightItem } from '../utils/extractDesignHighlights';
import ProductOptions from '../components/product/ProductOptions';
import ProductInfoSections from '../components/product/ProductInfoSections';
import { AVAILABLE_SIZES, COLOR_NAME_TO_HEX } from '../constants/productConstants';
import { decodeHTMLEntities } from '../utils/productUtils';
import { motion } from 'framer-motion';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>(AVAILABLE_SIZES[2]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);

  // Design Highlights state for client-side extraction
  const [designHighlights, setDesignHighlights] = useState<HighlightItem[]>([]);

  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (product?.description) {
      console.log('[debug] raw product.description:', product.description);
      setDesignHighlights(extractDesignHighlights(product.description));
    }
  }, [product?.description]);

  useEffect(() => {
    if (product && selectedSize) {
      updatePrice();
    }
  }, [product, selectedSize, selectedColor]);

  useEffect(() => {
    if (!product || !selectedColor) return;
    let colorName = product.colors?.find(c => c.hex === selectedColor)?.name || selectedColor;
    if (product.imagesByColor && product.imagesByColor[colorName]) {
      const colorImages = product.imagesByColor[colorName];
      let angles: string[] = [];
      if (colorImages.angles) {
        if (Array.isArray(colorImages.angles)) {
          angles = colorImages.angles;
        } else if (typeof colorImages.angles === 'object') {
          angles = Object.values(colorImages.angles).flat() as string[];
        }
      }
      const angleOrder = [
        'front',
        'back',
        'front collar closeup',
        'folded',
      ];
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
    if (!product) return;
    const selectedColorName = product.colors?.find(c => c.hex === selectedColor)?.name;
    const matchingVariant = product.variants?.find(v => {
      const sizeMatch = v.size === selectedSize;
      const colorMatch = v.color?.toLowerCase() === selectedColorName?.toLowerCase();
      return sizeMatch && colorMatch;
    });
    if (matchingVariant) {
      setCurrentPrice(matchingVariant.price);
    } else {
      const lowestPrice = product.variants && product.variants.length > 0
        ? Math.min(...product.variants.filter(v => v.is_enabled).map(v => v.price))
        : product.price;
      setCurrentPrice(lowestPrice);
    }
  };

  const isSizeAvailable = (size: string): boolean => {
    if (!product || !product.variants) return false;
    const selectedColorName = product.colors?.find(c => c.hex === selectedColor)?.name;
    return product.variants.some(v =>
      v.size === size &&
      v.color?.toLowerCase() === selectedColorName?.toLowerCase() &&
      v.is_enabled
    );
  };

  async function loadProduct() {
    try {
      setLoading(true);
      const products = await fetchPrintifyProducts();
      const found = products.find(p => p.id === id);
      if (found) {
        setProduct(found);
        const firstImage = found.images && found.images.length > 0
          ? found.images[0]
          : typeof found.image === 'string'
            ? found.image
            : found.image?.src || placeholderImg;
        setMainImage(firstImage);
        setSelectedColor(found.colors?.[0]?.hex || found.colors?.[0]?.name || '');
        const lowestPrice = found.variants && found.variants.length > 0
          ? Math.min(...found.variants.filter(v => v.is_enabled).map(v => v.price))
          : found.price;
        setCurrentPrice(lowestPrice);
      }
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, selectedSize, selectedColor, quantity);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = placeholderImg;
  };

  const hexToName = (hex: string): string => {
    const entry = Object.entries(COLOR_NAME_TO_HEX).find(([_, value]) => value.toLowerCase() === hex.toLowerCase());
    return entry ? entry[0] : hex;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
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

  const productImages = galleryImages.length > 0 ? galleryImages : [typeof product.image === 'string' ? product.image : product.image?.src || placeholderImg];

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
          {/* Image Gallery with Design Highlights */}
    

          <ProductGallery
            productName={product.name}
            mainImage={mainImage}
            productImages={productImages}
            onImageSelect={setMainImage}
            onImageError={handleImageError}
            designHighlights={designHighlights}
          />

          {/* Product Info */}
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-5 border border-white/40 shadow-xl">
              <div className="mb-5">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                  {decodeHTMLEntities(product.name)}
                </h1>
                {/* Design Highlights Trigger Button */}
                
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
            </div>

            {/* Product Information Sections */}
            <ProductInfoSections product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
