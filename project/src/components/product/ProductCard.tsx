/* src/components/product/ProductCard.tsx */
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';
import type { Product } from '../../types';
import {
   getColorNameFromHex      // ← we’ll use this in a second
} from "../../constants/productConstants";
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { normalizeImageUrl } from '../../services/printify';
import {
  decodeHTMLEntities,
  extractWhyYoullLoveIt,
} from '../../utils/productUtils';
import { supabase, isSupabaseAvailable } from '../../lib/supabase'; // ✅ correct path

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  /* ---------------- state ---------------- */
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [userPrefs, setUserPrefs] = useState<{ size?: string; color?: string }>(
    {},
  );

  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Wishlist state
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState<string | null>(null);

  // Check if product is in wishlist on mount (if user)
  useEffect(() => {
    if (!user || !isSupabaseAvailable()) return;
    setWishlistLoading(true);
    setWishlistError(null);

    const fetchWishlistStatus = async () => {
      try {
        const { data, error } = await supabase!
          .from('wishlist')
          .select('product_id')
          .eq('user_id', user.id)
          .eq('product_id', product.id)
          .maybeSingle();
        setWishlisted(!!data && !error);
        setWishlistLoading(false);
        if (error) setWishlistError('Could not fetch wishlist status.');
      } catch {
        setWishlistError('Could not fetch wishlist status.');
        setWishlistLoading(false);
      }
    };

    fetchWishlistStatus();
  }, [user, product.id]);

  // Wishlist handler
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistError(null);
    if (!user || !isSupabaseAvailable()) {
      setWishlistError('Please log in to use wishlist.');
      return;
    }
    setWishlistLoading(true);
    // Optimistic UI update
    setWishlisted((prev) => !prev);
    try {
      if (wishlisted) {
        // Remove from wishlist
        const { error } = await supabase!
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);
        if (error) {
          setWishlisted(true); // rollback
          setWishlistError('Failed to remove from wishlist.');
        }
      } else {
        // Add to wishlist
        const { error } = await supabase!
          .from('wishlist')
          .upsert({ user_id: user.id, product_id: product.id });
        if (error) {
          setWishlisted(false); // rollback
          setWishlistError('Failed to add to wishlist.');
        }
      }
    } catch {
      setWishlisted((prev) => !prev); // rollback
      setWishlistError('Something went wrong.');
    } finally {
      setWishlistLoading(false);
    }
  };

  /* ---------- fetch user prefs from Supabase ---------- */
  useEffect(() => {
    if (!user || !isSupabaseAvailable()) return;

    supabase!
      .from('profiles')
      .select('preferred_size, favorite_color')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          return;
        }
        setUserPrefs({
          size: data?.preferred_size ?? undefined,
          color: data?.favorite_color ?? undefined,
        });
      });
  }, [user]);

  /* ---------------- image helper ---------------- */
  const currentImage = (() => {
    try {
      if (!product.images?.length) return '/assets/logo_big.png';
      return normalizeImageUrl(
        product.images[selectedColorIndex] ?? product.images[0],
      );
    } catch {
      return '/assets/logo_big.png';
    }
  })();

  /* ---------------- cart handler ---------------- */
  const handleAddToCart = () => {
    const availableSizes = product.sizes || [];
    const availableColors = product.colors || [];
    const selectedColorObj = availableColors[selectedColorIndex];
    const selectedColorHex = selectedColorObj?.hex || '';
    const selectedColorName = selectedColorObj?.name || getColorNameFromHex(selectedColorHex);
    const selectedSize = userPrefs.size || availableSizes[0] || '';
    if (selectedColorHex && selectedSize) {
      addItem(product, selectedSize, selectedColorHex, 1, selectedColorName);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  /* ---------------- why-snippet ---------------- */
  const whySnippet = (() => {
    const full = extractWhyYoullLoveIt(product.description ?? '');
    if (!full) return 'Soft cotton. Iconic vibes.';
    return full.length > 110 ? `${full.slice(0, 107).trimEnd()}…` : full;
  })();

  /* ---------------- render ---------------- */
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
    >
      <Link to={`/product/${product.id}`}>
        {/* image */}
        <div className="relative w-full aspect-[4/5] overflow-hidden">
          {/* Wishlist heart icon */}
          <button
            type="button"
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={wishlistLoading ? undefined : handleWishlistToggle}
            className={`absolute top-2 left-2 z-10 bg-white/80 rounded-full p-1 hover:bg-pink-100 transition ${wishlistLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={wishlistLoading}
          >
            {wishlistLoading ? (
              <span className="w-5 h-5 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-pink-500" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              </span>
            ) : wishlisted ? (
              <Heart className="w-5 h-5 text-pink-500 fill-pink-500" fill="#ec4899" />
            ) : (
              <Heart className="w-5 h-5 text-gray-400" />
            )}
          </button>
          {wishlistError && (
            <div className="absolute top-12 left-2 bg-red-100 text-red-700 text-xs rounded px-2 py-1 shadow z-20">
              {wishlistError}
            </div>
          )}
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-black" />
            </div>
          )}

          <img
            src={imageError ? '/assets/logo_big.png' : currentImage}
            alt={decodeHTMLEntities(product.name)}
            loading="lazy"
            className={`object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => {
              setImageLoading(false);
              setImageError(false);
            }}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
          />

          {/* NEW badge */}
          {product.createdAt &&
            (Date.now() - new Date(product.createdAt).getTime()) / 86_400_000 <=
              7 && (
              <div className="absolute top-2 right-2 bg-white text-black text-xs font-semibold px-2 py-1 rounded-md shadow">
                NEW
              </div>
            )}
        </div>

        {/* details */}
        <div className="p-4">
          <h3 className="text-lg font-semibold font-playfair leading-tight text-gray-900 line-clamp-2 min-h-[3.5rem]">
            {decodeHTMLEntities(product.name)}
          </h3>

            <div className="flex items-center justify-between mt-3">
            {/* price */}
            <span className="text-base font-bold text-gray-900">
              $
              {(
                product.variants?.length
                  ? Math.min(
                      ...product.variants
                        .filter(v => v.is_enabled)
                        .map(v => v.price),
                    )
                  : product.price
              ).toFixed(2)}
            </span>

            {/* colour dots and name */}
            <div className="flex flex-col items-end">
              <div className="flex gap-1 mb-1">
                {product.colors?.length ? (
                  <>
                    {product.colors.slice(0, 3).map((c, idx) => (
                      <button
                        key={idx}
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedColorIndex(idx);
                        }}
                        title={c.name}
                        className={`w-4 h-4 rounded-full border ${
                          idx === selectedColorIndex
                            ? 'border-gray-700 ring-2 ring-gray-700 ring-offset-1'
                            : 'border-gray-300 hover:border-gray-500'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                    {product.colors.length > 3 && (
                      <span className="text-xs text-gray-500 ml-1">
                        +{product.colors.length - 3}
                      </span>
                    )}
                  </>
                ) : (
                  ['#000', '#fff', '#A82235'].map(hex => (
                    <span
                      key={hex}
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: hex }}
                    />
                  ))
                )}
              </div>
              {/* Show selected color name */}
              {product.colors?.length > 0 && (
                <span className="text-xs text-gray-600 font-medium">
                  {getColorNameFromHex(product.colors[selectedColorIndex]?.hex || '')}
                </span>
              )}
            </div>
          </div>

          {/* add to cart */}
          <div className="mt-4">
            <button
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart();
              }}
              className="w-full bg-black text-white text-sm py-2 px-4 rounded-md hover:bg-gray-900 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </button>
          </div>

          {/* why you'll love it */}
          <div className="mt-3 text-xs text-gray-500 italic">
            ✨ Why You'll Love It:
            <span className="block text-gray-700 not-italic font-normal mt-1">
              {whySnippet}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
