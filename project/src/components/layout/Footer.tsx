import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-maroon text-white mt-16">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* About */}
          <div className="md:col-span-2">
            <h3 className="font-playfair text-xl mb-4">Saffron Society</h3>
            <p className="mb-4 text-white/80">
              Premium t-shirts featuring iconic vintage Bollywood designs.
              Each piece celebrates the rich cultural heritage of Indian cinema.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-saffron transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-saffron transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-saffron transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-playfair text-xl mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/80 hover:text-saffron transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-white/80 hover:text-saffron transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/80 hover:text-saffron transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-saffron transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-playfair text-xl mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-white/80 hover:text-saffron transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-white/80 hover:text-saffron transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/shirt-quality" className="text-white/80 hover:text-saffron transition-colors">
                  Quality Guarantee
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-playfair text-xl mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-white/80">
                Email: support@saffronsociety.com
              </li>
              <li className="text-white/80">
                Ontario, Canada
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/80">© 2025 Saffron Society. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;