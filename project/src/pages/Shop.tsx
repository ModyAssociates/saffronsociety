import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter, X, Search, Loader2 } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { fetchProducts } from '../data/products';
import type { Product } from '../types/index';

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDesign, setSelectedDesign] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Memoize filtered and sorted products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Apply filters
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedDesign !== 'all') {
      filtered = filtered.filter((product) => {
        const designName = product.name.toLowerCase();
        return designName.includes(selectedDesign.toLowerCase());
      });
    }

    if (selectedYear !== 'all') {
      filtered = filtered.filter((product) => product.name.includes(selectedYear));
    }

    if (selectedStyle !== 'all') {
      filtered = filtered.filter((product) => {
        const styleName = product.name.toLowerCase();
        return styleName.includes(selectedStyle.toLowerCase());
      });
    }

    if (selectedColor !== 'all') {
      filtered = filtered.filter((product) =>
        product.colors?.some(
          (color) => color.name.toLowerCase() === selectedColor.toLowerCase()
        )
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'newest':
        filtered.sort((a, b) => {
          const yearA = parseInt(a.name.match(/\d{4}/)?.[0] || '0');
          const yearB = parseInt(b.name.match(/\d{4}/)?.[0] || '0');
          return yearB - yearA;
        });
        break;
      default:
        // 'featured' - keep original order
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedDesign, selectedYear, selectedStyle, selectedColor, sortBy]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedProducts, page]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedDesign, selectedYear, selectedStyle, selectedColor, sortBy]);

  // Extract unique values for filters
  const designs = useMemo(() => {
    const uniqueDesigns = new Set<string>();
    products.forEach((product) => {
      const match = product.name.match(/^([^(]+)/)?.[1]?.trim();
      if (match) uniqueDesigns.add(match);
    });
    return Array.from(uniqueDesigns).sort();
  }, [products]);

  const years = useMemo(() => {
    const uniqueYears = new Set<string>();
    products.forEach((product) => {
      const year = product.name.match(/\((\d{4})\)/)?.[1];
      if (year) uniqueYears.add(year);
    });
    return Array.from(uniqueYears).sort((a, b) => parseInt(b) - parseInt(a));
  }, [products]);

  const styles = useMemo(() => {
    const uniqueStyles = new Set<string>();
    products.forEach((product) => {
      const style = product.name.match(/—\s*([^—]+)$/)?.[1]?.trim();
      if (style) uniqueStyles.add(style);
    });
    return Array.from(uniqueStyles).sort();
  }, [products]);

  const colors = useMemo(() => {
    const uniqueColors = new Set<string>();
    products.forEach((product) => {
      product.colors?.forEach((color: any) => uniqueColors.add(color.name));
    });
    return Array.from(uniqueColors).sort();
  }, [products]);

  // Debounced search
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setSearchQuery(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-100 via-yellow-50 to-orange-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop Our Collection</h1>
            <p className="text-lg text-gray-600">Discover unique designs that celebrate culture and heritage</p>
          </motion.div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="featured">Featured</option>
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              {/* Design Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Design</label>
                <select
                  value={selectedDesign}
                  onChange={(e) => setSelectedDesign(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Designs</option>
                  {designs.map((design) => (
                    <option key={design} value={design}>{design}</option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Years</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Style Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Styles</option>
                  {styles.map((style) => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>

              {/* Color Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Colors</option>
                  {colors.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDesign('all');
                  setSelectedYear('all');
                  setSelectedStyle('all');
                  setSelectedColor('all');
                  setSortBy('featured');
                }}
                className="w-full py-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm text-gray-700 hover:bg-gray-50"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Showing {paginatedProducts.length} of {filteredAndSortedProducts.length} products
              </p>
            </div>

            {/* Products */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found matching your filters.</p>
              </div>
            ) : (
              <>
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {paginatedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= page - 1 && pageNum <= page + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg ${
                              page === pageNum
                                ? 'bg-orange-500 text-white'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (pageNum === page - 2 || pageNum === page + 2) {
                        return <span key={pageNum} className="px-2">...</span>;
                      }
                      return null;
                    })}

                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;