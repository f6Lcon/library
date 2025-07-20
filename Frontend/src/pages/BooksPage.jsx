"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { bookService } from "../services/bookService"
import BookCard from "../components/BookCard"
import LoadingSpinner from "../components/LoadingSpinner"
import { MdSearch, MdFilterList, MdGridView, MdViewList, MdLibraryBooks, MdRefresh } from "react-icons/md"

const BooksPage = () => {
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [sortBy, setSortBy] = useState("title")
  const [sortOrder, setSortOrder] = useState("asc")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalBooks, setTotalBooks] = useState(0)
  const booksPerPage = 12

  useEffect(() => {
    console.log("BooksPage mounted, fetching categories...")
    fetchCategories()
  }, [])

  useEffect(() => {
    console.log("Fetching books with params:", {
      currentPage,
      selectedCategory,
      sortBy,
      sortOrder,
      searchQuery,
    })
    fetchBooks()
  }, [currentPage, selectedCategory, sortBy, sortOrder])

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery !== "") {
        console.log("Searching for:", searchQuery)
        setCurrentPage(1)
        fetchBooks()
      } else if (searchQuery === "") {
        console.log("Search cleared, fetching all books")
        fetchBooks()
      }
    }, 500)

    return () => clearTimeout(delayedSearch)
  }, [searchQuery])

  const fetchBooks = async () => {
    try {
      setSearchLoading(true)
      console.log("Calling bookService.getAllBooks with params:", {
        page: currentPage,
        limit: booksPerPage,
        search: searchQuery,
        category: selectedCategory,
        sortBy,
        sortOrder,
      })

      const response = await bookService.getAllBooks({
        page: currentPage,
        limit: booksPerPage,
        search: searchQuery,
        category: selectedCategory,
        sortBy,
        sortOrder,
      })

      console.log("Book service response:", response)

      if (response && response.books) {
        setBooks(response.books)
        setTotalPages(response.totalPages || 1)
        setTotalBooks(response.total || 0)
        console.log(`Fetched ${response.books.length} books out of ${response.total} total`)
      } else {
        console.warn("Invalid response structure:", response)
        setBooks([])
        setTotalPages(1)
        setTotalBooks(0)
      }
      setError("")
    } catch (error) {
      console.error("Error fetching books:", error)
      setError("Failed to load books. Please try again.")
      setBooks([])
    } finally {
      setLoading(false)
      setSearchLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      console.log("Fetching categories...")
      const response = await bookService.getCategories()
      console.log("Categories response:", response)

      if (response && response.categories) {
        setCategories(response.categories)
        console.log(`Fetched ${response.categories.length} categories`)
      } else {
        console.warn("Invalid categories response:", response)
        setCategories([])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      setCategories([])
    }
  }

  const handleSearch = (e) => {
    const value = e.target.value
    console.log("Search input changed:", value)
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleCategoryChange = (category) => {
    console.log("Category changed:", category)
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handleSortChange = (newSortBy) => {
    console.log("Sort changed:", newSortBy)
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(newSortBy)
      setSortOrder("asc")
    }
    setCurrentPage(1)
  }

  const clearFilters = () => {
    console.log("Clearing all filters")
    setSearchQuery("")
    setSelectedCategory("")
    setSortBy("title")
    setSortOrder("asc")
    setCurrentPage(1)
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-12">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 text-gray-700 hover:bg-teal-50 hover:text-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          Previous
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-xl transition-all duration-300 ${
              currentPage === page
                ? "bg-teal-500 text-white shadow-lg"
                : "bg-white/80 backdrop-blur-sm border border-white/50 text-gray-700 hover:bg-teal-50 hover:text-teal-600"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 text-gray-700 hover:bg-teal-50 hover:text-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          Next
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-300 pt-16 lg:pt-18 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-600">Loading books...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-300 pt-16 lg:pt-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-lg">
              <MdLibraryBooks className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4 font-display">
            Explore Our{" "}
            <span className="bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">Collection</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover thousands of books across all genres and subjects
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search books by title, author, or ISBN..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
              />
              {searchLoading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <LoadingSpinner size="sm" />
                </div>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors duration-300 flex items-center space-x-2"
            >
              <MdFilterList className="w-5 h-5" />
              <span>Filters</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-2xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  viewMode === "grid" ? "bg-white shadow-lg text-teal-600" : "text-gray-600"
                }`}
              >
                <MdGridView className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  viewMode === "list" ? "bg-white shadow-lg text-teal-600" : "text-gray-600"
                }`}
              >
                <MdViewList className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  >
                    <option value="title">Title</option>
                    <option value="author">Author</option>
                    <option value="publishedYear">Year</option>
                    <option value="createdAt">Date Added</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-800 transition-colors duration-300 text-sm"
                >
                  Clear all filters
                </button>
                <button
                  onClick={fetchBooks}
                  className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors duration-300"
                >
                  <MdRefresh className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {books.length} of {totalBooks} books
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory && ` in ${selectedCategory}`}
          </p>
        </div>

     

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8"
          >
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchBooks}
              className="mt-3 text-red-600 hover:text-red-800 transition-colors duration-300 text-sm font-medium"
            >
              Try again
            </button>
          </motion.div>
        )}

        {/* Books Grid/List */}
        {books.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={
              viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
            }
          >
            {books.map((book, index) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <BookCard book={book} viewMode={viewMode} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <MdLibraryBooks className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No books found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory
                ? "Try adjusting your search criteria or filters"
                : "No books are available in the library"}
            </p>
            {(searchQuery || selectedCategory) && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors duration-300"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        )}

        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  )
}

export default BooksPage
