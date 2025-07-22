/* src/components/product/ProductCard.tsx */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '../../types';
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
    let color = product.colors?.[selectedColorIndex]?.hex ?? '#000000';
    let size = product.sizes?.[0] ?? 'M';

    if (userPrefs.size && product.sizes?.includes(userPrefs.size))
      size = userPrefs.size;
    if (
      userPrefs.color &&
      product.colors?.some(
        c => c.hex.toLowerCase() === userPrefs.color!.toLowerCase(),
      )
    )
      color = userPrefs.color!;

    addItem(product, size, color);
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

            {/* colour dots */}
            <div className="flex gap-1">
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
