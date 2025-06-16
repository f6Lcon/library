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
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold hover:text-green-200 transition-colors">
              KEY Library
            </Link>

            {/* Public Navigation */}
            <div className="hidden md:flex space-x-6">
              <Link
                to="/"
                className={`hover:text-green-200 transition-colors ${
                  isActive("/") ? "text-green-200 font-medium" : ""
                }`}
              >
                Home
              </Link>
              <Link
                to="/books"
                className={`hover:text-green-200 transition-colors ${
                  isActive("/books") ? "text-green-200 font-medium" : ""
                }`}
              >
                Browse Books
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  className={`hover:text-green-200 transition-colors ${
                    isActive("/dashboard") ? "text-green-200 font-medium" : ""
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
                  <span className="bg-green-500 px-2 py-1 rounded-full text-xs font-semibold capitalize">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-green-700 hover:bg-green-800 px-3 py-1 rounded text-sm transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-white hover:text-green-200 transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-green-500 hover:bg-green-400 px-4 py-2 rounded text-sm font-medium transition-colors"
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
              className={`text-sm hover:text-green-200 transition-colors ${
                isActive("/") ? "text-green-200 font-medium" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/books"
              className={`text-sm hover:text-green-200 transition-colors ${
                isActive("/books") ? "text-green-200 font-medium" : ""
              }`}
            >
              Books
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className={`text-sm hover:text-green-200 transition-colors ${
                  isActive("/dashboard") ? "text-green-200 font-medium" : ""
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>
          {user && (
            <div className="mt-2 text-xs text-green-200">
              {user.firstName} {user.lastName} ({user.role})
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
