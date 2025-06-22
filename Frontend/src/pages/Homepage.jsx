"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { bookService } from "../services/bookService"
import { userService } from "../services/userService"
import { borrowService } from "../services/borrowService"
import { motion } from "framer-motion"
import {
  FiBookOpen,
  FiUsers,
  FiTrendingUp,
  FiAward,
  FiArrowRight,
  FiBook,
  FiSearch,
  FiClock,
  FiStar,
  FiHeart,
  FiGlobe,
  FiShield,
  FiZap,
} from "react-icons/fi"
import { HiSparkles } from "react-icons/hi2"

const Homepage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeMembers: 0,
    totalBorrows: 0,
    yearsOfService: 25,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)

      // Fetch all data in parallel
      const results = await Promise.allSettled([
        bookService.getAllBooks({ limit: 1000 }), // Get all books for count
        userService.getActiveUsersCount(), // Get only active users for count
        borrowService.getAllBorrows({ limit: 1000 }), // Get all borrows for count
      ])

      let totalBooks = 0
      let activeMembers = 0
      let totalBorrows = 0

      // Handle books data
      if (results[0].status === "fulfilled") {
        totalBooks = results[0].value.total || results[0].value.books?.length || 0
      }

      // Handle users data - now only counting active users
      if (results[1].status === "fulfilled") {
        const users = results[1].value.users || []
        // Count all active users (students, community, librarians) excluding admins
        activeMembers = users.filter((user) => user.role !== "admin" && user.isActive !== false).length
      }

      // Handle borrows data
      if (results[2].status === "fulfilled") {
        totalBorrows = results[2].value.total || results[2].value.borrows?.length || 0
      }

      setStats({
        totalBooks,
        activeMembers,
        totalBorrows,
        yearsOfService: 25, // This remains static as it's about the institution
      })
    } catch (error) {
      console.error("Failed to fetch homepage stats:", error)
      // Keep default values if fetch fails
    } finally {
      setLoading(false)
    }
  }

  const displayStats = [
    {
      icon: FiBook,
      label: "Books Available",
      value: loading ? "Loading..." : `${stats.totalBooks.toLocaleString()}+`,
      color: "text-primary-500",
    },
    {
      icon: FiUsers,
      label: "Active Members",
      value: loading ? "Loading..." : `${stats.activeMembers.toLocaleString()}+`,
      color: "text-secondary-500",
    },
    {
      icon: FiTrendingUp,
      label: "Books Borrowed",
      value: loading ? "Loading..." : `${stats.totalBorrows.toLocaleString()}+`,
      color: "text-accent-500",
    },
    {
      icon: FiAward,
      label: "Years of Service",
      value: `${stats.yearsOfService}+`,
      color: "text-green-500",
    },
  ]

  const features = [
    {
      icon: FiSearch,
      title: "Smart Search",
      description: "Find any book instantly with our advanced search system",
      color: "bg-primary-500",
    },
    {
      icon: FiClock,
      title: "24/7 Access",
      description: "Access your digital library anytime, anywhere",
      color: "bg-secondary-500",
    },
    {
      icon: FiStar,
      title: "Curated Collection",
      description: "Handpicked books from the world's best authors",
      color: "bg-accent-500",
    },
    {
      icon: FiHeart,
      title: "Personalized",
      description: "Get recommendations based on your reading preferences",
      color: "bg-pink-500",
    },
  ]

  const benefits = [
    {
      icon: FiGlobe,
      title: "Global Access",
      description: "Access books from libraries worldwide",
    },
    {
      icon: FiShield,
      title: "Secure Platform",
      description: "Your data is protected with enterprise-grade security",
    },
    {
      icon: FiZap,
      title: "Lightning Fast",
      description: "Instant book downloads and seamless browsing",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full px-6 py-2 mb-6"
              >
                <HiSparkles className="w-5 h-5 text-primary-500 mr-2" />
                <span className="text-sm font-semibold text-primary-700">Welcome to the Future of Reading</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-display leading-tight"
              >
                Knowledge
                <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                  {" "}
                  Empowering{" "}
                </span>
                Youth Library
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 mb-8 leading-relaxed"
              >
                Discover a world of knowledge with our modern digital library. Access thousands of books, connect with
                fellow readers, and embark on your learning journey today.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                {user ? (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/dashboard"
                      className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span>Go to Dashboard</span>
                      <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                ) : (
                  <>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/login"
                        className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <span>Get Started</span>
                        <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/books"
                        className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-2xl shadow-lg hover:shadow-xl border-2 border-primary-200 hover:border-primary-300 transition-all duration-300"
                      >
                        <FiBook className="w-5 h-5 mr-2" />
                        <span>Browse Books</span>
                      </Link>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center justify-center"
                      >
                        <FiBookOpen className="w-8 h-8 text-white" />
                      </motion.div>
                    ))}
                  </div>
                </div>
                <motion.div
                  className="absolute -top-4 -right-4 w-12 h-12 bg-accent-400 rounded-full flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <HiSparkles className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {displayStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg mb-4 ${stat.color}`}
                >
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-display">Why Choose KEY Library?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of reading with our cutting-edge features designed for modern learners
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.color} mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 font-display">Unlock Your Potential</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Join thousands of learners who have transformed their knowledge journey with KEY Library
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{benefit.title}</h3>
                <p className="text-white/80">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/50"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl mb-8">
              <FiBookOpen className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 font-display">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our community of passionate readers and unlock access to thousands of books, personalized
              recommendations, and exclusive content.
            </p>
            {!user && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span>Join KEY Library Today</span>
                  <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Homepage
