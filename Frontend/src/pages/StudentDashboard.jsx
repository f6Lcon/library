"use client"

import { useState, useEffect } from "react"
import { bookService } from "../services/bookService"
import { borrowService } from "../services/borrowService"
import { useAuth } from "../context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import BookCard from "../components/BookCard"
import { FiBook, FiClock, FiSearch, FiFilter, FiBarChart2, FiRefreshCw } from "react-icons/fi"
import { HiSparkles } from "react-icons/hi2"

const StudentDashboard = () => {
  const { user } = useAuth()
  const [books, setBooks] = useState([])
  const [borrowHistory, setBorrowHistory] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [activeTab, setActiveTab] = useState("search")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (searchTerm || selectedCategory) {
      searchBooks()
    } else {
      fetchBooks()
    }
  }, [searchTerm, selectedCategory])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [categoriesRes, borrowHistoryRes] = await Promise.all([
        bookService.getCategories(),
        borrowService.getBorrowHistory(user.id),
      ])

      setCategories(categoriesRes.categories)
      setBorrowHistory(borrowHistoryRes.borrows)

      await fetchBooks()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchBooks = async () => {
    try {
      const response = await bookService.getAllBooks()
      setBooks(response.books)
    } catch (err) {
      setError(err.message)
    }
  }

  const searchBooks = async () => {
    try {
      const params = {}
      if (searchTerm) params.search = searchTerm
      if (selectedCategory) params.category = selectedCategory

      const response = await bookService.getAllBooks(params)
      setBooks(response.books)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-20">
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-20">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full px-4 py-2 mb-4">
                <HiSparkles className="w-5 h-5 text-primary-600 mr-2" />
                <span className="text-sm font-semibold text-primary-700">Student Portal</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 font-display">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-600">Discover new books and manage your reading journey</p>
              {user?.branch && (
                <p className="text-sm text-primary-600 font-medium mt-1">
                  Your library: {user.branch.name} ({user.branch.code})
                </p>
              )}
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-primary-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                    <FiBarChart2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Books Read</p>
                    <p className="text-2xl font-bold text-gray-900">{borrowHistory.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center space-x-2"
          >
            <span>{error}</span>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-primary-100 mb-8"
        >
          <div className="flex space-x-2">
            {[
              { id: "search", label: "Browse Books", icon: FiSearch },
              { id: "history", label: "My History", icon: FiClock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Search Books Tab */}
        <AnimatePresence mode="wait">
          {activeTab === "search" && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Search Filters */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-primary-100 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <FiSearch className="w-4 h-4 mr-2" />
                      Search Books
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by title, author, or ISBN..."
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white/70"
                      />
                      <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <FiFilter className="w-4 h-4 mr-2" />
                      Category
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white/70 appearance-none"
                      >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Books Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {books.map((book, index) => (
                  <BookCard
                    key={book._id}
                    book={book}
                    index={index}
                    showActions={false}
                    showBranchInfo={false}
                    variant="grid"
                  />
                ))}
              </div>

              {books.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <FiBook className="w-10 h-10 text-primary-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No books found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all categories.</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("")
                    }}
                    className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
                  >
                    <FiRefreshCw className="w-5 h-5" />
                    <span>Reset Filters</span>
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Borrow History Tab */}
          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-primary-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <FiClock className="w-6 h-6 mr-3 text-primary-500" />
                    Your Borrow History
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrow Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Return Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fine</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {borrowHistory.map((borrow) => (
                        <tr key={borrow._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-12 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center mr-4">
                                <FiBook className="w-6 h-6 text-primary-500" />
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
                                  ? "bg-primary-100 text-primary-800"
                                  : borrow.status === "overdue"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {borrow.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {borrow.fine > 0 ? `$${borrow.fine}` : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {borrowHistory.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FiClock className="w-8 h-8 text-primary-500" />
                    </div>
                    <p className="text-gray-500 font-medium">You haven't borrowed any books yet.</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Start exploring our collection to begin your reading journey!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default StudentDashboard
