"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import { bookService } from "../services/bookService"
import { userService } from "../services/userService"
import { borrowService } from "../services/borrowService"
import BookCard from "../components/BookCard"
import {
  FiBook,
  FiUsers,
  FiTrendingUp,
  FiArrowRight,
  FiStar,
  FiBookOpen,
  FiSearch,
  FiHeart,
  FiAward,
  FiGlobe,
} from "react-icons/fi"
import { HiSparkles } from "react-icons/hi2"

const Homepage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalBorrows: 0,
    availableBooks: 0,
  })
  const [featuredBooks, setFeaturedBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      const results = await Promise.allSettled([
        bookService.getAllBooks({ limit: 8 }),
        userService.getAllUsers(),
        borrowService.getAllBorrows ? borrowService.getAllBorrows() : Promise.resolve({ borrows: [] }),
      ])

      // Handle books
      if (results[0].status === "fulfilled") {
        const booksData = results[0].value
        setFeaturedBooks(booksData.books || [])
        setStats((prev) => ({
          ...prev,
          totalBooks: booksData.totalBooks || booksData.books?.length || 0,
          availableBooks: (booksData.books || []).filter((book) => book.availableCopies > 0).length,
        }))
      }

      // Handle users
      if (results[1].status === "fulfilled") {
        const usersData = results[1].value
        setStats((prev) => ({
          ...prev,
          totalUsers: usersData.totalUsers || usersData.users?.length || 0,
        }))
      }

      // Handle borrows
      if (results[2].status === "fulfilled") {
        const borrowsData = results[2].value
        setStats((prev) => ({
          ...prev,
          totalBorrows: borrowsData.totalBorrows || borrowsData.borrows?.length || 0,
        }))
      }
    } catch (err) {
      console.error("Error fetching homepage data:", err)
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent-500/5 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <div className="inline-flex items-center bg-gradient-to-r from-primary-100 to-primary-200 rounded-full px-6 py-3 mb-6">
                <HiSparkles className="w-5 h-5 text-primary-600 mr-2" />
                <span className="text-sm font-semibold text-primary-700">Welcome to KEY Library System</span>
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-900 mb-6 font-display leading-tight"
            >
              Knowledge{" "}
              <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                Empowering
              </span>{" "}
              Youth
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-secondary-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Discover, learn, and grow with our comprehensive digital library system. Access thousands of books, manage
              your reading journey, and connect with knowledge like never before.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!user ? (
                <>
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-large transition-all duration-300 flex items-center space-x-2 group"
                    >
                      <span>Get Started</span>
                      <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                  <Link to="/books">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-primary-200 hover:border-primary-300 hover:shadow-medium transition-all duration-300 flex items-center space-x-2"
                    >
                      <FiSearch className="w-5 h-5" />
                      <span>Browse Books</span>
                    </motion.button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-large transition-all duration-300 flex items-center space-x-2 group"
                    >
                      <span>Go to Dashboard</span>
                      <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                  <Link to="/books">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-primary-200 hover:border-primary-300 hover:shadow-medium transition-all duration-300 flex items-center space-x-2"
                    >
                      <FiBookOpen className="w-5 h-5" />
                      <span>Explore Books</span>
                    </motion.button>
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              {
                icon: FiBook,
                label: "Total Books",
                value: stats.totalBooks,
                color: "primary",
                description: "Books in collection",
              },
              {
                icon: FiUsers,
                label: "Active Users",
                value: stats.totalUsers,
                color: "success",
                description: "Registered members",
              },
              {
                icon: FiTrendingUp,
                label: "Books Borrowed",
                value: stats.totalBorrows,
                color: "accent",
                description: "Total borrows",
              },
              {
                icon: FiBookOpen,
                label: "Available Now",
                value: stats.availableBooks,
                color: "warning",
                description: "Ready to borrow",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 border border-secondary-200 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 bg-${stat.color}-100 rounded-xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-secondary-900">{loading ? "..." : stat.value}</div>
                    <div className="text-sm text-secondary-500">{stat.description}</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-secondary-900">{stat.label}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-12"
          >
            <motion.div variants={itemVariants} className="mb-4">
              <div className="inline-flex items-center bg-gradient-to-r from-primary-100 to-primary-200 rounded-full px-4 py-2">
                <FiStar className="w-4 h-4 text-primary-600 mr-2" />
                <span className="text-sm font-semibold text-primary-700">Featured Collection</span>
              </div>
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4 font-display"
            >
              Discover Amazing Books
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Explore our curated selection of popular and trending books across various categories
            </motion.p>
          </motion.div>

          {featuredBooks.length > 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 mb-12"
            >
              {featuredBooks.slice(0, 8).map((book, index) => (
                <BookCard key={book._id} book={book} index={index} showActions={false} variant="grid" />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <FiBook className="w-10 h-10 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">No books available</h3>
              <p className="text-secondary-600">Check back later for featured books</p>
            </div>
          )}

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            className="text-center"
          >
            <Link to="/books">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-large transition-all duration-300 flex items-center space-x-2 mx-auto group"
              >
                <span>View All Books</span>
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-12"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4 font-display"
            >
              Why Choose KEY Library?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Experience the future of library management with our comprehensive digital platform
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: FiSearch,
                title: "Smart Search",
                description: "Find books instantly with our advanced search and filtering system",
                color: "primary",
              },
              {
                icon: FiHeart,
                title: "Personal Library",
                description: "Track your reading history, favorites, and personalized recommendations",
                color: "error",
              },
              {
                icon: FiGlobe,
                title: "Multi-Branch Access",
                description: "Access books from multiple library branches in one unified system",
                color: "success",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 border border-secondary-200 group text-center"
              >
                <div
                  className={`w-16 h-16 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`w-8 h-8 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">{feature.title}</h3>
                <p className="text-secondary-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

            <motion.div variants={itemVariants} className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FiAward className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">Ready to Start Reading?</h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                Join thousands of readers who have discovered the joy of learning with KEY Library System
              </p>
              {!user ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-large transition-all duration-300 flex items-center space-x-2"
                    >
                      <span>Sign In Now</span>
                      <FiArrowRight className="w-5 h-5" />
                    </motion.button>
                  </Link>
                  <Link to="/books">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-primary-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-primary-400 hover:bg-primary-800 transition-all duration-300 flex items-center space-x-2"
                    >
                      <FiBookOpen className="w-5 h-5" />
                      <span>Browse First</span>
                    </motion.button>
                  </Link>
                </div>
              ) : (
                <Link to="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-large transition-all duration-300 flex items-center space-x-2 mx-auto"
                  >
                    <span>Go to Your Dashboard</span>
                    <FiArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Homepage
