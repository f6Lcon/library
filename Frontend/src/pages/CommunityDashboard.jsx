"use client"

import { useState, useEffect } from "react"
import { bookService } from "../services/bookService"

const CommunityDashboard = () => {
  const [books, setBooks] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState([])
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
      const categoriesRes = await bookService.getCategories()
      setCategories(categoriesRes.categories)
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

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Community Dashboard</h1>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <h2 className="text-lg font-semibold text-green-800 mb-2">Welcome to KEY Library</h2>
          <p className="text-green-700">
            As a community member, you can browse our book collection across all branches. To borrow books, please
            contact a librarian or upgrade to a student membership.
          </p>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Book Image */}
              <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                  src={book.imageUrl || "/placeholder.svg?height=400&width=300"}
                  alt={`${book.title} cover`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=400&width=300"
                  }}
                />
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                <p className="text-sm text-gray-500 mb-3">{book.category}</p>
                <p className="text-sm text-gray-700 mb-4 line-clamp-3">{book.description}</p>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">ISBN: {book.isbn}</span>
                  <span
                    className={`text-sm font-medium ${book.availableCopies > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {book.availableCopies > 0 ? `${book.availableCopies} available` : "Not available"}
                  </span>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>Publisher: {book.publisher}</p>
                  <p>Year: {book.publishedYear}</p>
                  <p>Pages: {book.pages}</p>
                  <p>Language: {book.language}</p>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">
                    To borrow this book, please contact a librarian or upgrade your membership.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {books.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No books found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CommunityDashboard
