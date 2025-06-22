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
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
            isActive(to)
              ? "bg-white/20 text-white shadow-md backdrop-blur-sm"
              : "text-white/80 hover:text-white hover:bg-white/10"
          } ${className}`}
        >
          <Icon className="w-4 h-4" />
          <span className="font-medium">{label}</span>
        </button>
      ) : (
        <Link
          to={to}
          onClick={() => setIsMenuOpen(false)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
            isActive(to)
              ? "bg-white/20 text-white shadow-md backdrop-blur-sm"
              : "text-white/80 hover:text-white hover:bg-white/10"
          } ${className}`}
        >
          <Icon className="w-4 h-4" />
          <span className="font-medium">{label}</span>
        </Link>
      )}
    </motion.div>
  )

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-r from-teal-600/95 via-teal-500/95 to-teal-700/95 backdrop-blur-lg shadow-xl"
          : "bg-gradient-to-r from-teal-600 via-teal-500 to-teal-700"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 lg:h-16">
          {/* Logo Section */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="relative">
                <motion.div
                  className="w-8 h-8 lg:w-9 lg:h-9 bg-white rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 overflow-hidden"
                  whileHover={{ rotate: 3 }}
                >
                  <img
                    src="/key-logo.ico"
                    alt="KEY Libraries"
                    className="w-6 h-6 lg:w-7 lg:h-7 object-contain"
                    onError={(e) => {
                      e.target.style.display = "none"
                      e.target.nextSibling.style.display = "flex"
                    }}
                  />
                  <div
                    className="w-full h-full bg-teal-500 text-white font-bold text-sm lg:text-base items-center justify-center hidden"
                    style={{ display: "none" }}
                  >
                    KEY
                  </div>
                </motion.div>
                <motion.div
                  className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-orange-400 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </motion.div>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-lg lg:text-xl font-bold text-white leading-tight font-display">KEY Library</span>
                <span className="text-xs text-white/80 leading-tight font-medium">Knowledge Empowering Youth</span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1.5">
            <NavLink to="/" icon={MdHome} label="Home" />
            <NavLink to="/books" icon={MdLibraryBooks} label="Books" />
            {user && <NavLink to="/dashboard" icon={MdDashboard} label="Dashboard" />}

            {/* Divider */}
            <div className="w-px h-6 bg-white/20 mx-3"></div>

            {/* User Section */}
            {user ? (
              <div className="flex items-center space-x-2">
                {/* User Info */}
                <motion.div
                  className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-white to-teal-100 rounded-full flex items-center justify-center">
                    <MdPerson className="w-3.5 h-3.5 text-teal-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-xs text-white/70 capitalize font-medium">{user.role}</span>
                  </div>
                </motion.div>

                {/* Logout Button */}
                <NavLink icon={MdLogout} label="Logout" onClick={handleLogout} />
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <NavLink to="/login" icon={MdLogin} label="Sign In" />
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/register"
                    className="bg-white text-teal-600 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-teal-50 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-1.5"
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
            className="lg:hidden p-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300"
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
                  <MdClose className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MdMenu className="w-5 h-5" />
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
              <div className="py-3 space-y-1 border-t border-white/20">
                <NavLink to="/" icon={MdHome} label="Home" />
                <NavLink to="/books" icon={MdLibraryBooks} label="Books" />
                {user && <NavLink to="/dashboard" icon={MdDashboard} label="Dashboard" />}

                {user ? (
                  <>
                    <div className="px-3 py-2 bg-white/10 rounded-lg mx-2 my-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-white to-teal-100 rounded-full flex items-center justify-center">
                          <MdPerson className="w-4 h-4 text-teal-600" />
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
