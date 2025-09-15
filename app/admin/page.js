'use client'

import dynamic from 'next/dynamic'
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Home
} from 'lucide-react'
import { useToast } from '../../components/Toaster'

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [user, setUser] = useState(null)
  const [dashboardStats, setDashboardStats] = useState(null)
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [coupons, setCoupons] = useState([])
  const [reviews, setReviews] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  
  const router = useRouter()
  const { addToast } = useToast()

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    if (typeof window === 'undefined') return { 'Content-Type': 'application/json' }
    const token = localStorage.getItem('token')
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  // Check authentication and admin role
  // Set client state
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    
    const checkAuth = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        const response = await fetch(`${'http://vibebitstest-env.eba-ubvupniq.ap-south-1.elasticbeanstalk.com/api'}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          // Token might be expired, clear it and redirect to login
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          router.push('/login')
          return
        }
        
        const data = await response.json()
        if (data.success) {
          const role = data.data.role || data.data.user?.role
          if (role === 'admin') {
            setUser(data.data)
            setIsLoading(false)
          } else {
            addToast('Access denied. Admin privileges required.', 'error')
            router.push('/profile')
          }
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        // Clear invalid token and redirect
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
      }
    }
    checkAuth()
  }, [isClient, router, addToast])

  // Load dashboard data
  useEffect(() => {
    if (user && activeTab === 'dashboard') {
      loadDashboardStats()
    }
  }, [user, activeTab, loadDashboardStats])

  // Load data based on active tab
  useEffect(() => {
    if (user) {
      switch (activeTab) {
        case 'users':
          loadUsers()
          break
        case 'products':
          loadProducts()
          break
        case 'orders':
          loadOrders()
          break
        case 'coupons':
          loadCoupons()
          break
        case 'reviews':
          loadReviews()
          break
      }
    }
  }, [user, activeTab, currentPage, searchQuery, filterStatus, loadUsers, loadProducts, loadOrders, loadCoupons, loadReviews])

  const loadDashboardStats = useCallback(async () => {
    try {
      const response = await fetch(`${'http://vibebitstest-env.eba-ubvupniq.ap-south-1.elasticbeanstalk.com/api'}/admin/dashboard`, {
        headers: getAuthHeaders()
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Dashboard data received:', data.data)
        setDashboardStats(data.data)
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
      addToast('Error loading dashboard data', 'error')
    }
  }, [addToast])

  const loadUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        status: filterStatus
      })

      const response = await fetch(`${'http://vibebitstest-env.eba-ubvupniq.ap-south-1.elasticbeanstalk.com/api'}/admin/users?${params}`, {
        headers: getAuthHeaders()
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.data.users)
        setTotalPages(data.data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error loading users:', error)
      addToast('Error loading users', 'error')
    }
  }, [currentPage, searchQuery, filterStatus, addToast])

  const loadProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        status: filterStatus
      })

      const response = await fetch(`${'http://vibebitstest-env.eba-ubvupniq.ap-south-1.elasticbeanstalk.com/api'}/admin/products?${params}`, {
        headers: getAuthHeaders()
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(data.data.products)
        setTotalPages(data.data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error loading products:', error)
      addToast('Error loading products', 'error')
    }
  }, [currentPage, searchQuery, filterStatus, addToast])

  const loadOrders = useCallback(async () => {
    try {
      let statusParam = filterStatus

      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        status: statusParam
      })

      const response = await fetch(`${'http://vibebitstest-env.eba-ubvupniq.ap-south-1.elasticbeanstalk.com/api'}/admin/orders?${params}`, {
        headers: getAuthHeaders()
      })

      if (response.ok) {
        const data = await response.json()
        let filteredOrders = data.data.orders

        setOrders(filteredOrders)
        setTotalPages(data.data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error loading orders:', error)
      addToast('Error loading orders', 'error')
    }
  }, [currentPage, searchQuery, filterStatus, addToast])

  const loadCoupons = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        status: filterStatus
      })

      const response = await fetch(`${'http://vibebitstest-env.eba-ubvupniq.ap-south-1.elasticbeanstalk.com/api'}/admin/coupons?${params}`, {
        headers: getAuthHeaders()
      })

      if (response.ok) {
        const data = await response.json()
        setCoupons(data.data.coupons)
        setTotalPages(data.data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error loading coupons:', error)
      addToast('Error loading coupons', 'error')
    }
  }, [currentPage, filterStatus, addToast])

  const loadReviews = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        status: filterStatus
      })

      const response = await fetch(`${'http://vibebitstest-env.eba-ubvupniq.ap-south-1.elasticbeanstalk.com/api'}/reviews/admin?${params}`, {
        headers: getAuthHeaders()
      })

      if (response.ok) {
        const data = await response.json()
        setReviews(data.data.reviews)
        setTotalPages(data.data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error loading reviews:', error)
      addToast('Error loading reviews', 'error')
    }
  }, [currentPage, filterStatus, addToast])

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
    addToast('Logged out successfully', 'success')
  }

  const handleUserStatusToggle = async (userId, currentStatus) => {
    try {
      const response = await fetch(`${'http://vibebitstest-env.eba-ubvupniq.ap-south-1.elasticbeanstalk.com/api'}/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isActive: !currentStatus })
      })

      if (response.ok) {
        addToast(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`, 'success')
        loadUsers()
      } else {
        addToast('Error updating user status', 'error')
      }
    } catch (error) {
      console.error('Error updating user status:', error)
      addToast('Error updating user status', 'error')
    }
  }

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${'http://vibebitstest-env.eba-ubvupniq.ap-south-1.elasticbeanstalk.com/api'}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        addToast('Order status updated successfully', 'success')
        loadOrders()
      } else {
        addToast('Error updating order status', 'error')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      addToast('Error updating order status', 'error')
    }
  }


  const handleReviewStatusToggle = async (reviewId, isActive) => {
    try {
      const response = await fetch(`${'http://vibebitstest-env.eba-ubvupniq.ap-south-1.elasticbeanstalk.com/api'}/reviews/admin/${reviewId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isActive })
      })

      if (response.ok) {
        addToast(`Review ${isActive ? 'activated' : 'deactivated'} successfully`, 'success')
        loadReviews()
      } else {
        const data = await response.json()
        addToast(data.message || 'Error updating review status', 'error')
      }
    } catch (error) {
      console.error('Error updating review status:', error)
      addToast('Error updating review status', 'error')
    }
  }

  const handleViewReview = (review) => {
    const reviewDetails = `
Review Details:
Customer: ${review.userName} (${review.userEmail})
Product: ${review.productName}
Order: ${review.orderNumber}
Rating: ${review.rating}/5 stars
Title: ${review.title}
Comment: ${review.comment}
Date: ${new Date(review.date).toLocaleDateString()}
Status: ${review.isActive ? 'Active' : 'Inactive'}
Verified: ${review.verified ? 'Yes' : 'No'}
    `
    alert(reviewDetails)
  }

  const handleDelete = async (type, id) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return

    try {
      const response = await fetch(`${'http://vibebitstest-env.eba-ubvupniq.ap-south-1.elasticbeanstalk.com/api'}/admin/${type}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (response.ok) {
        addToast(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`, 'success')
        switch (type) {
          case 'users':
            loadUsers()
            break
          case 'products':
            loadProducts()
            break
          case 'coupons':
            loadCoupons()
            break
        }
      } else {
        addToast(`Error deleting ${type}`, 'error')
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error)
      addToast(`Error deleting ${type}`, 'error')
    }
  }

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-vibe-bg flex items-center justify-center">
        <div className="text-vibe-brown text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-vibe-bg">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-vibe-cookie">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-vibe-brown">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
            <button
                onClick={() => router.push('/')}
                className="flex items-center space-x-2 text-vibe-brown hover:text-vibe-cookie transition-colors"
                title="Go to Home Page"
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </button>
              <span className="text-vibe-brown">Welcome, {user?.firstName}</span>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-vibe-brown hover:text-vibe-cookie transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm mb-8">
          {[ 
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingCart },
            { id: 'coupons', label: 'Coupons', icon: TrendingUp },
            { id: 'reviews', label: 'Reviews', icon: Eye },
            { id: 'categories', label: 'Categories', icon: Plus }
          ].map((tab) => {
            const Icon = tab.icon
            if (tab.id === 'categories') {
              return (
                <button
                  key={tab.id}
                  onClick={() => router.push('/admin/addcategory')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors text-vibe-brown hover:bg-gray-100`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              )
            }
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setCurrentPage(1)
                  setSearchQuery('')
                  setFilterStatus('')
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-vibe-cookie text-vibe-brown'
                    : 'text-vibe-brown hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && dashboardStats && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-vibe-cookie">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-vibe-brown">{dashboardStats.stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-vibe-cookie">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-vibe-brown">{dashboardStats.stats.totalProducts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-vibe-cookie">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-vibe-brown">{dashboardStats.stats.totalOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-vibe-cookie">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-vibe-brown">₹{dashboardStats.stats.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm border border-vibe-cookie">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-vibe-brown">Recent Orders</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardStats.recentOrders && dashboardStats.recentOrders.length > 0 ? (
                      dashboardStats.recentOrders.map((order) => (
                        <tr key={order._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-vibe-brown font-medium">{order.orderNumber || order._id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.user?.firstName} {order.user?.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.total || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.orderStatus === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                              order.orderStatus === 'processing' ? 'bg-purple-100 text-purple-800' :
                              order.orderStatus === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          No recent orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Management */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-vibe-brown">User Management</h2>
              <div className="flex space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-vibe-cookie rounded-md focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-vibe-cookie rounded-md focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-vibe-cookie overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-vibe-brown font-medium">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phone || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleUserStatusToggle(user._id, user.isActive)}
                            className={`px-3 py-1 rounded-md text-xs font-medium ${
                              user.isActive
                                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDelete('users', user._id)}
                            className="px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 rounded-md text-xs font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Management */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-vibe-brown">Product Management</h2>
              <button onClick={() => router.push('/admin/createProduct')} className="flex items-center space-x-2 bg-vibe-cookie text-vibe-brown px-4 py-2 rounded-md hover:bg-vibe-brown hover:text-white transition-colors">
                <Plus className="h-5 w-5" />
                <span>Add Product</span>
              </button>
            </div>
            <div className="flex space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-vibe-cookie rounded-md focus:outline-none focus:ring-2 focus:ring-vibe-cookie" />
              </div>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border border-vibe-cookie rounded-md focus:outline-none focus:ring-2 focus:ring-vibe-cookie">
                <option value="">All Products</option>
                <option value="inStock">In Stock</option>
                <option value="outOfStock">Out of Stock</option>
              </select>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-vibe-cookie overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Range</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => {
                      const min = product.minPrice ?? (product.sizes?.length ? Math.min(...product.sizes.map(s=>s.price)) : 0)
                      const max = product.maxPrice ?? (product.sizes?.length ? Math.max(...product.sizes.map(s=>s.price)) : 0)
                      const stock = product.totalStock ?? (product.sizes?.length ? product.sizes.reduce((t,s)=>t + (s.stock||0),0) : 0)
                      return (
                        <tr key={product._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <Image className="h-10 w-10 rounded-full object-cover" src={product.images?.[0] || product.image || '/images/placeholder.jpg'} alt={product.name} width={40} height={40} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-vibe-brown">{product.name}</div>
                                <div className="text-sm text-gray-500">{product.description?.substring(0, 50)}...</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{min}{max !== min ? ` - ₹${max}`: ''}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button onClick={() => router.push(`/admin/editProduct?id=${product._id}`)} className="px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-md text-xs font-medium">Edit</button>
                            <button onClick={() => handleDelete('products', product._id)} className="px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 rounded-md text-xs font-medium">Delete</button>
                          </td>
                        </tr>
                      )})}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Management */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-vibe-brown">Order Management</h2>
            </div>

            <div className="flex space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-vibe-cookie rounded-md focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-vibe-cookie rounded-md focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
              >
                <option value="">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-vibe-cookie overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-vibe-brown font-medium">{order.orderNumber || order._id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.user?.firstName} {order.user?.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.total}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                              order.orderStatus === 'returned' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-col space-y-2">
                            <div className="flex space-x-2">
                              {/* Status dropdown */}
                              <select
                                  value={order.orderStatus}
                                  onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                                  className="px-2 py-1 border border-vibe-cookie rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
                                >
                                  {order.orderStatus === 'pending' && (
                                    <>
                                      <option value="pending">Pending</option>
                                      <option value="processing">Processing</option>
                                      <option value="cancelled">Cancelled</option>
                                    </>
                                  )}
                                  {order.orderStatus === 'processing' && (
                                    <>
                                      <option value="processing">Processing</option>
                                      <option value="shipped">Shipped</option>
                                      <option value="cancelled">Cancelled</option>
                                    </>
                                  )}
                                  {order.orderStatus === 'shipped' && (
                                    <>
                                      <option value="shipped">Shipped</option>
                                      <option value="delivered">Delivered</option>
                                    </>
                                  )}
                                  {order.orderStatus === 'delivered' && (
                                    <>
                                      <option value="delivered">Delivered</option>
                                      <option value="returned">Returned</option>
                                    </>
                                  )}
                                  {order.orderStatus === 'cancelled' && (
                                    <option value="cancelled">Cancelled</option>
                                  )}
                                  {order.orderStatus === 'returned' && (
                                    <option value="returned">Returned</option>
                                  )}
                                </select>
                              
                              <button
                                className="px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-md text-xs font-medium"
                                onClick={() => router.push(`/track-order?orderId=${order.orderNumber || order._id}`)}
                              >
                                Track
                              </button>
                            </div>
                            
                            
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Coupons Management */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-vibe-brown">Coupon Management</h2>
                <a href="/admin/addcoupon" className="flex items-center space-x-2 bg-vibe-cookie text-vibe-brown px-4 py-2 rounded-md hover:bg-vibe-brown hover:text-white transition-colors">
                  <Plus className="h-5 w-5" />
                  <span>Add Coupon</span>
                </a>
            </div>

            <div className="flex space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-vibe-cookie rounded-md focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
              >
                <option value="">All Coupons</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-vibe-cookie overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {coupons.map((coupon) => (
                      <tr key={coupon._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-vibe-brown font-medium">{coupon.code}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {coupon.type === 'percentage' ? `${coupon.discount}%` : `₹${coupon.discount}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{coupon.minOrderAmount || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {coupon.usedCount || 0} / {coupon.usageLimit === -1 ? '∞' : coupon.usageLimit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {coupon.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            className="px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-md text-xs font-medium"
                            onClick={() => router.push(`/admin/editcoupon?id=${coupon._id}`)}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete('coupons', coupon._id)}
                            className="px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 rounded-md text-xs font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Management */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-vibe-brown">Review Management</h2>
            </div>

            <div className="flex space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-vibe-cookie rounded-md focus:outline-none focus:ring-2 focus:ring-vibe-cookie"
              >
                <option value="">All Reviews</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-vibe-cookie overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reviews.map((review) => (
                      <tr key={review.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-vibe-brown font-medium">
                          <div>
                            <div>{review.userName}</div>
                            <div className="text-xs text-gray-500">{review.userEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center space-x-2">
                            {review.productImage && (
                              <Image
                                src={review.productImage}
                                alt={review.productName}
                                className="w-8 h-8 rounded object-cover"
                                width={32}
                                height={32}
                              />
                            )}
                            <span>{review.productName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {review.orderNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-lg ${
                                  i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                            <span className="ml-1 text-sm text-gray-600">({review.rating})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {review.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            review.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {review.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            className={`px-3 py-1 rounded-md text-xs font-medium ${
                              review.isActive 
                                ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                            onClick={() => handleReviewStatusToggle(review.id, !review.isActive)}
                          >
                            {review.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            className="px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-md text-xs font-medium"
                            onClick={() => handleViewReview(review)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? 'bg-vibe-cookie text-vibe-brown'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(AdminPage), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center bg-vibe-bg text-vibe-brown">Loading...</div>
})