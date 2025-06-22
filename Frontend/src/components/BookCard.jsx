"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import {
  MdLibraryBooks,
  MdPerson,
  MdCalendarToday,
  MdLocalOffer,
  MdStar,
  MdFavorite,
  MdMenuBook,
  MdEdit,
  MdDelete,
} from "react-icons/md"

const BookCard = ({
  book,
  index = 0,
  showActions = false,
  onEdit = null,
  onDelete = null,
  variant = "grid", // "grid" or "list"
}) => {
  if (variant === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.02 }}
        className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-primary-100 group"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-16 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
            {book.imageUrl ? (
              <img
                src={book.imageUrl || "/placeholder.svg"}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=64&width=48"
                }}
              />
            ) : (
              <MdLibraryBooks className="w-5 h-5 text-primary-500" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
              {book.title}
            </h3>

            <div className="flex items-center text-gray-600 mb-1">
              <MdPerson className="w-3.5 h-3.5 mr-1.5" />
              <span className="text-sm">{book.author}</span>
            </div>

            <div className="flex items-center space-x-3 text-sm text-gray-500 mb-1.5">
              <div className="flex items-center">
                <MdCalendarToday className="w-3.5 h-3.5 mr-1" />
                <span>{book.publishedYear}</span>
              </div>
              <div className="flex items-center">
                <MdLocalOffer className="w-3.5 h-3.5 mr-1" />
                <span>{book.category}</span>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <MdStar key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-1.5">4.5</span>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-1.5">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                book.availableCopies > 0 ? "bg-primary-100 text-primary-800" : "bg-red-100 text-red-800"
              }`}
            >
              {book.availableCopies > 0 ? "Available" : "Borrowed"}
            </span>

            <div className="flex space-x-1.5">
              {!showActions && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                >
                  <MdFavorite className="w-3.5 h-3.5 text-red-500" />
                </motion.button>
              )}

              {showActions ? (
                <div className="flex space-x-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(book)}
                      className="text-primary-600 hover:text-primary-900 font-medium text-sm"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(book._id)}
                      className="text-red-600 hover:text-red-900 font-medium text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ) : (
                <Link to={`/books/${book._id}`}>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-1.5 px-3 rounded-md font-semibold hover:shadow-sm transition-all duration-300 flex items-center text-sm"
                  >
                    <MdMenuBook className="w-3.5 h-3.5 mr-1" />
                    View Details
                  </motion.button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Grid variant (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -2, scale: 1.01 }}
      className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-primary-100 group"
    >
      <div className="relative mb-2">
        <div className="w-full h-28 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-md flex items-center justify-center overflow-hidden">
          {book.imageUrl ? (
            <img
              src={book.imageUrl || "/placeholder.svg"}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = "/placeholder.svg?height=112&width=84"
              }}
            />
          ) : (
            <MdLibraryBooks className="w-6 h-6 text-primary-500" />
          )}
        </div>
        {!showActions && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-1 right-1 w-5 h-5 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <MdFavorite className="w-2.5 h-2.5 text-red-500" />
          </motion.button>
        )}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xs font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors leading-tight">
          {book.title}
        </h3>

        <div className="flex items-center text-gray-600">
          <MdPerson className="w-3 h-3 mr-1" />
          <span className="text-xs truncate">{book.author}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <MdCalendarToday className="w-2.5 h-2.5 mr-1" />
            <span>{book.publishedYear}</span>
          </div>
          <div className="flex items-center">
            <MdLocalOffer className="w-2.5 h-2.5 mr-1" />
            <span className="truncate max-w-12">{book.category}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <MdStar key={i} className="w-2.5 h-2.5 fill-current" />
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-1">4.5</span>
          </div>
          <span
            className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
              book.availableCopies > 0 ? "bg-primary-100 text-primary-800" : "bg-red-100 text-red-800"
            }`}
          >
            {book.availableCopies > 0 ? "Available" : "Borrowed"}
          </span>
        </div>

        {showActions ? (
          <div className="flex justify-between pt-1">
            {onEdit && (
              <button
                onClick={() => onEdit(book)}
                className="text-primary-600 hover:text-primary-900 font-medium text-xs flex items-center"
              >
                <MdEdit className="w-3 h-3 mr-1" />
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(book._id)}
                className="text-red-600 hover:text-red-900 font-medium text-xs flex items-center"
              >
                <MdDelete className="w-3 h-3 mr-1" />
                Delete
              </button>
            )}
          </div>
        ) : (
          <Link to={`/books/${book._id}`}>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full mt-1.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-1.5 px-2 rounded-md text-xs font-semibold hover:shadow-sm transition-all duration-300 flex items-center justify-center"
            >
              <MdMenuBook className="w-3 h-3 mr-1" />
              View Details
            </motion.button>
          </Link>
        )}
      </div>
    </motion.div>
  )
}

export default BookCard
