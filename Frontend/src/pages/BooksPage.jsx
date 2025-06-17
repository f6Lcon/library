"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { bookService } from "../services/bookService"
import { useAuth } from "../context/AuthContext"

const BooksPage = () => {
  const { user } = useAuth()
  const [books, setBooks] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    searchBooks()
  }, [searchTerm, selectedCategory, currentPage])

  const fetchData = async () => {
    try {
      setLoading(true)
      const categoriesRes = await bookService.getCategories()
      setCategories(categoriesRes.categories)
      await searchBooks()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
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

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    searchBooks()
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-6">
              <span className="text-2xl">📚</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Our Collection</h1>
            <p className="text-xl text-gray-600 mb-8">Explore thousands of books across all genres and categories</p>

            {!user && (
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 mb-8 max-w-2xl mx-auto text-white">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-3xl mr-3">🎯</span>
                  <h3 className="text-xl font-bold">Ready to Borrow Books?</h3>
                </div>
                <p className="mb-4">Join our community to access borrowing services and exclusive features!</p>
                <div className="space-x-3">
                  <Link
                    to="/register"
                    className="bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-200 transform hover:scale-105 inline-block"
                  >
                    🚀 Join Now
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-all duration-200 transform hover:scale-105 inline-block"
                  >
                    🔑 Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center space-x-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-primary-100">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                🔍 Search Books
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, author, or ISBN..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">📂 Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </form>
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
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight mb-1" title={book.title}>
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
                {user ? (
                  book.availableCopies > 0 ? (
                    <Link
                      to="/dashboard"
                      className="w-full bg-primary-500 text-white py-2 px-3 rounded-xl text-xs hover:bg-primary-600 transition-all duration-200 text-center block font-bold transform hover:scale-105"
                    >
                      📖 Borrow Now
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 py-2 px-3 rounded-xl text-xs cursor-not-allowed font-bold"
                    >
                      ❌ Unavailable
                    </button>
                  )
                ) : (
                  <Link
                    to="/login"
                    className="w-full bg-primary-500 text-white py-2 px-3 rounded-xl text-xs hover:bg-primary-600 transition-all duration-200 text-center block font-bold transform hover:scale-105"
                  >
                    🔑 Sign In to Borrow
                  </Link>
                )}
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
              {totalPages > 5 && (
                <>
                  <span className="px-2 py-2 text-gray-500">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-4 py-2 border rounded-xl transition-all duration-200 font-medium ${
                      currentPage === totalPages
                        ? "bg-primary-500 text-white border-primary-500 shadow-lg"
                        : "border-primary-300 hover:bg-primary-50"
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
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
    </div>
  )
}

export default BooksPage
