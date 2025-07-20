import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // This page exists solely to handle OAuth callbacks
    // The AuthContext will process the tokens in the URL
    console.log('🔥 OAuth callback page loaded')
    console.log('🔥 Current URL:', window.location.href)
    
    // Give the AuthContext time to process the tokens
    const timer = setTimeout(() => {
      console.log('🔥 Redirecting to account page...')
      navigate('/account')
    }, 1000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </motion.div>
    </div>
  )
}