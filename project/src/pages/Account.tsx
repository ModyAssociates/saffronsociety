import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  ShoppingBag,
  Package,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseAvailable } from '../lib/supabase';
import ProductCard from '../components/product/ProductCard';


/* demo constants */
import { AVAILABLE_SIZES, COLOR_NAME_TO_HEX } from '../constants/productConstants';

// Utility: Convert hex to HSL and return hue
function hexToHue(hex: string): number {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return Math.round(h * 360);
}

// Build Gildan color swatch array from COLOR_NAME_TO_HEX, sorted by hue
const GILDAN_COLOR_SWATCHES = Object.entries(COLOR_NAME_TO_HEX)
  .filter(([name, hex]) => !name.startsWith('#'))
  .map(([name, hex]) => ({ name, hex }))
  .sort((a, b) => hexToHue(a.hex) - hexToHue(b.hex));

const Account = () => {
  // Animated confirmation messages for each button
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [prefsMsg, setPrefsMsg] = useState<string | null>(null);
  const { user, profile, loading, isAuthenticated } = useAuth();

  // State
  const [signingOut, setSigningOut] = useState(false);
  const [activeSection, setActiveSection] = useState<'profile' | 'orders' | 'wishlist'>('profile');
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
  });
  const [size, setSize] = useState<string>('');
  const [colorHex, setColorHex] = useState<string>('');
  const [colorName, setColorName] = useState<string>('');
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
  // Wishlist state
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  // Fetch wishlist products when wishlist tab is active
  useEffect(() => {
    if (activeSection !== 'wishlist' || !user || !isSupabaseAvailable()) return;
    setLoadingWishlist(true);
    // 1. Get wishlist product IDs
    supabase!
      .from('wishlist')
      .select('product_id')
      .eq('user_id', user.id)
      .then(async ({ data, error }) => {
        if (error || !data?.length) {
          setWishlistProducts([]);
          setLoadingWishlist(false);
          return;
        }
        // 2. Fetch product details for each product_id
        const ids = data.map((row: any) => row.product_id);
        // Fetch all products from Printify API (via printify.ts)
        const res = await import('../services/printify');
        const { fetchPrintifyProducts } = res;
        const allProducts = await fetchPrintifyProducts();
        setWishlistProducts(allProducts.filter((p: any) => ids.includes(p.id)));
        setLoadingWishlist(false);
      });
  }, [activeSection, user]);

  // Populate formData from profile when user/profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.email || user?.email || '',
        full_name: profile.full_name || '',
        phone: (profile as any).phone || '', // fallback if phone is not typed
      });
    } else if (user) {
      setFormData({
        email: user.email || '',
        full_name: '',
        phone: '',
      });
    }
  }, [user, profile]);

  /* ---- fetch preferences from Supabase (only if client is available) ----- */
  useEffect(() => {
    if (!user || !isSupabaseAvailable()) {
      setLoadingProfile(false);
      return;
    }
    supabase!
      .from('profiles')
      .select('preferred_size, favorite_color, favorite_color_name')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
        } else {
          setSize(data?.preferred_size ?? '');
          setColorHex(data?.favorite_color ?? '');
          setColorName(data?.favorite_color_name ?? '');
        }
        setLoadingProfile(false);
      });
  }, [user]);

  // Sign out handler
  const handleSignOut = async () => {
    setSigningOut(true);
    // If you have a real signOut function from useAuth, call it here
    // await signOut();
    window.location.href = '/login';
  };


  /* ------------------------------ save prefs ----------------------------- */
  const handleSavePreferences = async () => {
    if (!user) return;
    // Only save if at least one is set
    if (!size && !colorHex) {
      setPrefsMsg('Please select a size and color to save your preferences.');
      setTimeout(() => setPrefsMsg(null), 2000);
      return;
    }
    // Never save empty string, only null for unset
    const safeSize = size && size.trim() !== '' ? size : null;
    const safeColorHex = colorHex && colorHex.trim() !== '' ? colorHex : null;
    const safeColorName = colorName && colorName.trim() !== '' ? colorName : null;
    if (isSupabaseAvailable()) {
      const { error } = await supabase!
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          preferred_size: safeSize,
          favorite_color: safeColorHex,
          favorite_color_name: safeColorName,
        });
      if (error) {
        setPrefsMsg('Failed to save preferences.');
        console.error(error);
        setTimeout(() => setPrefsMsg(null), 2000);
        return;
      }
    }
    // persist locally so the UI reflects immediately
    localStorage.setItem(
      'userPref',
      JSON.stringify({ preferred_size: safeSize, favorite_color: safeColorHex, favorite_color_name: safeColorName }),
    );
    setPrefsMsg('Preferences saved!');
    setTimeout(() => setPrefsMsg(null), 2000);
  };

  /* ------------------------------ save profile ---------------------------- */
  const handleSaveProfile = async () => {
    if (!user) return;
    if (!isSupabaseAvailable()) {
      setProfileMsg('Supabase not configured; cannot save profile.');
      setTimeout(() => setProfileMsg(null), 2000);
      return;
    }

    const { full_name, phone } = formData;
    const { data, error, status } = await supabase!
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        full_name,
        phone
      });

    if (error || status >= 400) {
      setProfileMsg('Failed to save profile info.');
      console.error(error);
    } else {
      setProfileMsg('Profile updated!');
    }
    setTimeout(() => setProfileMsg(null), 2000);
  };

  // Removed debug loading flags log

  /* ------------------------------- loading -------------------------------- */
  if (loading || loadingProfile)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );

  /* ------------------------ unauthenticated guard ------------------------- */
  if (!isAuthenticated || !user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Please log in to view your account</h2>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );

  /* ------------------------------- render --------------------------------- */
  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-8">My Account</h1>
          <div className="grid md:grid-cols-3 gap-8">
            {/* ------------ sidebar ------------ */}
            <aside className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-2">
                <button
                  type="button"
                  onClick={() => setActiveSection('profile')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg ${activeSection === 'profile' ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection('orders')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg ${activeSection === 'orders' ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5" />
                    <span>Orders</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection('wishlist')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg ${activeSection === 'wishlist' ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5" />
                    <span>Wishlist</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  <LogOut className="w-5 h-5" />
                  {signingOut ? 'Signing out…' : 'Sign Out'}
                </button>
              </div>
            </aside>

            {/* ------------ main ------------ */}
            <section className="md:col-span-2 space-y-8">
              {activeSection === 'profile' && (
                <div>
                  {/* profile card */}
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                    <div className="space-y-6">
                      {['email', 'full_name', 'phone'].map(field => (
                        <div key={field}>
                          <label className="block text-sm font-medium mb-2 capitalize">
                            {field.replace('_', ' ')}
                          </label>
                          <input
                            type={field === 'email' ? 'email' : 'text'}
                            value={(formData as any)[field]}
                            onChange={e =>
                              setFormData({ ...formData, [field]: e.target.value })
                            }
                            disabled={field === 'email'}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      ))}
                      <div className="relative">
                        <motion.div
                          initial={false}
                          animate={profileMsg ? { opacity: 1, y: -24 } : { opacity: 0, y: 0 }}
                          transition={{ duration: 0.5 }}
                          style={{ pointerEvents: 'none', position: 'absolute', left: '50%', bottom: '100%', transform: 'translateX(-50%)', marginBottom: '0.5rem' }}
                        >
                          {profileMsg && (
                            <span className="bg-green-500 text-white px-4 py-2 rounded-lg shadow font-semibold text-base">
                              {profileMsg}
                            </span>
                          )}
                        </motion.div>
                        <button
                          onClick={handleSaveProfile}
                          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* preferences */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6">Preferences</h2>
                    <div className="space-y-4">
                      {/* size */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Preferred Size</label>
                        <select
                          value={size}
                          onChange={e => setSize(e.target.value)}
                          className="w-full border rounded px-3 py-2"
                        >
                          <option value="">Select size</option>
                          {AVAILABLE_SIZES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      {/* color */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Favorite Color</label>
                        <div className="grid grid-cols-8 gap-2 mb-2">
                          {GILDAN_COLOR_SWATCHES.map((c, idx) => (
                            <button
                              key={`${c.hex}-${c.name}-${idx}`}
                              type="button"
                              className={`w-7 h-7 rounded-full border transition focus:outline-none relative group ${colorHex === c.hex ? 'border-orange-500 ring-2 ring-orange-300' : 'border-gray-200 hover:border-orange-300'}`}
                              style={{ backgroundColor: c.hex }}
                              onClick={() => { setColorHex(c.hex); setColorName(c.name); }}
                              aria-label={c.name}
                            >
                              {/* Tooltip */}
                              <span className="absolute z-10 left-1/2 -translate-x-1/2 -top-8 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none whitespace-nowrap">
                                {c.name}
                              </span>
                            </button>
                          ))}
                        </div>
                        <select
                          value={colorHex}
                          onChange={e => {
                            const selected = GILDAN_COLOR_SWATCHES.find(c => c.hex === e.target.value);
                            setColorHex(e.target.value);
                            setColorName(selected ? selected.name : '');
                          }}
                          className="w-full border rounded px-3 py-2 mt-2"
                        >
                          <option value="">Select color</option>
                          {GILDAN_COLOR_SWATCHES.map((c, idx) => (
                            <option key={`${c.hex}-${c.name}-${idx}`} value={c.hex}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="relative">
                        <motion.div
                          initial={false}
                          animate={prefsMsg ? { opacity: 1, y: -24 } : { opacity: 0, y: 0 }}
                          transition={{ duration: 0.5 }}
                          style={{ pointerEvents: 'none', position: 'absolute', left: '50%', bottom: '100%', transform: 'translateX(-50%)', marginBottom: '0.5rem' }}
                        >
                          {prefsMsg && (
                            <span className="bg-green-500 text-white px-4 py-2 rounded-lg shadow font-semibold text-base">
                              {prefsMsg}
                            </span>
                          )}
                        </motion.div>
                        <button
                          onClick={handleSavePreferences}
                          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                        >
                          Save Preferences
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeSection === 'orders' && (
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <h2 className="text-xl font-semibold mb-6">Orders</h2>
                  <p className="text-gray-500">You have no orders yet.</p>
                </div>
              )}
              {activeSection === 'wishlist' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6">Wishlist</h2>
                  {loadingWishlist ? (
                    <div className="flex items-center justify-center min-h-[120px]">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {wishlistProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Account;
