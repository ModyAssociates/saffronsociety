import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CartDropdown from '../cart/CartDropdown';
import logo from '../../assets/logo_big.png'


type HeaderProps = {
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
};

const Header = ({ isCartOpen, setIsCartOpen }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state } = useCart();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="Saffron Society Logo"
                  className="h-14 w-auto mr-2"
                />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors hover:text-maroon ${
                  location.pathname === item.path ? 'text-maroon' : 'text-neutral-800'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Cart Icon */}
          <div className="flex items-center">
            <button
              className="relative p-2"
              onClick={() => setIsCartOpen(!isCartOpen)}
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-6 w-6 text-neutral-800 hover:text-maroon transition-colors" />
              {state.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-saffron text-xs font-bold text-neutral-800 rounded-full h-5 w-5 flex items-center justify-center">
                  {state.totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="ml-4 p-2 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-neutral-800" />
              ) : (
                <Menu className="h-6 w-6 text-neutral-800" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 animate-fade-in">
            <ul className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`block py-2 font-medium transition-colors hover:text-maroon ${
                      location.pathname === item.path ? 'text-maroon' : 'text-neutral-800'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {/* Cart Dropdown */}
      <CartDropdown isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;