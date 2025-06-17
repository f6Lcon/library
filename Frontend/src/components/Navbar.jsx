"use client"

import { useAuth } from "../context/AuthContext"
import { useNavigate, Link, useLocation } from "react-router-dom"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-primary-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 hover:text-primary-200 transition-colors">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-primary-500 font-bold text-lg">K</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight">KEY Library</span>
                <span className="text-xs text-primary-200 leading-tight">Knowledge Empowering Youth</span>
              </div>
            </Link>

            {/* Public Navigation */}
            <div className="hidden md:flex space-x-6">
              <Link
                to="/"
                className={`hover:text-primary-200 transition-colors ${
                  isActive("/") ? "text-primary-200 font-medium" : ""
                }`}
              >
                Home
              </Link>
              <Link
                to="/books"
                className={`hover:text-primary-200 transition-colors ${
                  isActive("/books") ? "text-primary-200 font-medium" : ""
                }`}
              >
                Browse Books
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  className={`hover:text-primary-200 transition-colors ${
                    isActive("/dashboard") ? "text-primary-200 font-medium" : ""
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-3">
                  <span className="text-sm">
                    Welcome, {user.firstName} {user.lastName}
                  </span>
                  <span className="bg-primary-400 px-2 py-1 rounded-full text-xs font-semibold capitalize">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-primary-600 hover:bg-primary-700 px-3 py-1 rounded text-sm transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-white hover:text-primary-200 transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-400 hover:bg-primary-300 px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3">
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`text-sm hover:text-primary-200 transition-colors ${
                isActive("/") ? "text-primary-200 font-medium" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/books"
              className={`text-sm hover:text-primary-200 transition-colors ${
                isActive("/books") ? "text-primary-200 font-medium" : ""
              }`}
            >
              Books
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className={`text-sm hover:text-primary-200 transition-colors ${
                  isActive("/dashboard") ? "text-primary-200 font-medium" : ""
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>
          {user && (
            <div className="mt-2 text-xs text-primary-200">
              {user.firstName} {user.lastName} ({user.role})
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
