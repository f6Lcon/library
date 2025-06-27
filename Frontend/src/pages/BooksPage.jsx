"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import BookCard from "../components/BookCard"
import LoadingSpinner from "../components/LoadingSpinner"
import { bookService } from "../services/bookService"
import { MdSearch, MdFilterList, MdClose, MdLibraryBooks, MdViewModule, MdViewList } from "react-icons/md"

const BooksPage = () => {
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("")
  const [selectedAvailability, setSelectedAvailability] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("")
  const [sortBy, setSortBy] = useState("title")
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)

  const genres = ["Fiction", "Non-Fiction", "Science", "History", "Biography", "Children", "Reference", "Technology"]
  const sortOptions = [
    { value: "title", label: "Title (A-Z)" },
    { value: "author", label: "Author" },
    { value: "year", label: "Publication Year" },
    { value: "genre", label: "Genre" },
  ]

  useEffect(() => {
    fetchBooks()
  }, [])

  useEffect(() => {
    filterAndSortBooks()
  }, [books, searchTerm, selectedGenre, selectedAvailability, selectedBranch, sortBy])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const response = await bookService.getAllBooks()
      setBooks(response.data || [])
    } catch (error) {
      setError("Failed to fetch books. Please try again later.")
      console.error("Error fetching books:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortBooks = () => {
    let filtered = [...books]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.isbn?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply genre filter
    if (selectedGenre) {
      filtered = filtered.filter((book) => book.genre === selectedGenre)
    }

    // Apply availability filter
    if (selectedAvailability) {
      if (selectedAvailability === "available") {
        filtered = filtered.filter((book) => book.availableCopies > 0)
      } else if (selectedAvailability === "unavailable") {
        filtered = filtered.filter((book) => book.availableCopies === 0)
      }
    }

    // Apply branch filter
    if (selectedBranch) {
      filtered = filtered.filter((book) => book.branch === selectedBranch)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title?.localeCompare(b.title) || 0
        case "author":
          return a.author?.localeCompare(b.author) || 0
        case "year":
          return (b.publicationYear || 0) - (a.publicationYear || 0)
        case "genre":
          return a.genre?.localeCompare(b.genre) || 0
        default:
          return 0
      }
    })

    setFilteredBooks(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedGenre("")
    setSelectedAvailability("")
    setSelectedBranch("")
    setSortBy("title")
  }

  const activeFiltersCount = [searchTerm, selectedGenre, selectedAvailability, selectedBranch].filter(Boolean).length

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-cream-300 pt-16 lg:pt-18">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-500/10 to-primary-600/10 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-medium">
                <MdLibraryBooks className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-secondary-800 mb-4 font-display">Our Book Collection</h1>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Discover thousands of books across all genres and subjects
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white/30 backdrop-blur-sm sticky top-16 lg:top-18 z-40 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search books by title, author, or ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-secondary-200 rounded-2xl text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              {/* Filter Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="relative flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-secondary-200 rounded-xl text-secondary-700 hover:bg-white hover:text-primary-600 transition-all duration-300"
              >
                <MdFilterList className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </motion.button>

              {/* View Mode */}
              <div className="flex bg-white/80 backdrop-blur-sm border border-secondary-200 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "grid" ? "bg-primary-500 text-white" : "text-secondary-600 hover:text-primary-600"
                  }`}
                >
                  <MdViewModule className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "list" ? "bg-primary-500 text-white" : "text-secondary-600 hover:text-primary-600"
                  }`}
                >
                  <MdViewList className="w-4 h-4" />
                </button>
              </div>

              {/* Results Count */}
              <div className="text-sm text-secondary-600 font-medium">
                {filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 overflow-hidden"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Genre Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-secondary-700 mb-2">Genre</label>
                      <select
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-secondary-200 rounded-xl text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="">All Genres</option>
                        {genres.map((genre) => (
                          <option key={genre} value={genre}>
                            {genre}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Availability Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-secondary-700 mb-2">Availability</label>
                      <select
                        value={selectedAvailability}
                        onChange={(e) => setSelectedAvailability(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-secondary-200 rounded-xl text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="">All Books</option>
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                      </select>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-semibold text-secondary-700 mb-2">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-secondary-200 rounded-xl text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      >
                        {sortOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex items-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={clearFilters}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-xl hover:bg-secondary-200 transition-all duration-300"
                      >
                        <MdClose className="w-4 h-4" />
                        <span>Clear</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Books Grid/List */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-error-50 border border-error-200 text-error-700 px-6 py-4 rounded-2xl mb-8"
            >
              {error}
            </motion.div>
          )}

          {filteredBooks.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
              <div className="w-24 h-24 bg-secondary-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <MdLibraryBooks className="w-12 h-12 text-secondary-400" />
              </div>
              <h3 className="text-2xl font-semibold text-secondary-700 mb-4">No books found</h3>
              <p className="text-secondary-500 mb-6">
                {searchTerm || selectedGenre || selectedAvailability || selectedBranch
                  ? "Try adjusting your search criteria or filters"
                  : "No books are available in the library"}
              </p>
              {(searchTerm || selectedGenre || selectedAvailability || selectedBranch) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-2xl font-semibold hover:bg-primary-600 transition-all duration-300"
                >
                  <MdClose className="w-4 h-4" />
                  <span>Clear Filters</span>
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              layout
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              }`}
            >
              <AnimatePresence>
                {filteredBooks.map((book, index) => (
                  <motion.div
                    key={book._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    layout
                  >
                    <BookCard book={book} viewMode={viewMode} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

export default BooksPage
