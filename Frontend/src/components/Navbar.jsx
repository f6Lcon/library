"use client"

import { useAuth } from "../context/AuthContext"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MdHome,
  MdLibraryBooks,
  MdDashboard,
  MdLogin,
  MdPersonAdd,
  MdLogout,
  MdMenu,
  MdClose,
  MdPerson,
  MdNotifications,
} from "react-icons/md"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const NavLink = ({ to, icon: Icon, label, onClick, className = "" }) => (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      {onClick ? (
        <button
          onClick={onClick}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
            isActive(to)
              ? "bg-white/20 text-white shadow-soft backdrop-blur-sm"
              : "text-white/80 hover:text-white hover:bg-white/10"
          } ${className}`}
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </button>
      ) : (
        <Link
          to={to}
          onClick={() => setIsMenuOpen(false)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
            isActive(to)
              ? "bg-white/20 text-white shadow-soft backdrop-blur-sm"
              : "text-white/80 hover:text-white hover:bg-white/10"
          } ${className}`}
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </Link>
      )}
    </motion.div>
  )

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-primary-500/95 backdrop-blur-lg shadow-large" : "bg-primary-500"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Logo Section */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <motion.div
                  className="w-10 h-10 lg:w-11 lg:h-11 bg-white rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-large transition-all duration-300 overflow-hidden"
                  whileHover={{ rotate: 3 }}
                >
                  <img
                    src="/key-logo.ico"
                    alt="KEY Libraries"
                    className="w-7 h-7 lg:w-8 lg:h-8 object-contain"
                    onError={(e) => {
                      e.target.style.display = "none"
                      e.target.nextSibling.style.display = "flex"
                    }}
                  />
                  <div
                    className="w-full h-full bg-primary-500 text-white font-bold text-lg lg:text-xl items-center justify-center hidden"
                    style={{ display: "none" }}
                  >
                    KEY
                  </div>
                </motion.div>
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full flex items-center justify-center shadow-soft"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </motion.div>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xl lg:text-2xl font-bold text-white leading-tight font-display">KEY Library</span>
                <span className="text-xs text-white/80 leading-tight font-medium">Knowledge Empowering Youth</span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            <NavLink to="/" icon={MdHome} label="Home" />
            <NavLink to="/books" icon={MdLibraryBooks} label="Books" />
            {user && <NavLink to="/dashboard" icon={MdDashboard} label="Dashboard" />}

            {/* Divider */}
            <div className="w-px h-8 bg-white/20 mx-4"></div>

            {/* User Section */}
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                >
                  <MdNotifications className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full"></span>
                </motion.button>

                {/* User Info */}
                <motion.div
                  className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-white to-cream-100 rounded-xl flex items-center justify-center shadow-soft">
                    <MdPerson className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-xs text-white/70 capitalize font-medium">{user.role}</span>
                  </div>
                </motion.div>

                {/* Logout Button */}
                <NavLink icon={MdLogout} label="Logout" onClick={handleLogout} />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <NavLink to="/login" icon={MdLogin} label="Sign In" />
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/register"
                    className="bg-white text-primary-600 px-6 py-2 rounded-2xl text-sm font-semibold hover:bg-cream-50 transition-all duration-300 shadow-soft hover:shadow-medium flex items-center space-x-2"
                  >
                    <MdPersonAdd className="w-4 h-4" />
                    <span>Join</span>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300"
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MdClose className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MdMenu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2 border-t border-white/20">
                <NavLink to="/" icon={MdHome} label="Home" />
                <NavLink to="/books" icon={MdLibraryBooks} label="Books" />
                {user && <NavLink to="/dashboard" icon={MdDashboard} label="Dashboard" />}

                {user ? (
                  <>
                    <div className="px-4 py-3 bg-white/10 rounded-2xl mx-2 my-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-white to-cream-100 rounded-xl flex items-center justify-center shadow-soft">
                          <MdPerson className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <div className="text-white text-sm font-semibold">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-white/70 text-xs capitalize">{user.role}</div>
                        </div>
                      </div>
                    </div>
                    <NavLink icon={MdLogout} label="Logout" onClick={handleLogout} />
                  </>
                ) : (
                  <>
                    <NavLink to="/login" icon={MdLogin} label="Sign In" />
                    <NavLink to="/register" icon={MdPersonAdd} label="Join" />
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar
