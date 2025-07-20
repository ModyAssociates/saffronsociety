import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, ShoppingBag, Package, Settings, ChevronRight, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Account = () => {
  const { user, profile, signOut, loading, isAuthenticated } = useAuth()
  const [signingOut, setSigningOut] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: ''
  })

  const handleSignOut = async () => {
    try {
      setSigningOut(true)
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setSigningOut(false)
    }
  }

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        full_name: user.user_metadata?.full_name || profile?.full_name || '',
        phone: user.user_metadata?.phone || profile?.phone || ''
      })
    }
  }, [user, profile])

  // Add loading state check
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Add authentication check
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in to view your account</h2>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-2">
                  <Link
                    to="/account"
                    className="flex items-center justify-between p-3 rounded-lg bg-orange-50 text-orange-600"
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5" />
                      <span className="font-medium">Profile</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/orders"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5" />
                      <span className="font-medium">Orders</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/wishlist"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-5 h-5" />
                      <span className="font-medium">Wishlist</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5" />
                      <span className="font-medium">Settings</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">
                        {signingOut ? 'Signing out...' : 'Sign Out'}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      disabled
                    />
                  </div>

                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Account
