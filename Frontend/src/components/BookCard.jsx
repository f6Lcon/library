"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import {
  FiBook,
  FiUser,
  FiCalendar,
  FiTag,
  FiMapPin,
  FiEdit,
  FiTrash2,
  FiBookOpen,
  FiStar,
  FiHeart,
} from "react-icons/fi"

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
        delay: index * 0.05,
        ease: "easeOut",
      },
    },
  }

  const hoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  }

  if (variant === "list") {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className={`bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary-100 group ${className}`}
      >
        <div className="flex items-center space-x-4">
          {/* Book Image */}
          <div className="w-16 h-20 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden shadow-md">
            {book.imageUrl ? (
              <img
                src={book.imageUrl || "/placeholder.svg"}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=80&width=64"
                }}
              />
            ) : (
              <FiBook className="w-6 h-6 text-primary-500" />
            )}
          </div>

          {/* Book Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
              {book.title}
            </h3>

            <div className="flex items-center text-gray-600 mb-2">
              <FiUser className="w-4 h-4 mr-2" />
              <span className="text-sm truncate">{book.author}</span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
              <div className="flex items-center">
                <FiCalendar className="w-4 h-4 mr-1" />
                <span>{book.publishedYear}</span>
              </div>
              <div className="flex items-center">
                <FiTag className="w-4 h-4 mr-1" />
                <span className="truncate">{book.category}</span>
              </div>
              {showBranchInfo && book.branch && (
                <div className="flex items-center">
                  <FiMapPin className="w-4 h-4 mr-1" />
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{book.branch.code}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    book.availableCopies > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {book.availableCopies > 0 ? `${book.availableCopies} Available` : "Out of Stock"}
                </span>
                <span className="text-xs text-gray-500">
                  {book.availableCopies}/{book.totalCopies} copies
                </span>
              </div>

              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="text-sm text-gray-600 ml-2">4.5</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-2">
            {!showActions && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors border border-primary-100"
              >
                <FiHeart className="w-4 h-4 text-red-500" />
              </motion.button>
            )}

            {showActions ? (
              <div className="flex space-x-2">
                {onEdit && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onEdit(book)}
                    className="px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium flex items-center space-x-1"
                  >
                    <FiEdit className="w-4 h-4" />
                    <span>Edit</span>
                  </motion.button>
                )}
                {onDelete && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDelete(book._id)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center space-x-1"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </motion.button>
                )}
                {onIssue && book.availableCopies > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onIssue(book)}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center space-x-1"
                  >
                    <FiBookOpen className="w-4 h-4" />
                    <span>Issue</span>
                  </motion.button>
                )}
              </div>
            ) : (
              <Link to={`/books/${book._id}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                >
                  <FiBookOpen className="w-4 h-4" />
                  <span>View Details</span>
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  // Grid variant (default)
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hoverVariants.hover}
      className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-primary-100 group overflow-hidden ${className}`}
    >
      {/* Book Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50">
        {book.imageUrl ? (
          <img
            src={book.imageUrl || "/placeholder.svg"}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = "/placeholder.svg?height=320&width=240"
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiBook className="w-12 h-12 text-primary-500" />
          </div>
        )}

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
              book.availableCopies > 0 ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
            }`}
          >
            {book.availableCopies > 0 ? book.availableCopies : "Out"}
          </span>
        </div>

        {/* Favorite Button */}
        {!showActions && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <FiHeart className="w-4 h-4 text-red-500" />
          </motion.button>
        )}
      </div>

      {/* Book Info */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-tight mb-2 group-hover:text-primary-600 transition-colors">
            {book.title}
          </h3>

          <div className="flex items-center text-gray-600 mb-2">
            <FiUser className="w-4 h-4 mr-2" />
            <span className="text-sm truncate">{book.author}</span>
          </div>
        </div>

        {/* Category and Branch */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-primary-600 font-bold bg-primary-100 px-2 py-1 rounded-lg flex items-center">
            <FiTag className="w-3 h-3 mr-1" />
            {book.category}
          </span>
          {showBranchInfo && book.branch && (
            <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded flex items-center">
              <FiMapPin className="w-3 h-3 mr-1" />
              {book.branch.code}
            </span>
          )}
        </div>

        {/* Book Details */}
        <div className="text-xs text-gray-500 mb-3 space-y-1">
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <FiCalendar className="w-3 h-3 mr-1" />
              Year:
            </span>
            <span className="font-medium">{book.publishedYear}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <FiBook className="w-3 h-3 mr-1" />
              Pages:
            </span>
            <span className="font-medium">{book.pages}</span>
          </div>
          <div className="flex justify-between items-center font-bold">
            <span>Stock:</span>
            <span className={book.availableCopies > 0 ? "text-primary-600" : "text-red-600"}>
              {book.availableCopies}/{book.totalCopies}
            </span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-2">4.5</span>
          </div>
          <span className="text-xs text-gray-500">{book.isbn}</span>
        </div>

        {/* Actions */}
        {showActions ? (
          <div className="space-y-2">
            <div className="flex space-x-2">
              {onEdit && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEdit(book)}
                  className="flex-1 bg-primary-500 text-white py-2 px-3 rounded-lg text-xs font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center space-x-1"
                >
                  <FiEdit className="w-3 h-3" />
                  <span>Edit</span>
                </motion.button>
              )}
              {onDelete && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onDelete(book._id)}
                  className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors flex items-center justify-center space-x-1"
                >
                  <FiTrash2 className="w-3 h-3" />
                  <span>Delete</span>
                </motion.button>
              )}
            </div>
            {onIssue && book.availableCopies > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onIssue(book)}
                className="w-full bg-green-500 text-white py-2 px-3 rounded-lg text-xs font-semibold hover:bg-green-600 transition-colors flex items-center justify-center space-x-1"
              >
                <FiBookOpen className="w-3 h-3" />
                <span>Issue Book</span>
              </motion.button>
            )}
          </div>
        ) : (
          <Link to={`/books/${book._id}`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2 px-3 rounded-lg text-xs font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-1"
            >
              <FiBookOpen className="w-3 h-3" />
              <span>View Details</span>
            </motion.button>
          </Link>
        )}
      </div>
    </motion.div>
  )
}

export default BookCard
