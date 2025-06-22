"use client"

import { useState, useEffect } from "react"
import { bookService } from "../services/bookService"
import { borrowService } from "../services/borrowService"
import { useAuth } from "../context/AuthContext"
import BookCard from "../components/BookCard"
import { motion } from "framer-motion"
import {
  FiBook,
  FiUsers,
  FiTrendingUp,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi"
import { HiSparkles } from "react-icons/hi2"

const CommunityDashboard = () => {
  const { user } = useAuth()
  const [books, setBooks] = useState([])
  const [borrowHistory, setBorrowHistory] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [activeTab, setActiveTab] = useState("search")
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    totalBorrows: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (searchTerm || selectedCategory) {
      searchBooks()
    } else {
      fetchBooks()
    }
  }, [searchTerm, selectedCategory, currentPage])

  const addError = (message) => {
    const errorId = Date.now()
    setErrors((prev) => [...prev, { id: errorId, message }])
    setTimeout(() => {
      setErrors((prev) => prev.filter((error) => error.id !== errorId))
    }, 5000)
  }

  const dismissError = (errorId) => {
    setErrors((prev) => prev.filter((error) => error.id !== errorId))
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      setErrors([])

      const results = await Promise.allSettled([
        bookService.getCategories(),
        user?._id ? borrowService.getBorrowHistory(user._id) : Promise.resolve({ borrows: [] }),
        bookService.getAllBooks({ page: 1, limit: 1000 }), // Get all books for stats
      ])

      // Handle categories
      if (results[0].status === "fulfilled") {
        setCategories(results[0].value.categories || [])
      } else {
        addError("Failed to load categories")
        setCategories([])
      }

      // Handle borrow history
      if (results[1].status === "fulfilled") {
        const borrowData = results[1].value.borrows || []
        setBorrowHistory(borrowData)
      } else {
        addError("Failed to load borrow history")
        setBorrowHistory([])
      }

      // Handle books and calculate stats
      if (results[2].status === "fulfilled") {
        const allBooks = results[2].value.books || []
        const stats = {
          totalBooks: allBooks.length,
          availableBooks: allBooks.filter((book) => book.availableCopies > 0).length,
          borrowedBooks: allBooks.filter((book) => book.availableCopies === 0).length,
          totalBorrows: borrowHistory.length,
        }
        setStats(stats)
      } else {
        addError("Failed to load book statistics")
      }

      await fetchBooks()
    } catch (err) {
      addError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const fetchBooks = async () => {
    try {
      const params = {
        page: currentPage,
        limit: 12,
      }
      const response = await bookService.getAllBooks(params)
      setBooks(response.books || [])
      setTotalPages(response.totalPages || 1)
    } catch (err) {
      addError("Failed to load books")
      setBooks([])
    }
  }

  const searchBooks = async () => {
    try {
      const params = {
        page: currentPage,
        limit: 12,
      }
      if (searchTerm) params.search = searchTerm
      if (selectedCategory) params.category = selectedCategory

      const response = await bookService.getAllBooks(params)
      setBooks(response.books || [])
      setTotalPages(response.totalPages || 1)
    } catch (err) {
      addError("Failed to search books")
      setBooks([])
    }
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setCurrentPage(1)
  }

  const refreshData = () => {
    fetchData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-100 pt-20">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            <p className="text-teal-600 font-medium">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-100 pt-20">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <div className="inline-flex items-center bg-gradient-to-r from-teal-100 to-teal-200 rounded-full px-4 py-2 mb-4">
                <HiSparkles className="w-5 h-5 text-teal-600 mr-2" />
                <span className="text-sm font-semibold text-teal-700">Community Portal</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 font-display">
                <FiBook className="text-teal-600" />
                Community Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Browse and explore our book collection</p>
              {user?.branch && (
                <p className="text-sm text-teal-600 font-medium mt-1">
                  Your home branch: {user.branch.name} ({user.branch.code})
                </p>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshData}
              className="bg-teal-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-teal-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              <FiRefreshCw className="w-4 h-4" />
              Refresh
            </motion.button>
          </motion.div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="mb-6 space-y-2">
              {errors.map((error) => (
                <motion.div
                  key={error.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <FiAlertTriangle className="w-5 h-5" />
                    <span>{error.message}</span>
                  </div>
                  <button onClick={() => dismissError(error.id)} className="text-red-500 hover:text-red-700">
                    ✕
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Welcome Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-6 mb-8 text-white shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <FiUsers className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Welcome to KEY Library</h2>
                <p className="text-teal-100">
                  As a community member, you can browse our book collection across all branches. To borrow books, please
                  visit your local branch or contact a librarian.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            {[
              { title: "Total Books", value: stats.totalBooks, icon: FiBook, color: "teal" },
              { title: "Available", value: stats.availableBooks, icon: FiCheckCircle, color: "green" },
              { title: "Borrowed", value: stats.borrowedBooks, icon: FiClock, color: "orange" },
              { title: "My Borrows", value: stats.totalBorrows, icon: FiTrendingUp, color: "blue" },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-teal-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 bg-${stat.color}-100 rounded-xl`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg mb-6 overflow-hidden border border-teal-100"
          >
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  { key: "search", label: "Browse Books", count: books.length, icon: FiSearch },
                  { key: "history", label: "My History", count: borrowHistory.length, icon: FiClock },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-3 px-6 py-4 font-medium text-sm transition-all duration-200 ${
                      activeTab === tab.key
                        ? "border-b-2 border-teal-500 text-teal-600 bg-teal-50"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">{tab.count}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Search Books Tab */}
          {activeTab === "search" && (
            <div>
              {/* Search Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6 border border-gray-100"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FiSearch className="w-4 h-4" />
                      Search Books
                    </label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by title, author, or ISBN..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FiFilter className="w-4 h-4" />
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetFilters}
                      className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <FiFilter className="w-4 h-4" />
                      Reset Filters
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Books Grid */}
              {books.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8">
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <FiBook className="w-10 h-10 text-teal-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No books found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all categories.</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetFilters}
                    className="bg-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-600 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 mx-auto"
                  >
                    <FiRefreshCw className="w-4 h-4" />
                    Reset Filters
                  </motion.button>
                </motion.div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center items-center space-x-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-teal-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-50 transition-colors font-medium flex items-center gap-2"
                  >
                    <FiArrowLeft className="w-4 h-4" />
                    Previous
                  </motion.button>

                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <motion.button
                          key={page}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 border rounded-xl transition-all duration-200 font-medium ${
                            currentPage === page
                              ? "bg-teal-500 text-white border-teal-500 shadow-lg"
                              : "border-teal-300 hover:bg-teal-50"
                          }`}
                        >
                          {page}
                        </motion.button>
                      )
                    })}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-teal-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-50 transition-colors font-medium flex items-center gap-2"
                  >
                    Next
                    <FiArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}
            </div>
          )}

          {/* Borrow History Tab */}
          {activeTab === "history" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-teal-100">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FiClock className="text-teal-600" />
                    Your Borrow History
                  </h2>
                </div>

                {borrowHistory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            <div className="flex items-center gap-2">
                              <FiBook className="w-4 h-4" />
                              Book
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            <div className="flex items-center gap-2">
                              <FiClock className="w-4 h-4" />
                              Borrow Date
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            <div className="flex items-center gap-2">
                              <FiClock className="w-4 h-4" />
                              Due Date
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            <div className="flex items-center gap-2">
                              <FiCheckCircle className="w-4 h-4" />
                              Return Date
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            <div className="flex items-center gap-2">
                              <FiMapPin className="w-4 h-4" />
                              Branch
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {borrowHistory.map((borrow) => (
                          <tr key={borrow._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-12 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg flex items-center justify-center mr-4">
                                  <FiBook className="w-6 h-6 text-teal-600" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{borrow.book.title}</div>
                                  <div className="text-sm text-gray-500">by {borrow.book.author}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(borrow.borrowDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(borrow.dueDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {borrow.returnDate ? new Date(borrow.returnDate).toLocaleDateString() : "-"}
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {borrow.book.branch?.name || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FiClock className="w-8 h-8 text-teal-600" />
                    </div>
                    <p className="text-gray-500 font-medium">You haven't borrowed any books yet.</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Visit your local branch to start borrowing books from our collection!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommunityDashboard
