"use client"

import { useState, useEffect } from "react"
import { bookService } from "../services/bookService"
import { borrowService } from "../services/borrowService"
import { useAuth } from "../context/AuthContext"
import {
  MdSearch,
  MdFilterList,
  MdBook,
  MdPerson,
  MdSchedule,
  MdCheckCircle,
  MdError,
  MdWarning,
  MdRefresh,
  MdArrowBack,
  MdArrowForward,
  MdCategory,
  MdLocationOn,
  MdCalendarToday,
  MdDescription,
  MdInventory,
  MdClose,
} from "react-icons/md"

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
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-100">
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <MdBook className="text-teal-600" />
                Community Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Browse and explore our book collection</p>
            </div>
            <button
              onClick={refreshData}
              className="bg-teal-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-teal-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              <MdRefresh className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="mb-6 space-y-2">
              {errors.map((error) => (
                <div
                  key={error.id}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <MdError className="w-5 h-5" />
                    <span>{error.message}</span>
                  </div>
                  <button onClick={() => dismissError(error.id)} className="text-red-500 hover:text-red-700">
                    <MdClose className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-6 mb-8 text-white shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <MdPerson className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Welcome to KEY Library</h2>
                <p className="text-teal-100">
                  As a community member, you can browse our book collection across all branches. To borrow books, please
                  visit your local branch or contact a librarian.
                </p>
                {user?.branch && (
                  <div className="flex items-center gap-2 mt-3 text-teal-100">
                    <MdLocationOn className="w-4 h-4" />
                    <span className="font-medium">
                      Your home branch: {user.branch.name} ({user.branch.code})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-teal-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Books</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
                </div>
                <div className="bg-teal-100 p-3 rounded-xl">
                  <MdBook className="w-6 h-6 text-teal-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-green-600">{stats.availableBooks}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <MdCheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Borrowed</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.borrowedBooks}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-xl">
                  <MdInventory className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">My Borrows</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalBorrows}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <MdSchedule className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  { key: "search", label: "Browse Books", icon: MdSearch, count: books.length },
                  { key: "history", label: "My History", icon: MdSchedule, count: borrowHistory.length },
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
          </div>

          {/* Search Books Tab */}
          {activeTab === "search" && (
            <div>
              {/* Search Filters */}
              <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <MdSearch className="w-4 h-4" />
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
                      <MdCategory className="w-4 h-4" />
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
                    <button
                      onClick={resetFilters}
                      className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <MdFilterList className="w-4 h-4" />
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Books Grid */}
              {books.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8">
                  {books.map((book) => (
                    <div
                      key={book._id}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:scale-105 border border-gray-100"
                    >
                      {/* Book Image */}
                      <div className="aspect-[2/3] overflow-hidden bg-gradient-to-br from-teal-50 to-teal-100 relative">
                        <img
                          src={book.imageUrl || "/placeholder.svg?height=300&width=200"}
                          alt={`${book.title} cover`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=300&width=200"
                          }}
                        />
                        {/* Availability badge */}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-bold shadow-lg flex items-center gap-1 ${
                              book.availableCopies > 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"
                            }`}
                          >
                            {book.availableCopies > 0 ? (
                              <MdCheckCircle className="w-3 h-3" />
                            ) : (
                              <MdError className="w-3 h-3" />
                            )}
                            {book.availableCopies > 0 ? `${book.availableCopies} Available` : "Out of Stock"}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        {/* Title and Author */}
                        <div className="mb-3">
                          <h3
                            className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight mb-1"
                            title={book.title}
                          >
                            {book.title}
                          </h3>
                          <p className="text-xs text-gray-600 truncate" title={book.author}>
                            by {book.author}
                          </p>
                        </div>

                        {/* Category and Branch */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-teal-600 font-bold bg-teal-100 px-2 py-1 rounded-lg flex items-center gap-1">
                            <MdCategory className="w-3 h-3" />
                            {book.category}
                          </span>
                          {book.branch && (
                            <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                              <MdLocationOn className="w-3 h-3" />
                              {book.branch.code}
                            </span>
                          )}
                        </div>

                        {/* Book Details */}
                        <div className="text-xs text-gray-500 mb-4 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1">
                              <MdCalendarToday className="w-3 h-3" />
                              Year:
                            </span>
                            <span className="font-medium">{book.publishedYear}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1">
                              <MdDescription className="w-3 h-3" />
                              Pages:
                            </span>
                            <span className="font-medium">{book.pages}</span>
                          </div>
                          <div className="flex justify-between items-center font-bold">
                            <span className="flex items-center gap-1">
                              <MdInventory className="w-3 h-3" />
                              Stock:
                            </span>
                            <span className={book.availableCopies > 0 ? "text-teal-600" : "text-red-600"}>
                              {book.availableCopies}/{book.totalCopies}
                            </span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="p-3 bg-gray-50 rounded-xl text-center">
                          <p className="text-xs text-gray-600 flex items-center justify-center gap-1">
                            <MdLocationOn className="w-3 h-3" />
                            Visit branch to borrow
                          </p>
                          {book.branch && <p className="text-xs text-teal-600 font-medium">{book.branch.name}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                  <div className="text-6xl mb-6">📚</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No books found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all categories.</p>
                  <button
                    onClick={resetFilters}
                    className="bg-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-600 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 mx-auto"
                  >
                    <MdRefresh className="w-4 h-4" />
                    Reset Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-teal-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-50 transition-colors font-medium flex items-center gap-2"
                  >
                    <MdArrowBack className="w-4 h-4" />
                    Previous
                  </button>

                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 border rounded-xl transition-all duration-200 font-medium ${
                            currentPage === page
                              ? "bg-teal-500 text-white border-teal-500 shadow-lg"
                              : "border-teal-300 hover:bg-teal-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-teal-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-50 transition-colors font-medium flex items-center gap-2"
                  >
                    Next
                    <MdArrowForward className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Borrow History Tab */}
          {activeTab === "history" && (
            <div>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <MdSchedule className="text-teal-600" />
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
                              <MdBook className="w-4 h-4" />
                              Book
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            <div className="flex items-center gap-2">
                              <MdCalendarToday className="w-4 h-4" />
                              Borrow Date
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            <div className="flex items-center gap-2">
                              <MdSchedule className="w-4 h-4" />
                              Due Date
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            <div className="flex items-center gap-2">
                              <MdCheckCircle className="w-4 h-4" />
                              Return Date
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fine</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {borrowHistory.map((borrow) => (
                          <tr key={borrow._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{borrow.book?.title || "N/A"}</div>
                                <div className="text-sm text-gray-500">by {borrow.book?.author || "N/A"}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {borrow.borrowDate ? new Date(borrow.borrowDate).toLocaleDateString() : "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {borrow.dueDate ? new Date(borrow.dueDate).toLocaleDateString() : "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {borrow.returnDate ? new Date(borrow.returnDate).toLocaleDateString() : "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                                  borrow.status === "returned"
                                    ? "bg-green-100 text-green-800"
                                    : borrow.status === "overdue"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {borrow.status === "returned" ? (
                                  <MdCheckCircle className="w-3 h-3" />
                                ) : borrow.status === "overdue" ? (
                                  <MdError className="w-3 h-3" />
                                ) : (
                                  <MdWarning className="w-3 h-3" />
                                )}
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
                ) : (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-6">📖</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No borrow history yet</h3>
                    <p className="text-gray-500">You haven't borrowed any books yet.</p>
                    <p className="text-gray-400 text-sm mt-2">Visit your local branch to start borrowing books!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommunityDashboard
