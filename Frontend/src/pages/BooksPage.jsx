"use client"

import { useState, useEffect } from "react"
import { bookService } from "../services/bookService"
import { motion, AnimatePresence } from "framer-motion"
import { MdSearch, MdGridView, MdViewList, MdExpandMore, MdClose, MdAutoAwesome } from "react-icons/md"
import BookCard from "../components/BookCard"

const BooksPage = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("title")

  const genres = ["Fiction", "Non-Fiction", "Science", "History", "Biography", "Technology", "Art", "Philosophy"]
  const sortOptions = [
    { value: "title", label: "Title A-Z" },
    { value: "author", label: "Author A-Z" },
    { value: "year", label: "Publication Year" },
    { value: "category", label: "Category" },
  ]

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const response = await bookService.getAllBooks()
      setBooks(response.books || [])
    } catch (err) {
      setError("Failed to fetch books")
      console.error("Error fetching books:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredBooks = books
    .filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesGenre = !selectedGenre || book.category === selectedGenre
      return matchesSearch && matchesGenre
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "author":
          return a.author.localeCompare(b.author)
        case "year":
          return new Date(b.publishedYear) - new Date(a.publishedYear)
        case "category":
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-48">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-16">
      {/* Background Elements */}
      <div className="absolute top-16 left-8 w-48 h-48 bg-primary-500/8 rounded-full blur-3xl animate-float"></div>
      <div
        className="absolute bottom-16 right-8 w-64 h-64 bg-secondary-500/8 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full px-4 py-1.5 mb-4">
            <MdAutoAwesome className="w-4 h-4 text-primary-600 mr-1.5" />
            <span className="text-sm font-semibold text-primary-700">Discover Amazing Books</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 font-display">Browse Our Collection</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore thousands of books across various genres and find your next favorite read
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md border border-primary-100 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search books by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white/70 text-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="appearance-none bg-white/70 border border-gray-300 rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-sm"
                >
                  <option value="">All Categories</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
                <MdExpandMore className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white/70 border border-gray-300 rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <MdExpandMore className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-all duration-200 ${
                    viewMode === "grid" ? "bg-white shadow-sm text-primary-600" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <MdGridView className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-all duration-200 ${
                    viewMode === "list" ? "bg-white shadow-sm text-primary-600" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <MdViewList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedGenre) && (
            <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-200">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")} className="ml-1.5 hover:text-primary-600">
                    <MdClose className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedGenre && (
                <span className="inline-flex items-center bg-secondary-100 text-secondary-800 px-2 py-1 rounded-full text-xs">
                  Category: {selectedGenre}
                  <button onClick={() => setSelectedGenre("")} className="ml-1.5 hover:text-secondary-600">
                    <MdClose className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Results Count */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-4">
          <p className="text-gray-600 text-sm">
            Showing <span className="font-semibold">{filteredBooks.length}</span> books
          </p>
        </motion.div>

        {/* Books Grid/List */}
        {error ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MdClose className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-red-600 font-semibold text-sm">{error}</p>
          </motion.div>
        ) : filteredBooks.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MdSearch className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-600 font-semibold text-sm">No books found</p>
            <p className="text-gray-500 mt-1 text-sm">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3"
              >
                {filteredBooks.map((book, index) => (
                  <BookCard key={book._id} book={book} index={index} variant="grid" />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {filteredBooks.map((book, index) => (
                  <BookCard key={book._id} book={book} index={index} variant="list" />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

export default BooksPage
