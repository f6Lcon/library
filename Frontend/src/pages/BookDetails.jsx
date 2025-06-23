"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { bookService } from "../services/bookService"
import { borrowService } from "../services/borrowService"
import { useAuth } from "../context/AuthContext"
import { motion } from "framer-motion"
import { reviewService } from "../services/reviewService"
import {
  MdArrowBack,
  MdBook,
  MdPerson,
  MdCalendarToday,
  MdLocalOffer,
  MdBusiness,
  MdLanguage,
  MdPages,
  MdDescription,
  MdStar,
  MdFavorite,
  MdShare,
  MdLibraryAdd,
  MdCheckCircle,
  MdError,
  MdInventory,
  MdDateRange,
} from "react-icons/md"

const BookDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [borrowing, setBorrowing] = useState(false)
  const [borrowSuccess, setBorrowSuccess] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 })

  useEffect(() => {
    fetchBookDetails()
  }, [id])

  const fetchBookDetails = async () => {
    try {
      setLoading(true)
      const response = await bookService.getBookById(id)
      setBook(response.book)
      await fetchReviews()
    } catch (err) {
      setError("Failed to fetch book details")
      console.error("Error fetching book details:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const reviewData = await reviewService.getBookReviews(id)
      setReviews(reviewData.reviews || [])
      setReviewStats({
        averageRating: reviewData.averageRating || 0,
        totalReviews: reviewData.totalReviews || 0,
      })
    } catch (err) {
      console.error("Error fetching reviews:", err)
    }
  }

  const handleBorrow = async () => {
    if (!user) {
      navigate("/login")
      return
    }

    try {
      setBorrowing(true)
      await borrowService.borrowBook({
        bookId: book._id,
        borrowerId: user._id,
      })
      setBorrowSuccess(true)
      fetchBookDetails() // Refresh book data
      setTimeout(() => setBorrowSuccess(false), 3000)
    } catch (err) {
      setError(err.message || "Failed to borrow book")
    } finally {
      setBorrowing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
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

  if (error && !book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdError className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/books")}
              className="inline-flex items-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
            >
              <MdArrowBack className="w-5 h-5" />
              <span>Back to Books</span>
            </button>
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
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/books")}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <MdArrowBack className="w-5 h-5" />
          <span className="font-medium">Back to Books</span>
        </motion.button>

        {/* Success Message */}
        {borrowSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center space-x-2"
          >
            <MdCheckCircle className="w-5 h-5" />
            <span>Book borrowed successfully!</span>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center space-x-2"
          >
            <MdError className="w-5 h-5" />
            <span>{error}</span>
          </motion.div>
        )}

        {book && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Book Cover and Actions */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-primary-100 sticky top-24">
                {/* Book Cover */}
                <div className="w-full h-80 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl mb-6 overflow-hidden">
                  {book.imageUrl ? (
                    <img
                      src={book.imageUrl || "/placeholder.svg"}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MdBook className="w-16 h-16 text-primary-500" />
                    </div>
                  )}
                </div>

                {/* Availability Status */}
                <div className="mb-6">
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                      book.availableCopies > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    <MdInventory className="w-4 h-4 mr-2" />
                    {book.availableCopies > 0 ? "Available" : "Not Available"}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {book.availableCopies} of {book.totalCopies} copies available
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {user && (user.role === "student" || user.role === "community") && book.availableCopies > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBorrow}
                      disabled={borrowing}
                      className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      {borrowing ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span>Borrowing...</span>
                        </>
                      ) : (
                        <>
                          <MdLibraryAdd className="w-5 h-5" />
                          <span>Borrow Book</span>
                        </>
                      )}
                    </motion.button>
                  )}

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                      <MdFavorite className="w-5 h-5" />
                      <span>Save</span>
                    </button>
                    <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                      <MdShare className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                {/* Rating */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Rating</span>
                    <span className="text-sm text-gray-600">{reviewStats.averageRating.toFixed(1)}/5</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <MdStar
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(reviewStats.averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">({reviewStats.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Book Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Title and Basic Info */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-primary-100">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
                <div className="flex items-center space-x-4 text-lg text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MdPerson className="w-5 h-5 mr-2" />
                    <span>by {book.author}</span>
                  </div>
                  <div className="flex items-center">
                    <MdCalendarToday className="w-5 h-5 mr-2" />
                    <span>{book.publishedYear}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                    <MdLocalOffer className="w-4 h-4 mr-1" />
                    {book.category}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-100 text-secondary-800">
                    <MdLanguage className="w-4 h-4 mr-1" />
                    {book.language}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    <MdPages className="w-4 h-4 mr-1" />
                    {book.pages} pages
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-primary-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <MdDescription className="w-6 h-6 mr-2 text-primary-500" />
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed">{book.description}</p>
              </div>

              {/* Publication Details */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-primary-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <MdBusiness className="w-6 h-6 mr-2 text-primary-500" />
                  Publication Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <MdBusiness className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Publisher</p>
                      <p className="font-semibold text-gray-900">{book.publisher}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                      <MdDateRange className="w-5 h-5 text-secondary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Publication Year</p>
                      <p className="font-semibold text-gray-900">{book.publishedYear}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <MdBook className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ISBN</p>
                      <p className="font-semibold text-gray-900">{book.isbn}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MdPages className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pages</p>
                      <p className="font-semibold text-gray-900">{book.pages}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Branch Information */}
              {book.branch && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-primary-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Available At</h2>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                      <MdBook className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{book.branch.name}</p>
                      <p className="text-sm text-gray-600">Branch Code: {book.branch.code}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookDetails
