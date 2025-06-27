"use client"

import { useState, useEffect } from "react"
import { bookService } from "../services/bookService"
import { borrowService } from "../services/borrowService"
import { useAuth } from "../context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import BookCard from "../components/BookCard"
import LoadingSpinner from "../components/LoadingSpinner"
import {
  FiBook,
  FiClock,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiAlertCircle,
  FiBookOpen,
  FiTrendingUp,
  FiUser,
  FiStar,
} from "react-icons/fi"
import ReviewModal from "../components/ReviewModal"
import { reviewService } from "../services/reviewService"

const StudentDashboard = () => {
  const { user, loading: authLoading } = useAuth()
  const [books, setBooks] = useState([])
  const [borrowHistory, setBorrowHistory] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [activeTab, setActiveTab] = useState("browse")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [stats, setStats] = useState({
    totalBorrowed: 0,
    currentlyBorrowed: 0,
    overdue: 0,
    returned: 0,
  })

  const [eligibleBooks, setEligibleBooks] = useState([])
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedBookForReview, setSelectedBookForReview] = useState(null)

  // Initialize data when user is available
  useEffect(() => {
    if (user && !authLoading) {
      initializeDashboard()
    }
  }, [user, authLoading])

  // Handle search and filtering
  useEffect(() => {
    if (user && !loading && activeTab === "browse") {
      handleSearch()
    }
  }, [searchTerm, selectedCategory, activeTab])

  // Refresh borrow history when switching to history tab
  useEffect(() => {
    if (activeTab === "history" && user?._id) {
      fetchBorrowHistory()
    }
  }, [activeTab, user?._id])

  const initializeDashboard = async () => {
    setLoading(true)
    setError("")

    try {
      console.log("=== INITIALIZING STUDENT DASHBOARD ===")
      console.log("User:", user)

      // Fetch all data in parallel
      const [categoriesRes, booksRes, historyRes] = await Promise.all([
        bookService.getCategories().catch((err) => {
          console.error("Categories fetch error:", err)
          return { categories: [] }
        }),
        bookService.getAllBooks().catch((err) => {
          console.error("Books fetch error:", err)
          return { books: [] }
        }),
        fetchBorrowHistory().catch((err) => {
          console.error("Borrow history fetch error:", err)
          return { borrows: [] }
        }),
      ])

      setCategories(categoriesRes.categories || [])
      setBooks(booksRes.books || [])

      // Calculate stats from borrow history
      const history = historyRes.borrows || []
      console.log("Borrow history for stats:", history)

      const newStats = {
        totalBorrowed: history.length,
        currentlyBorrowed: history.filter((b) => b.status === "borrowed").length,
        overdue: history.filter((b) => b.status === "overdue").length,
        returned: history.filter((b) => b.status === "returned").length,
      }

      console.log("Calculated stats:", newStats)
      setStats(newStats)

      // Fetch eligible books for reviews
      await fetchEligibleBooks()
    } catch (err) {
      console.error("Dashboard initialization error:", err)
      setError("Failed to load dashboard. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchBorrowHistory = async () => {
    if (!user?._id) {
      console.log("No user ID available for borrow history")
      return { borrows: [] }
    }

    try {
      console.log("=== FETCHING BORROW HISTORY ===")
      console.log("User ID:", user._id)

      const response = await borrowService.getBorrowHistory(user._id)
      console.log("Borrow history response:", response)

      const borrowData = response.borrows || []
      setBorrowHistory(borrowData)

      // Update stats when borrow history is fetched
      const newStats = {
        totalBorrowed: borrowData.length,
        currentlyBorrowed: borrowData.filter((b) => b.status === "borrowed").length,
        overdue: borrowData.filter((b) => b.status === "overdue").length,
        returned: borrowData.filter((b) => b.status === "returned").length,
      }

      console.log("Updated stats from borrow history:", newStats)
      setStats(newStats)

      return response
    } catch (err) {
      console.error("Error fetching borrow history:", err)
      setBorrowHistory([])
      return { borrows: [] }
    }
  }

  const handleSearch = async () => {
    if (!searchTerm && !selectedCategory) {
      // If no search terms, fetch all books
      try {
        const response = await bookService.getAllBooks()
        setBooks(response.books || [])
      } catch (err) {
        console.error("Error fetching all books:", err)
      }
      return
    }

    try {
      const params = {}
      if (searchTerm) params.search = searchTerm
      if (selectedCategory) params.category = selectedCategory

      const response = await bookService.getAllBooks(params)
      setBooks(response.books || [])
    } catch (err) {
      console.error("Search error:", err)
    }
  }

  const refreshData = async () => {
    await initializeDashboard()
  }

  const fetchEligibleBooks = async () => {
    try {
      const response = await reviewService.getUserEligibleBooks()
      setEligibleBooks(response.eligibleBooks || [])
    } catch (err) {
      console.error("Error fetching eligible books:", err)
    }
  }

  // Show loading only during initial load
  if (authLoading || (loading && books.length === 0 && borrowHistory.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" color="primary" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Show error if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Please log in to access your dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-4xl font-bold mb-2">Welcome back, {user.firstName}!</h1>
                <p className="text-primary-100 text-lg mb-4">Manage your reading journey and discover new books</p>
                {user.branch && (
                  <div className="flex items-center mt-2 text-sm text-primary-200">
                    <FiUser className="w-5 h-5 mr-2" />
                    <span className="font-medium">{user.branch.name} Library</span>
                  </div>
                )}
              </motion.div>
            </div>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={refreshData}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 transition-all duration-200"
            >
              <FiRefreshCw className={`w-5 h-5 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh Data
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FiBook className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Borrowed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBorrowed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <FiBookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Currently Reading</p>
                <p className="text-3xl font-bold text-gray-900">{stats.currentlyBorrowed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-50 rounded-lg">
                <FiClock className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-3xl font-bold text-gray-900">{stats.overdue}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-50 rounded-lg">
                <FiTrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.returned}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center">
              <FiAlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-red-700">{error}</p>
              <button onClick={refreshData} className="ml-auto text-red-600 hover:text-red-800 font-medium">
                Retry
              </button>
            </div>
          </motion.div>
        )}

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8 py-6">
              {[
                { id: "browse", label: "Browse Books", icon: FiSearch },
                { id: "history", label: "Reading History", icon: FiClock, count: borrowHistory.length },
                { id: "reviews", label: "My Reviews", icon: FiStar },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">{tab.count}</span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === "browse" && (
                <motion.div
                  key="browse"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Search and Filter */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Search Books</label>
                      <div className="relative">
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search by title, author, or ISBN..."
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Category</label>
                      <div className="relative">
                        <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none transition-colors duration-200"
                        >
                          <option value="">All Categories</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Books Grid */}
                  {books.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {books.map((book, index) => (
                        <BookCard
                          key={book._id}
                          book={book}
                          index={index}
                          showActions={false}
                          showBranchInfo={true}
                          variant="grid"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FiBook className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">No books found</h3>
                      <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        {searchTerm || selectedCategory
                          ? "Try adjusting your search criteria to find more books"
                          : "No books are currently available in your library"}
                      </p>
                      {(searchTerm || selectedCategory) && (
                        <button
                          onClick={() => {
                            setSearchTerm("")
                            setSelectedCategory("")
                          }}
                          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200"
                        >
                          <FiRefreshCw className="w-4 h-4 mr-2" />
                          Clear Filters
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "history" && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Your Reading History</h3>
                    <button
                      onClick={fetchBorrowHistory}
                      className="text-primary-600 hover:text-primary-800 text-sm flex items-center gap-1"
                    >
                      <FiRefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                  </div>

                  {borrowHistory.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Book
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Borrowed
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Due Date
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Fine
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {borrowHistory.map((borrow) => (
                            <tr key={borrow._id} className="hover:bg-gray-50 transition-colors duration-150">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-16 w-12 flex-shrink-0">
                                    {borrow.book?.imageUrl ? (
                                      <img
                                        className="h-16 w-12 rounded-lg object-cover"
                                        src={borrow.book.imageUrl || "/placeholder.svg"}
                                        alt={borrow.book.title}
                                        onError={(e) => {
                                          e.target.src = "/placeholder.svg?height=64&width=48"
                                        }}
                                      />
                                    ) : (
                                      <div className="h-16 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <FiBook className="w-4 h-4 text-gray-500" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {borrow.book?.title || "Unknown Book"}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      by {borrow.book?.author || "Unknown Author"}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {borrow.borrowDate ? new Date(borrow.borrowDate).toLocaleDateString() : "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {borrow.dueDate ? new Date(borrow.dueDate).toLocaleDateString() : "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                    borrow.status === "returned"
                                      ? "bg-green-100 text-green-800"
                                      : borrow.status === "overdue"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {borrow.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {borrow.fine > 0 ? `$${borrow.fine}` : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FiClock className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No reading history</h3>
                      <p className="text-gray-500">
                        Start borrowing books to see your reading history here. Visit the Browse Books tab to get
                        started!
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
              {activeTab === "reviews" && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {eligibleBooks.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {eligibleBooks.map((book) => (
                        <div key={book._id} className="relative">
                          <BookCard book={book} showActions={false} showBranchInfo={true} variant="grid" />
                          <button
                            onClick={() => {
                              setSelectedBookForReview(book)
                              setShowReviewModal(true)
                            }}
                            className="absolute bottom-2 right-2 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700 transition-colors duration-200"
                          >
                            <FiStar className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FiStar className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No books eligible for review</h3>
                      <p className="text-gray-500">Return books to review them.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false)
          setSelectedBookForReview(null)
        }}
        book={selectedBookForReview}
        onReviewSubmitted={() => {
          fetchEligibleBooks()
          setShowReviewModal(false)
          setSelectedBookForReview(null)
        }}
      />
    </div>
  )
}

export default StudentDashboard
