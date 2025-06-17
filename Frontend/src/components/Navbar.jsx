"use client"

import { useAuth } from "../context/AuthContext"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { useState } from "react"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [hoveredItem, setHoveredItem] = useState(null)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const isActive = (path) => location.pathname === path

  const NavIcon = ({ to, icon, label, isActive, onClick }) => (
    <div className="relative group">
      {onClick ? (
        <button
          onClick={onClick}
          onMouseEnter={() => setHoveredItem(label)}
          onMouseLeave={() => setHoveredItem(null)}
          className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg ${
            isActive ? "bg-white text-primary-600 shadow-md" : "text-primary-100 hover:bg-primary-400 hover:text-white"
          }`}
        >
          <span className="text-xl">{icon}</span>
        </button>
      ) : (
        <Link
          to={to}
          onMouseEnter={() => setHoveredItem(label)}
          onMouseLeave={() => setHoveredItem(null)}
          className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg ${
            isActive ? "bg-white text-primary-600 shadow-md" : "text-primary-100 hover:bg-primary-400 hover:text-white"
          }`}
        >
          <span className="text-xl">{icon}</span>
        </Link>
      )}

      {/* Hover Tooltip */}
      <div
        className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap transition-all duration-200 pointer-events-none ${
          hoveredItem === label ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
        }`}
      >
        {label}
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
      </div>
    </div>
  )

  return (
    <nav className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 shadow-xl border-b border-primary-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                <span className="text-primary-600 font-bold text-2xl">K</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-300 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xl font-bold text-white leading-tight">KEY Library</span>
              <span className="text-sm text-primary-200 leading-tight font-medium">Knowledge Empowering Youth</span>
            </div>
          </Link>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-2">
            <NavIcon to="/" icon="🏠" label="Home" isActive={isActive("/")} />

            <NavIcon to="/books" icon="📚" label="Browse Books" isActive={isActive("/books")} />

            {user && <NavIcon to="/dashboard" icon="📊" label="Dashboard" isActive={isActive("/dashboard")} />}

            {/* Show register link only for librarians and admins */}
            {user && (user.role === "librarian" || user.role === "admin") && (
              <NavIcon to="/register" icon="👥" label="Register Users" isActive={isActive("/register")} />
            )}

            {/* Divider */}
            <div className="w-px h-8 bg-primary-400 mx-2"></div>

            {/* User Section */}
            {user ? (
              <div className="flex items-center space-x-3">
                {/* User Info */}
                <div className="hidden md:flex items-center space-x-3 bg-primary-400 bg-opacity-30 rounded-xl px-4 py-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-xs text-primary-200 capitalize">{user.role}</span>
                  </div>
                </div>

                {/* Logout Button */}
                <NavIcon icon="🚪" label="Logout" onClick={handleLogout} />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <NavIcon to="/login" icon="🔑" label="Sign In" isActive={isActive("/login")} />

                <Link
                  to="/login"
                  className="bg-white text-primary-600 px-6 py-2 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Staff Login
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex justify-center space-x-4">
            <NavIcon to="/" icon="🏠" label="Home" isActive={isActive("/")} />

            <NavIcon to="/books" icon="📚" label="Books" isActive={isActive("/books")} />

            {user && <NavIcon to="/dashboard" icon="📊" label="Dashboard" isActive={isActive("/dashboard")} />}

            {user && (user.role === "librarian" || user.role === "admin") && (
              <NavIcon to="/register" icon="👥" label="Register" isActive={isActive("/register")} />
            )}

            {!user && <NavIcon to="/login" icon="🔑" label="Sign In" isActive={isActive("/login")} />}
          </div>

          {user && (
            <div className="mt-3 text-center">
              <div className="inline-flex items-center space-x-2 bg-primary-400 bg-opacity-30 rounded-lg px-3 py-1">
                <span className="text-sm text-white">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-xs text-primary-200 bg-primary-500 px-2 py-0.5 rounded-full capitalize">
                  {user.role}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
