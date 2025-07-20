import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Menu, X, User, LogOut, Shield } from 'lucide-react'
import { FiLogOut } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

export default function Header() {
  const { user, profile, isAdmin, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const cartContext = useCart()
  const navigate = useNavigate()
  const userMenuRef = useRef<HTMLDivElement>(null)
  const itemCount = cartContext.itemCount

  const handleSignOut = async () => {
    try {
      console.log('Sign out button clicked');
      setIsUserMenuOpen(false); // Close the menu immediately
      await signOut();
      console.log('Sign out successful, navigating to home');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
      // Still navigate away even if there's an error
      navigate('/', { replace: true });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="bg-gradient-to-r from-orange-100 via-yellow-50 to-orange-200 shadow-lg sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative overflow-visible">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <motion.h1 
              className="text-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              SAFFRON SOCIETY TEES
            </motion.h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { to: "/", label: "Home" },
              { to: "/shop", label: "Shop" },
              { to: "/about", label: "About" }
            ].map((link) => (
              <motion.div key={link.to} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link 
                  to={link.to} 
                  className="relative text-gray-700 hover:text-orange-600 transition-colors font-medium group"
                >
                  {link.label}
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* User Authentication & Cart */}
          <div className="flex items-center space-x-3">
            {/* User Menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  {profile?.full_name && (
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {profile.full_name.split(' ')[0]}
                    </span>
                  )}
                </motion.button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/40 py-2 z-50"
                    >
                      <Link
                        to="/account"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        My Account
                      </Link>
                      
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Panel
                        </Link>
                      )}
                      
                      <hr className="my-2 border-gray-200" />
                      
                      {/* Update the sign out button in the dropdown */}
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/account"
                  className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full hover:from-orange-600 hover:to-yellow-600 transition-all font-medium shadow-md"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden md:block text-sm">Login</span>
                </Link>
              </motion.div>
            )}

            {/* Cart Icon */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="relative">
              <Link to="/cart" className="relative p-2 rounded-full hover:bg-white/30 transition-colors flex items-center justify-center min-w-[40px] min-h-[40px]">
                <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-orange-600 transition-colors" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg min-w-[20px] z-10"
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </motion.span>
                )}
              </Link>
            </motion.div>

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden ml-4 p-2 rounded-full hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gradient-to-r from-orange-50 via-yellow-25 to-orange-100 border-t border-orange-200/50 backdrop-blur-sm"
          >
            <div className="px-4 py-2 space-y-1">
              {[
                { to: "/", label: "Home" },
                { to: "/shop", label: "Shop" },
                { to: "/about", label: "About" }
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block py-3 px-2 text-gray-700 hover:text-orange-600 hover:bg-white/50 rounded-lg transition-all font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Cart Link */}
              <Link
                to="/cart"
                className="flex items-center py-3 px-2 text-gray-700 hover:text-orange-600 hover:bg-white/50 rounded-lg transition-all font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart {itemCount > 0 && `(${itemCount})`}
              </Link>
              
              {/* Mobile Authentication Links */}
              <hr className="my-2 border-orange-200" />
              
              {user ? (
                <>
                  <Link
                    to="/account"
                    className="flex items-center py-3 px-2 text-gray-700 hover:text-orange-600 hover:bg-white/50 rounded-lg transition-all font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    My Account
                  </Link>
                  
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center py-3 px-2 text-gray-700 hover:text-orange-600 hover:bg-white/50 rounded-lg transition-all font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center w-full py-3 px-2 text-gray-700 hover:text-orange-600 hover:bg-white/50 rounded-lg transition-all font-medium"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/account"
                  className="flex items-center py-3 px-2 text-gray-700 hover:text-orange-600 hover:bg-white/50 rounded-lg transition-all font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Login / Sign Up
                </Link>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}