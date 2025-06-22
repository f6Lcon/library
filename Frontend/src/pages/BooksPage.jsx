"use client"

import { useState, useEffect } from "react"
import { bookService } from "../services/bookService"
import { motion, AnimatePresence } from "framer-motion"
import {
  FiSearch,
  FiBook,
  FiUser,
  FiCalendar,
  FiTag,
  FiStar,
  FiHeart,
  FiBookOpen,
  FiGrid,
  FiList,
  FiChevronDown,
  FiX,
} from "react-icons/fi"
import { HiSparkles } from "react-icons/hi2"

const BooksPage = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("")
  const [viewMode, setViewMode] = useState("grid") // grid or list
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

  const BookCard = ({ book, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -3, scale: 1.02 }}
      className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-primary-100 group"
    >
      <div className="relative mb-3">
        <div className="w-full h-32 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg flex items-center justify-center overflow-hidden">
          {book.imageUrl ? (
            <img
              src={book.imageUrl || "/placeholder.svg"}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <FiBook className="w-8 h-8 text-primary-500" />
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-1 right-1 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
        >
          <FiHeart className="w-3 h-3 text-red-500" />
        </motion.button>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors leading-tight">
          {book.title}
        </h3>

        <div className="flex items-center text-gray-600">
          <FiUser className="w-3 h-3 mr-1" />
          <span className="text-xs truncate">{book.author}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <FiCalendar className="w-3 h-3 mr-1" />
            <span>{book.publishedYear}</span>
          </div>
          <div className="flex items-center">
            <FiTag className="w-3 h-3 mr-1" />
            <span className="truncate max-w-16">{book.category}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-1">4.5</span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              book.availableCopies > 0 ? "bg-primary-100 text-primary-800" : "bg-red-100 text-red-800"
            }`}
          >
            {book.availableCopies > 0 ? "Available" : "Borrowed"}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2 px-3 rounded-lg text-xs font-semibold hover:shadow-md transition-all duration-300 flex items-center justify-center"
        >
          <FiBookOpen className="w-3 h-3 mr-1" />
          View Details
        </motion.button>
      </div>
    </motion.div>
  )

  const BookListItem = ({ book, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-primary-100 group"
    >
      <div className="flex items-center space-x-4">
        <div className="w-16 h-20 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
          {book.imageUrl ? (
            <img
              src={book.imageUrl || "/placeholder.svg"}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <FiBook className="w-6 h-6 text-primary-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
            {book.title}
          </h3>

          <div className="flex items-center text-gray-600 mb-1">
            <FiUser className="w-4 h-4 mr-2" />
            <span className="text-sm">{book.author}</span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
            <div className="flex items-center">
              <FiCalendar className="w-4 h-4 mr-1" />
              <span>{book.publishedYear}</span>
            </div>
            <div className="flex items-center">
              <FiTag className="w-4 h-4 mr-1" />
              <span>{book.category}</span>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">4.5</span>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              book.availableCopies > 0 ? "bg-primary-100 text-primary-800" : "bg-red-100 text-red-800"
            }`}
          >
            {book.availableCopies > 0 ? "Available" : "Borrowed"}
          </span>

          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <FiHeart className="w-4 h-4 text-red-500" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:shadow-md transition-all duration-300 flex items-center text-sm"
            >
              <FiBookOpen className="w-4 h-4 mr-2" />
              View Details
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"
            />
          </div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full px-6 py-2 mb-6">
            <HiSparkles className="w-5 h-5 text-primary-600 mr-2" />
            <span className="text-sm font-semibold text-primary-700">Discover Amazing Books</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-display">Browse Our Collection</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore thousands of books across various genres and find your next favorite read
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-primary-100 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search books by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white/70"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="appearance-none bg-white/70 border border-gray-300 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                >
                  <option value="">All Categories</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white/70 border border-gray-300 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "grid" ? "bg-white shadow-sm text-primary-600" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FiGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "list" ? "bg-white shadow-sm text-primary-600" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FiList className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedGenre) && (
            <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")} className="ml-2 hover:text-primary-600">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedGenre && (
                <span className="inline-flex items-center bg-secondary-100 text-secondary-800 px-3 py-1 rounded-full text-sm">
                  Category: {selectedGenre}
                  <button onClick={() => setSelectedGenre("")} className="ml-2 hover:text-secondary-600">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Results Count */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredBooks.length}</span> books
          </p>
        </motion.div>

        {/* Books Grid/List */}
        {error ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiX className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-red-600 font-semibold">{error}</p>
          </motion.div>
        ) : filteredBooks.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSearch className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-semibold">No books found</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4"
              >
                {filteredBooks.map((book, index) => (
                  <BookCard key={book._id} book={book} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {filteredBooks.map((book, index) => (
                  <BookListItem key={book._id} book={book} index={index} />
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
