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
const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const COLOR_OPTIONS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#A82235' },
];

const Account = () => {
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
  const [color, setColor] = useState<string>('');
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
      .select('preferred_size, favorite_color')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
        } else {
          setSize(data?.preferred_size ?? '');
          setColor(data?.favorite_color ?? '');
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
    if (!size && !color) {
      alert('Please select a size and color to save your preferences.');
      return;
    }
    // Never save empty string, only null for unset
    const safeSize = size && size.trim() !== '' ? size : null;
    const safeColor = color && color.trim() !== '' ? color : null;
    if (isSupabaseAvailable()) {
      const { error } = await supabase!
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          preferred_size: safeSize,
          favorite_color: safeColor,
        });
      if (error) {
        alert('Failed to save preferences.');
        console.error(error);
        return;
      }
    }
    // persist locally so the UI reflects immediately
    localStorage.setItem(
      'userPref',
      JSON.stringify({ preferred_size: safeSize, favorite_color: safeColor }),
    );
    alert('Preferences saved!');
  };

  /* ------------------------------ save profile ---------------------------- */
  const handleSaveProfile = async () => {
    if (!user) return;
    if (!isSupabaseAvailable()) {
      alert('Supabase not configured; cannot save profile.');
      return;
    }

    const { full_name, phone } = formData;
    const { error } = await supabase!
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        full_name,
        phone
      });

    if (error) {
      alert('Failed to save profile info.');
      console.error(error);
    } else {
      alert('Profile updated!');
    }
  };

  console.log('[Account] loading flags →', { authLoading: loading, loadingProfile });

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
                <>
                  {/* profile */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
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
                      <button
                        onClick={handleSaveProfile}
                        className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                  {/* preferences */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6">Preferences</h2>
                    <div className="space-y-4">
                      {/* size */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Preferred Size
                        </label>
                        <select
                          value={size}
                          onChange={e => setSize(e.target.value)}
                          className="w-full border rounded px-3 py-2"
                        >
                          <option value="">Select size</option>
                          {AVAILABLE_SIZES.map(s => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* color */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Favorite Color
                        </label>
                        <select
                          value={color}
                          onChange={e => setColor(e.target.value)}
                          className="w-full border rounded px-3 py-2"
                        >
                          <option value="">Select color</option>
                          {COLOR_OPTIONS.map(c => (
                            <option key={c.hex} value={c.hex}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={handleSavePreferences}
                        className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </>
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
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
                    </div>
                  ) : wishlistProducts.length === 0 ? (
                    <p className="text-gray-500 text-center">Your wishlist is empty.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {wishlistProducts.map(product => (
                        <div key={product.id}>
                          {/* @ts-ignore: ProductCard expects Product type */}
                          <
                            ProductCard product={product} />
                        </div>
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
