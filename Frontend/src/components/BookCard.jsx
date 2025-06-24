"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { FiBook, FiEdit, FiTrash2, FiBookOpen, FiStar, FiEye, FiHeart } from "react-icons/fi"

const BookCard = ({
  book,
  index = 0,
  showActions = false,
  onEdit = null,
  onDelete = null,
  onIssue = null,
  variant = "grid", // "grid" or "list"
  showBranchInfo = true,
  className = "",
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.02,
        ease: "easeOut",
      },
    },
  }

  const hoverVariants = {
    hover: {
      y: -6,
      scale: 1.02,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  }

  if (variant === "list") {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className={`bg-white rounded-2xl p-4 shadow-soft hover:shadow-medium transition-all duration-300 border border-secondary-200 group ${className}`}
      >
        <div className="flex items-center space-x-4">
          {/* Book Image */}
          <Link to={`/books/${book._id}`} className="flex-shrink-0">
            <div className="w-12 h-12 bg-secondary-100 rounded-xl overflow-hidden shadow-soft group-hover:shadow-medium transition-shadow">
              {book.imageUrl ? (
                <img
                  src={book.imageUrl || "/placeholder.svg"}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=48&width=48"
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary-100 to-secondary-200">
                  <FiBook className="w-6 h-6 text-secondary-400" />
                </div>
              )}
            </div>
          </Link>

          {/* Book Info */}
          <div className="flex-1 min-w-0">
            <Link to={`/books/${book._id}`}>
              <h3 className="text-base font-semibold text-secondary-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1 cursor-pointer">
                {book.title}
              </h3>
            </Link>

            <div className="flex items-center text-secondary-600 mb-2">
              <span className="text-sm truncate">by {book.author}</span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-secondary-500 mb-2">
              <span>{book.publishedYear}</span>
              <span className="truncate">{book.category}</span>
              {showBranchInfo && book.branch && (
                <span className="font-mono bg-secondary-100 px-2 py-1 rounded-lg text-xs">{book.branch.code}</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    book.availableCopies > 0 ? "bg-success-100 text-success-700" : "bg-error-100 text-error-700"
                  }`}
                >
                  {book.availableCopies > 0 ? "Available" : "Out of Stock"}
                </span>
              </div>

              <div className="flex items-center text-warning-500">
                <FiStar className="w-4 h-4 fill-current" />
                <span className="text-sm text-secondary-600 ml-1">
                  {book.averageRating ? book.averageRating.toFixed(1) : "0.0"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex space-x-2">
              {onEdit && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onEdit(book)}
                  className="p-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors shadow-soft"
                >
                  <FiEdit className="w-4 h-4" />
                </motion.button>
              )}
              {onDelete && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDelete(book._id)}
                  className="p-2 bg-error-500 text-white rounded-xl hover:bg-error-600 transition-colors shadow-soft"
                >
                  <FiTrash2 className="w-4 h-4" />
                </motion.button>
              )}
              {onIssue && book.availableCopies > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onIssue(book)}
                  className="p-2 bg-success-500 text-white rounded-xl hover:bg-success-600 transition-colors shadow-soft"
                >
                  <FiBookOpen className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  // Grid variant (Modern Smart Design)
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hoverVariants.hover}
      className={`group cursor-pointer ${className}`}
    >
      <Link to={`/books/${book._id}`} className="block">
        <div className="bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 border border-secondary-200 overflow-hidden group-hover:border-primary-300">
          {/* Book Cover */}
          <div className="relative w-full h-32 bg-secondary-100 overflow-hidden">
            {book.imageUrl ? (
              <img
                src={book.imageUrl || "/placeholder.svg"}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=128&width=200"
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary-100 to-secondary-200">
                <FiBook className="w-10 h-10 text-secondary-400" />
              </div>
            )}

            {/* Availability Badge */}
            <div className="absolute top-3 right-3">
              <span
                className={`px-2 py-1 rounded-xl text-xs font-medium shadow-soft ${
                  book.availableCopies > 0 ? "bg-success-500 text-white" : "bg-error-500 text-white"
                }`}
              >
                {book.availableCopies > 0 ? book.availableCopies : "0"}
              </span>
            </div>

            {/* Favorite Button */}
            {!showActions && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-soft hover:bg-white transition-colors"
              >
                <FiHeart className="w-4 h-4 text-error-500" />
              </motion.button>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white rounded-2xl p-3 shadow-large">
                  <FiEye className="w-6 h-6 text-secondary-700" />
                </div>
              </div>
            </div>

            {/* Admin Actions Overlay */}
            {showActions && (
              <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex flex-col space-y-2">
                  {onEdit && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onEdit(book)
                      }}
                      className="p-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors shadow-soft"
                    >
                      <FiEdit className="w-4 h-4" />
                    </motion.button>
                  )}
                  {onDelete && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onDelete(book._id)
                      }}
                      className="p-2 bg-error-500 text-white rounded-xl hover:bg-error-600 transition-colors shadow-soft"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </motion.button>
                  )}
                  {onIssue && book.availableCopies > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onIssue(book)
                      }}
                      className="p-2 bg-success-500 text-white rounded-xl hover:bg-success-600 transition-colors shadow-soft"
                    >
                      <FiBookOpen className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-secondary-900 line-clamp-2 leading-tight mb-2 group-hover:text-primary-600 transition-colors">
              {book.title}
            </h3>

            <p className="text-xs text-secondary-600 mb-3 line-clamp-1">by {book.author}</p>

            <div className="flex items-center justify-between text-xs text-secondary-500 mb-3">
              <span>{book.publishedYear}</span>
              <div className="flex items-center">
                <FiStar className="w-3 h-3 text-warning-500 fill-current mr-1" />
                <span>{book.averageRating ? book.averageRating.toFixed(1) : "0.0"}</span>
              </div>
            </div>

            {/* Category and Branch */}
            <div className="flex items-center justify-between">
              <span className="text-xs bg-secondary-100 text-secondary-700 px-3 py-1 rounded-xl font-medium">
                {book.category}
              </span>
              {showBranchInfo && book.branch && (
                <span className="text-xs font-mono bg-primary-100 text-primary-700 px-2 py-1 rounded-lg">
                  {book.branch.code}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default BookCard
