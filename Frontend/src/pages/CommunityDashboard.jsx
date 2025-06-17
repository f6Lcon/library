"use client"

import { useState, useEffect } from "react"
import { bookService } from "../services/bookService"
import { borrowService } from "../services/borrowService"
import { useAuth } from "../context/AuthContext"

const CommunityDashboard = () => {
  const { user } = useAuth()
  const [books, setBooks] = useState([])
  const [borrowHistory, setBorrowHistory] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [activeTab, setActiveTab] = useState("search")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

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

  const fetchData = async () => {
    try {
      setLoading(true)
      const [categoriesRes, borrowHistoryRes] = await Promise.all([
        bookService.getCategories(),
        borrowService.getBorrowHistory(user._id),
      ])

      setCategories(categoriesRes.categories)
      setBorrowHistory(borrowHistoryRes.borrows || [])

      await fetchBooks()
    } catch (err) {
      setError(err.message)
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
      setBooks(response.books)
      setTotalPages(response.totalPages)
    } catch (err) {
      setError(err.message)
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
      setBooks(response.books)
      setTotalPages(response.totalPages)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Community Dashboard</h1>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <h2 className="text-lg font-semibold text-green-800 mb-2">Welcome to KEY Library</h2>
          <p className="text-green-700">
            As a community member, you can browse our book collection across all branches. To borrow books, please visit
            your local branch or contact a librarian.
          </p>
          {user?.branch && (
            <p className="text-green-600 mt-2 font-medium">
              Your home branch: {user.branch.name} ({user.branch.code})
            </p>
          )}
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {["search", "history"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab === "search" ? "Browse Books" : "My Borrow History"}
              </button>
            ))}
          </nav>
        </div>

        {/* Search Books Tab */}
        {activeTab === "search" && (
          <div>
            {/* Search Filters */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Books</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title, author, or ISBN..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8">
              {books.map((book) => (
                <div
                  key={book._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:scale-105 border border-primary-100"
                >
                  {/* Book Image */}
                  <div className="aspect-[2/3] overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 relative">
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
                        className={`text-xs px-3 py-1 rounded-full font-bold shadow-lg ${
                          book.availableCopies > 0 ? "bg-primary-500 text-white" : "bg-red-500 text-white"
                        }`}
                      >
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
                      <span className="text-xs text-primary-600 font-bold bg-primary-100 px-2 py-1 rounded-lg">
                        {book.category}
                      </span>
                      {book.branch && (
                        <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                          {book.branch.code}
                        </span>
                      )}
                    </div>

                    {/* Book Details */}
                    <div className="text-xs text-gray-500 mb-4 space-y-1">
                      <div className="flex justify-between">
                        <span>📅 Year:</span>
                        <span className="font-medium">{book.publishedYear}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>📄 Pages:</span>
                        <span className="font-medium">{book.pages}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>📊 Stock:</span>
                        <span className={book.availableCopies > 0 ? "text-primary-600" : "text-red-600"}>
                          {book.availableCopies}/{book.totalCopies}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="p-2 bg-gray-50 rounded text-center">
                      <p className="text-xs text-gray-600">Visit branch to borrow</p>
                      {book.branch && <p className="text-xs text-primary-600 font-medium">{book.branch.name}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-primary-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-50 transition-colors font-medium"
                >
                  ← Previous
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
                            ? "bg-primary-500 text-white border-primary-500 shadow-lg"
                            : "border-primary-300 hover:bg-primary-50"
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
                  className="px-4 py-2 border border-primary-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-50 transition-colors font-medium"
                >
                  Next →
                </button>
              </div>
            )}

            {books.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">📚</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No books found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all categories.</p>
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("")
                    setCurrentPage(1)
                  }}
                  className="bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-all duration-200 transform hover:scale-105"
                >
                  🔄 Reset Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Borrow History Tab */}
        {activeTab === "history" && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Your Borrow History</h2>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
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
                      <tr key={borrow._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{borrow.book.title}</div>
                          <div className="text-sm text-gray-500">by {borrow.book.author}</div>
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
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
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
                          {borrow.fine > 0 ? `$${borrow.fine}` : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {borrowHistory.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">You haven't borrowed any books yet.</p>
                <p className="text-gray-400 text-sm mt-2">Visit your local branch to start borrowing books!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CommunityDashboard
