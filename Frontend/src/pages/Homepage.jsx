"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { motion } from "framer-motion"
import {
  MdLibraryBooks,
  MdSearch,
  MdAutoStories,
  MdGroups,
  MdEmojiEvents,
  MdStar,
  MdArrowForward,
  MdMenuBook,
  MdLocationOn,
} from "react-icons/md"
import { FaUsers, FaBookOpen, FaGraduationCap, FaHeart } from "react-icons/fa"

const Homepage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    activeLoans: 0,
    branches: 0,
  })

  useEffect(() => {
    // Fetch stats from API
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
        // Set dummy data for demo
        setStats({
          totalBooks: 15420,
          totalMembers: 3250,
          activeLoans: 890,
          branches: 8,
        })
      }
    }

    fetchStats()
  }, [])

  const features = [
    {
      icon: MdLibraryBooks,
      title: "Vast Collection",
      description: "Access thousands of books across all genres and subjects",
      color: "from-primary-500 to-primary-600",
    },
    {
      icon: MdSearch,
      title: "Smart Search",
      description: "Find exactly what you need with our advanced search system",
      color: "from-accent-500 to-accent-600",
    },
    {
      icon: MdAutoStories,
      title: "Digital Reading",
      description: "Enjoy e-books and digital resources anytime, anywhere",
      color: "from-success-500 to-success-600",
    },
    {
      icon: MdGroups,
      title: "Community Hub",
      description: "Connect with fellow readers and join book clubs",
      color: "from-secondary-500 to-secondary-600",
    },
  ]

  const testimonials = [
    {
      name: "Martin Kimiri",
      role: "Student",
      content:
        "The KEY Library has been instrumental in my academic journey. The vast collection and helpful staff make studying a pleasure.",
      rating: 5,
    },
    {
      name: "Omar Hassan",
      role: "Community Member",
      content: "I love the community programs here. The book clubs and workshops have enriched my life tremendously.",
      rating: 5,
    },
    {
      name: "Miriam Gerlad",
      role: "Teacher",
      content: "As an educator, I appreciate the educational resources and the supportive environment for learning.",
      rating: 5,
    },
  ]

  const quickActions = [
    { icon: MdSearch, label: "Search Books", href: "/books", color: "primary" },
    { icon: MdMenuBook, label: "My Dashboard", href: "/dashboard", color: "accent", requiresAuth: true },
    { icon: MdLocationOn, label: "Find Branches", href: "#branches", color: "success" },
    { icon: MdEmojiEvents, label: "Events", href: "#events", color: "secondary" },
  ]

  return (
    <div className="min-h-screen bg-cream-300 pt-16 lg:pt-18">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-accent-500/5 to-success-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="flex justify-center mb-8">
                <motion.div
                  className="relative"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center shadow-large">
                    <MdLibraryBooks className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center shadow-medium">
                    <MdStar className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              </div>

              <h1 className="text-4xl lg:text-7xl font-bold text-secondary-800 leading-tight font-display">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                  KEY Library
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
                Knowledge Empowering Youth - Your gateway to infinite learning and discovery
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/books"
                    className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-large hover:shadow-glow-lg transition-all duration-300 group"
                  >
                    <MdSearch className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    <span>Explore Books</span>
                    <MdArrowForward className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </motion.div>

                {!user && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/login"
                      className="inline-flex items-center space-x-3 bg-white text-primary-600 px-8 py-4 rounded-2xl font-semibold text-lg shadow-medium hover:shadow-large transition-all duration-300 border-2 border-primary-100 hover:border-primary-200"
                    >
                      <FaUsers className="w-5 h-5" />
                      <span>Join Community</span>
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: MdLibraryBooks,
                label: "Books Available",
                value: stats.totalBooks.toLocaleString(),
                color: "primary",
              },
              {
                icon: FaUsers,
                label: "Community Members",
                value: stats.totalMembers.toLocaleString(),
                color: "accent",
              },
              { icon: FaBookOpen, label: "Active Loans", value: stats.activeLoans.toLocaleString(), color: "success" },
              { icon: MdLocationOn, label: "Branches", value: stats.branches, color: "secondary" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 lg:p-8 text-center shadow-medium hover:shadow-large transition-all duration-300 border border-white/50"
              >
                <div
                  className={`w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft`}
                >
                  <stat.icon className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-secondary-800 mb-2">{stat.value}</div>
                <div className="text-secondary-600 font-medium text-sm lg:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 lg:py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-800 mb-4 font-display">Quick Actions</h2>
            <p className="text-secondary-600 text-lg max-w-2xl mx-auto">
              Get started with our most popular features and services
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              if (action.requiresAuth && !user) return null
              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={action.href}
                    className={`block bg-gradient-to-br from-${action.color}-500 to-${action.color}-600 text-white p-6 rounded-3xl text-center shadow-medium hover:shadow-large transition-all duration-300 group`}
                  >
                    <action.icon className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                    <div className="font-semibold text-sm lg:text-base">{action.label}</div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-800 mb-4 font-display">
              Why Choose KEY Library?
            </h2>
            <p className="text-secondary-600 text-lg max-w-3xl mx-auto">
              We're more than just a library - we're your partner in learning and growth
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center shadow-medium hover:shadow-large transition-all duration-300 border border-white/50 group"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-3">{feature.title}</h3>
                <p className="text-secondary-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-800 mb-4 font-display">
              What Our Community Says
            </h2>
            <p className="text-secondary-600 text-lg max-w-2xl mx-auto">
              Hear from our valued members about their experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-medium hover:shadow-large transition-all duration-300 border border-white/50"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <MdStar key={i} className="w-5 h-5 text-accent-500" />
                  ))}
                </div>
                <p className="text-secondary-700 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-soft">
                    <span className="text-white font-semibold text-lg">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-secondary-800">{testimonial.name}</div>
                    <div className="text-secondary-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-4xl p-12 lg:p-16 text-white shadow-large relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8">
                <FaHeart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-display">Ready to Start Your Journey?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of learners who have discovered the joy of reading and learning with us
              </p>
              {!user ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="inline-flex items-center space-x-3 bg-white text-primary-600 px-8 py-4 rounded-2xl font-semibold text-lg shadow-large hover:shadow-warm transition-all duration-300"
                  >
                    <FaGraduationCap className="w-6 h-6" />
                    <span>Get Started Today</span>
                    <MdArrowForward className="w-5 h-5" />
                  </Link>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center space-x-3 bg-white text-primary-600 px-8 py-4 rounded-2xl font-semibold text-lg shadow-large hover:shadow-warm transition-all duration-300"
                  >
                    <MdMenuBook className="w-6 h-6" />
                    <span>Go to Dashboard</span>
                    <MdArrowForward className="w-5 h-5" />
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Homepage
