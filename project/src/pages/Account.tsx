import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  ShoppingBag,
  Package,
  Settings,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseAvailable } from '../lib/supabase';

/* demo constants */
const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const COLOR_OPTIONS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#A82235' },
];

const Account = () => {
  const { user, profile, signOut, loading, isAuthenticated } = useAuth();

  /* -------------------------------- state -------------------------------- */
  const [signingOut, setSigningOut] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
  });
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);

  /* --------------------------- sign-out handler --------------------------- */
  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setSigningOut(false);
    }
  };

  /* --------------- seed form fields from AuthContext ---------------------- */
  useEffect(() => {
    if (!user) return;

    setFormData({
      email: user.email ?? '',
      full_name: user.user_metadata?.full_name ?? profile?.full_name ?? '',
      phone: user.user_metadata?.phone ?? profile?.phone ?? '',
    });
  }, [user, profile]);

  /* ---- fetch preferences from Supabase (only if client is available) ----- */
useEffect(() => {
  if (!user || !isSupabaseAvailable()) {
    setLoadingProfile(false);      // ✅ guarantee clear
    return;
  }

  supabase!
    .from('profiles')
    .select('preferred_size, favorite_color')
    .eq('id', user.id)
    .single()
    .then(({ data, error }) => {
      if (error) console.error(error);
      setUserPrefs({
        size: data?.preferred_size ?? undefined,
        color: data?.favorite_color ?? undefined,
      });
    })
    .finally(() => setLoadingProfile(false));   // ✅ clear even on error
}, [user]);


  /* ------------------------------ save prefs ----------------------------- */
  const handleSavePreferences = async () => {
    if (!user) return;

    if (isSupabaseAvailable()) {
      await supabase!
        .from('profiles')
        .upsert({
          id: user.id,
          preferred_size: size,
          favorite_color: color,
        });
    }

    // persist locally so the UI reflects immediately
    localStorage.setItem(
      'userPref',
      JSON.stringify({ preferred_size: size, favorite_color: color }),
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
      .upsert({ id: user.id, full_name, phone });

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
                <Link
                  to="/account"
                  className="flex items-center justify-between p-3 rounded-lg bg-orange-50 text-orange-600"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                {[
                  { to: '/orders', icon: Package, label: 'Orders' },
                  { to: '/wishlist', icon: ShoppingBag, label: 'Wishlist' },
                  { to: '/settings', icon: Settings, label: 'Settings' },
                ].map(({ to, icon: Icon, label }) => (
                  <Link
                    key={label}
                    to={to}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ))}

                <button
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
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Account;
