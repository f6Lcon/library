"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { FiBook, FiEdit, FiTrash2, FiBookOpen, FiStar, FiEye } from "react-icons/fi"

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
      y: -4,
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
        className={`bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 group ${className}`}
      >
        <div className="flex items-center space-x-3">
          {/* Book Image */}
          <Link to={`/books/${book._id}`} className="flex-shrink-0">
            <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
              {book.imageUrl ? (
                <img
                  src={book.imageUrl || "/placeholder.svg"}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=40&width=40"
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <FiBook className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
          </Link>

          {/* Book Info */}
          <div className="flex-1 min-w-0">
            <Link to={`/books/${book._id}`}>
              <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer">
                {book.title}
              </h3>
            </Link>

            <div className="flex items-center text-gray-600 mb-1">
              <span className="text-xs truncate">by {book.author}</span>
            </div>

            <div className="flex items-center space-x-3 text-xs text-gray-500 mb-1">
              <span>{book.publishedYear}</span>
              <span className="truncate">{book.category}</span>
              {showBranchInfo && book.branch && (
                <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs">{book.branch.code}</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    book.availableCopies > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {book.availableCopies > 0 ? "Available" : "Out of Stock"}
                </span>
              </div>

              <div className="flex items-center text-yellow-500">
                <FiStar className="w-3 h-3 fill-current" />
                <span className="text-xs text-gray-600 ml-1">
                  {book.averageRating ? book.averageRating.toFixed(1) : "0.0"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex space-x-1">
              {onEdit && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onEdit(book)}
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  <FiEdit className="w-3 h-3" />
                </motion.button>
              )}
              {onDelete && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDelete(book._id)}
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  <FiTrash2 className="w-3 h-3" />
                </motion.button>
              )}
              {onIssue && book.availableCopies > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onIssue(book)}
                  className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  <FiBookOpen className="w-3 h-3" />
                </motion.button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  // Grid variant (OpenLibrary style)
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hoverVariants.hover}
      className={`group cursor-pointer ${className}`}
    >
      <Link to={`/books/${book._id}`} className="block">
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden">
          {/* Book Cover */}
          <div className="relative w-full h-32 bg-gray-100 overflow-hidden">
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
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <FiBook className="w-8 h-8 text-gray-400" />
              </div>
            )}

            {/* Availability Badge */}
            <div className="absolute top-2 right-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium shadow-sm ${
                  book.availableCopies > 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"
                }`}
              >
                {book.availableCopies > 0 ? book.availableCopies : "0"}
              </span>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white rounded-full p-2 shadow-lg">
                  <FiEye className="w-5 h-5 text-gray-700" />
                </div>
              </div>
            </div>

            {/* Admin Actions Overlay */}
            {showActions && (
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex flex-col space-y-1">
                  {onEdit && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onEdit(book)
                      }}
                      className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shadow-sm"
                    >
                      <FiEdit className="w-3 h-3" />
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
                      className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors shadow-sm"
                    >
                      <FiTrash2 className="w-3 h-3" />
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
                      className="p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors shadow-sm"
                    >
                      <FiBookOpen className="w-3 h-3" />
                    </motion.button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="p-3">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight mb-1 group-hover:text-blue-600 transition-colors">
              {book.title}
            </h3>

            <p className="text-xs text-gray-600 mb-2 line-clamp-1">by {book.author}</p>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{book.publishedYear}</span>
              <div className="flex items-center">
                <FiStar className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                <span>{book.averageRating ? book.averageRating.toFixed(1) : "0.0"}</span>
              </div>
            </div>

            {/* Category and Branch */}
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{book.category}</span>
              {showBranchInfo && book.branch && (
                <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">
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
