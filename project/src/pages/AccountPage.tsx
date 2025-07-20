import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiPackage, FiEdit2, FiCheck, FiX } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AccountPage() {
  const { user, profile, loading } = useAuth()
  const [isEditingName, setIsEditingName] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [isSaving, setIsSaving] = useState(false)

  // If still loading, show loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </motion.div>
      </div>
    )
  }

  // If not authenticated, redirect to home
  if (!user) {
    return <Navigate to="/" replace />
  }

  const handleSaveName = async () => {
    if (!user || !supabase) return
    
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id)

      if (error) throw error

      // Update the user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      })

      if (updateError) throw updateError

      setIsEditingName(false)
      // Reload the page to refresh the profile data
      window.location.reload()
    } catch (error) {
      console.error('Error updating name:', error)
      alert('Failed to update name. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setFullName(profile?.full_name || '')
    setIsEditingName(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        {/* Profile Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiUser className="text-orange-500" />
            Profile Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      disabled={isSaving}
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={isSaving}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-md disabled:opacity-50"
                    >
                      <FiCheck className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <p className="flex-1 text-gray-900">
                      {profile?.full_name || 'Not set'}
                    </p>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-md"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900 flex items-center gap-2">
                <FiMail className="text-gray-400" />
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiPackage className="text-orange-500" />
            Order History
          </h2>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">No orders yet</p>
            <p className="text-sm text-gray-500 mt-2">
              When you make your first purchase, it will appear here.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}