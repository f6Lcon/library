"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { bookService } from "../services/bookService"
import { userService } from "../services/userService"
import { borrowService } from "../services/borrowService"
import BookCard from "../components/BookCard"
import LoadingSpinner from "../components/LoadingSpinner"
import { FiBook, FiUsers, FiBookOpen, FiCalendar, FiArrowRight, FiStar, FiTrendingUp } from "react-icons/fi"

const Homepage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeMembers: 0,
    booksBorrowed: 0,
    yearsOfService: 15,
  })
  const [featuredBooks, setFeaturedBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchHomepageData()
  }, [])

  const fetchHomepageData = async () => {
    try {
      setLoading(true)
      setError("")

      // Fetch all data in parallel
      const [booksResponse, usersResponse, borrowsResponse, featuredResponse] = await Promise.all([
        bookService.getAllBooks({ limit: 1 }), // Just get count
        userService.getActiveUsersCount(),
        borrowService.getAllBorrows({ limit: 1 }), // Just get count
        bookService.getAllBooks({ limit: 6, sort: "rating" }), // Featured books
      ])

      setStats({
        totalBooks: booksResponse.total || 0,
        activeMembers: usersResponse.count || 0,
        booksBorrowed: borrowsResponse.total || 0,
        yearsOfService: 15, // Static institutional data
      })

      setFeaturedBooks(featuredResponse.books || [])
    } catch (err) {
      console.error("Error fetching homepage data:", err)
      setError("Failed to load homepage data")
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Books Available",
      value: stats.totalBooks,
      icon: FiBook,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Active Members",
      value: stats.activeMembers,
      icon: FiUsers,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Books Borrowed",
      value: stats.booksBorrowed,
      icon: FiBookOpen,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Years of Service",
      value: stats.yearsOfService,
      icon: FiCalendar,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner fullScreen size="lg" text="Loading homepage..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                KEY Library
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Discover knowledge, explore new worlds, and unlock your potential with our comprehensive digital library
              system.
            </p>

            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/books"
                  className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FiBook className="mr-2" />
                  Browse Books
                  <FiArrowRight className="ml-2" />
                </Link>
                <Link
                  to={`/${user.role}-dashboard`}
                  className="inline-flex items-center px-8 py-4 bg-primary-500/20 text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/10 transition-all duration-200"
                >
                  Go to Dashboard
                  <FiArrowRight className="ml-2" />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Sign In
                  <FiArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-8 py-4 bg-primary-500/20 text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/10 transition-all duration-200"
                >
                  Join Library
                  <FiArrowRight className="ml-2" />
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Library at a Glance</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the impact and reach of our library community
            </p>
          </motion.div>

          {error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchHomepageData}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="relative group"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-gray-200">
                    <div
                      className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <stat.icon className={`w-8 h-8 ${stat.textColor}`} />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value.toLocaleString()}</h3>
                    <p className="text-gray-600 font-medium">{stat.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Books Section */}
      {featuredBooks.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center mb-4">
                <FiStar className="w-6 h-6 text-yellow-500 mr-2" />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Books</h2>
                <FiTrendingUp className="w-6 h-6 text-green-500 ml-2" />
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our most popular and highly-rated books
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBooks.map((book, index) => (
                <motion.div
                  key={book._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <BookCard book={book} variant="grid" />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center mt-12"
            >
              <Link
                to="/books"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                View All Books
                <FiArrowRight className="ml-2" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Homepage
