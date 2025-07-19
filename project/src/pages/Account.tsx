import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { User, Package, LogOut, AlertCircle } from 'lucide-react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase, isSupabaseAvailable } from '../lib/supabase'

const Account = () => {
  const { user, profile, signOut, loading } = useAuth()
  const [signingOut, setSigningOut] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!user) {
    // If Supabase is not available, show a simple message
    if (!supabase) {
      return (
        <div className="min-h-screen py-16">
          <div className="max-w-md mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-8">Account</h1>
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800">Authentication is currently not configured.</p>
              <p className="text-sm text-amber-600 mt-2">
                Please configure Supabase to enable user accounts.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen py-16">
        <div className="max-w-md mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">Welcome to Saffron Society</h1>
          
          {authError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">
                <p className="font-semibold">Authentication Error</p>
                <p>{authError}</p>
                {authError.includes('Facebook') && (
                  <p className="mt-2">Facebook login is not yet configured. Please use email or Google login instead.</p>
                )}
              </div>
            </div>
          )}
          
          <Auth
            supabaseClient={supabase!}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#f97316',
                    brandAccent: '#ea580c',
                  },
                },
              },
            }}
            providers={['google']} // Remove Facebook until it's configured
            redirectTo={`${window.location.origin}/account`}
            onlyThirdPartyProviders={false}
            view="sign_in"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                <LogOut className="w-5 h-5" />
                {signingOut ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || 'User avatar'}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-orange-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {profile?.full_name || 'Customer'}
                  </h2>
                  <p className="text-gray-600">{user.email}</p>
                  {profile?.role === 'admin' && (
                    <span className="inline-block mt-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                      Admin
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order History
                </h3>
                <p className="text-gray-600">No orders yet. Start shopping!</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Account
