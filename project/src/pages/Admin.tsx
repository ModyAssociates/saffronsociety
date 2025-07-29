import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { addBlogPost } from '../services/blog';
import { Package, Users, DollarSign, TrendingUp, Calendar, Search, Download, Eye, CheckCircle, XCircle, Clock, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

const Admin = () => {
  const { isAdmin, loading: authLoading, profile } = useAuth();
  const navigate = useNavigate();
  const [adminTab, setAdminTab] = useState(0);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    monthlyRevenue: 0,
    monthlyGrowth: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogError, setBlogError] = useState<string | null>(null);
  const [blogSuccess, setBlogSuccess] = useState<string | null>(null);
  const [blogLoading, setBlogLoading] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
    } else if (isAdmin) {
      fetchDashboardData();
    }
    // eslint-disable-next-line
  }, [isAdmin, authLoading, navigate]);

  const fetchDashboardData = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      // Fetch orders with user data
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`*, profiles:user_id (email, full_name)`)
        .order('created_at', { ascending: false });
      if (ordersError) throw ordersError;
      setOrders(ordersData || []);
      // Calculate stats
      const totalOrders = ordersData?.length || 0;
      const totalRevenue = ordersData?.reduce((sum, order) => sum + order.total, 0) || 0;
      const pendingOrders = ordersData?.filter(order => order.status === 'pending').length || 0;
      const uniqueCustomers = new Set(ordersData?.map(order => order.user_id)).size;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyOrders = ordersData?.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      }) || [];
      const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.total, 0);
      setStats({
        totalOrders,
        totalRevenue,
        totalCustomers: uniqueCustomers,
        pendingOrders,
        monthlyRevenue,
        monthlyGrowth: 0 // implement as needed
      });
    } catch (e) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      !searchTerm ||
      order.id.includes(searchTerm) ||
      (order.profiles?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing': return <Package className="w-4 h-4 text-blue-500" />;
      case 'shipped': return <Truck className="w-4 h-4 text-purple-500" />;
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogError(null);
    setBlogSuccess(null);
    setBlogLoading(true);
    try {
      if (!blogTitle.trim() || !blogContent.trim()) {
        setBlogError('Title and content are required.');
        setBlogLoading(false);
        return;
      }
      if (!coverFile) {
        setBlogError('A cover image is required.');
        setBlogLoading(false);
        return;
      }
      let coverImageUrl: string | undefined = undefined;
      if (coverFile) {
        if (!supabase) {
          setBlogError('Supabase client not available.');
          setBlogLoading(false);
          return;
        }
        const bucket = 'blog-covers';
        const fileExt = coverFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        let uploadError = null;
        let publicUrl = '';
        try {
          const uploadRes = await supabase.storage.from(bucket).upload(fileName, coverFile, { upsert: false });
          if (uploadRes.error) throw uploadRes.error;
          const urlRes = supabase.storage.from(bucket).getPublicUrl(fileName);
          publicUrl = urlRes.data?.publicUrl;
        } catch (err: any) {
          uploadError = err?.message || 'Image upload failed.';
        }
        if (uploadError || !publicUrl) {
          setBlogError('Failed to upload cover image. Please check your Supabase Storage bucket permissions and existence.');
          setBlogLoading(false);
          return;
        }
        coverImageUrl = publicUrl;
      }
      await addBlogPost({
        title: blogTitle,
        content: blogContent,
        author: profile?.full_name || 'Admin',
        coverImage: coverImageUrl,
      });
      setBlogTitle('');
      setBlogContent('');
      setCoverFile(null);
      setCoverPreview(null);
      setBlogSuccess('Blog post added!');
    } catch (err) {
      setBlogError('Failed to add blog post.');
    } finally {
      setBlogLoading(false);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCoverFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setCoverPreview(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800">Database is currently not configured.</p>
              <p className="text-sm text-amber-600 mt-2">
                Please configure Supabase to enable admin features.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    // Implement order status update logic here
  };
  const exportOrders = () => {
    // Implement export logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage orders, view analytics, and more</p>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <Package className="w-8 h-8 text-orange-500" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toFixed(2)}</p>
                <p className={`text-sm mt-1 flex items-center gap-1 ${stats.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendingUp className="w-4 h-4" />
                  {stats.monthlyGrowth >= 0 ? '+' : ''}{stats.monthlyGrowth.toFixed(1)}%
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </motion.div>
        </div>
        {/* Admin Tabs */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex gap-4 mb-6 border-b">
            {['Manage Orders', 'View Analytics', 'Add Blog Post'].map((tab, idx) => (
              <button
                key={tab}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${adminTab === idx ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500'}`}
                onClick={() => setAdminTab(idx)}
              >
                {tab}
              </button>
            ))}
          </div>
          {adminTab === 0 && (
            <>
              {/* Orders Table */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search orders..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      {/* Status Filter */}
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {/* Export Button */}
                      <button
                        onClick={exportOrders}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Export
                      </button>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id.substring(0, 8)}...</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{order.profiles?.full_name || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{order.profiles?.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.total.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(order.status)}
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                                ${order.status === 'shipped' ? 'bg-purple-100 text-purple-800' : ''}
                                ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                                ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                              `}>{order.status}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button onClick={() => setSelectedOrder(order)} className="text-orange-600 hover:text-orange-900">
                                <Eye className="w-4 h-4" />
                              </button>
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                className="text-sm border border-gray-300 rounded px-2 py-1"
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Order Details Modal */}
              {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Order Details</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600">Order ID</p>
                          <p className="font-medium">{selectedOrder.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Customer</p>
                          <p className="font-medium">{selectedOrder.profiles?.full_name || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{selectedOrder.profiles?.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Shipping Address</p>
                          <div className="bg-gray-50 p-3 rounded mt-1">
                            <p>{selectedOrder.shipping_address.firstName} {selectedOrder.shipping_address.lastName}</p>
                            <p>{selectedOrder.shipping_address.address1}</p>
                            {selectedOrder.shipping_address.address2 && <p>{selectedOrder.shipping_address.address2}</p>}
                            <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zip}</p>
                            <p>{selectedOrder.shipping_address.country}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Items</p>
                          <div className="space-y-2">
                            {selectedOrder.items.map((item, index) => (
                              <div key={index} className="bg-gray-50 p-3 rounded">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-600">Size: {item.selectedSize}, Color: {item.selectedColor}</p>
                                <p className="text-sm">${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="border-t pt-4">
                          <p className="text-lg font-semibold">Total: ${selectedOrder.total.toFixed(2)}</p>
                        </div>
                      </div>
                      <button onClick={() => setSelectedOrder(null)} className="mt-6 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors">Close</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {adminTab === 1 && (
            <div>
              {/* Analytics Section */}
              <h2 className="text-xl font-semibold mb-4">Analytics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded p-4"><div className="text-sm text-gray-500">Total Orders</div><div className="text-2xl font-bold">{stats.totalOrders}</div></div>
                <div className="bg-gray-50 rounded p-4"><div className="text-sm text-gray-500">Total Revenue</div><div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div></div>
                <div className="bg-gray-50 rounded p-4"><div className="text-sm text-gray-500">Total Customers</div><div className="text-2xl font-bold">{stats.totalCustomers}</div></div>
                <div className="bg-gray-50 rounded p-4"><div className="text-sm text-gray-500">Pending Orders</div><div className="text-2xl font-bold">{stats.pendingOrders}</div></div>
                <div className="bg-gray-50 rounded p-4"><div className="text-sm text-gray-500">Monthly Revenue</div><div className="text-2xl font-bold">${stats.monthlyRevenue.toFixed(2)}</div></div>
                <div className="bg-gray-50 rounded p-4"><div className="text-sm text-gray-500">Monthly Growth</div><div className="text-2xl font-bold">{stats.monthlyGrowth}%</div></div>
              </div>
            </div>
          )}
          {adminTab === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Add Blog Post</h2>
              <form onSubmit={handleBlogSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" value={blogTitle} onChange={e => setBlogTitle(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML allowed)</label>
                  <textarea value={blogContent} onChange={e => setBlogContent(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 min-h-[120px] focus:ring-2 focus:ring-orange-500 focus:border-transparent" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image <span className="text-red-500">*</span></label>
                  <input type="file" accept="image/*" onChange={handleCoverChange} className="block" required />
                  {coverPreview && (
                    <img src={coverPreview} alt="Cover Preview" className="mt-2 max-h-48 rounded shadow" />
                  )}
                </div>
                {blogError && <div className="text-red-500 text-sm">{blogError}</div>}
                {blogSuccess && <div className="text-green-600 text-sm">{blogSuccess}</div>}
                <button type="submit" disabled={blogLoading} className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition disabled:opacity-60">{blogLoading ? 'Adding...' : 'Add Blog Post'}</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;

// Clean, valid Admin component will be restored in the next patch.
