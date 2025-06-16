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

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Our Collection</h1>
            <p className="text-lg text-gray-600 mb-8">Discover thousands of books across all genres and categories</p>

            {!user && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
                <p className="text-green-800 mb-3">
                  <strong>Want to borrow books?</strong> Create an account to access our borrowing services!
                </p>
                <div className="space-x-3">
                  <Link
                    to="/register"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors inline-block"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="border border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-green-50 transition-colors inline-block"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
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
          </form>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{book.title}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      book.availableCopies > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {book.availableCopies > 0 ? "Available" : "Unavailable"}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                <p className="text-xs text-green-600 font-medium mb-3">{book.category}</p>
                <p className="text-sm text-gray-700 mb-4 line-clamp-3">{book.description}</p>

                <div className="space-y-2 text-xs text-gray-500 mb-4">
                  <p>
                    <span className="font-medium">ISBN:</span> {book.isbn}
                  </p>
                  <p>
                    <span className="font-medium">Publisher:</span> {book.publisher}
                  </p>
                  <p>
                    <span className="font-medium">Year:</span> {book.publishedYear}
                  </p>
                  <p>
                    <span className="font-medium">Pages:</span> {book.pages}
                  </p>
                  <p>
                    <span className="font-medium">Language:</span> {book.language}
                  </p>
                  <p>
                    <span className="font-medium">Available:</span> {book.availableCopies}/{book.totalCopies}
                  </p>
                </div>

                {user ? (
                  book.availableCopies > 0 ? (
                    <Link
                      to="/dashboard"
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-center block"
                    >
                      Borrow Book
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed"
                    >
                      Currently Unavailable
                    </button>
                  )
                ) : (
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-2">Sign in to borrow this book</p>
                    <Link
                      to="/login"
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-center block"
                    >
                      Sign In to Borrow
                    </Link>
                  </div>
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
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>

            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 border rounded-md ${
                      currentPage === page
                        ? "bg-green-600 text-white border-green-600"
                        : "border-gray-300 hover:bg-gray-50"
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
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}

        {books.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or browse all categories.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BooksPage
