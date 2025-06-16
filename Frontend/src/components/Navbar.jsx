"use client"

import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">KEY Library System</h1>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                Welcome, {user.firstName} {user.lastName}
              </span>
              <span className="bg-green-500 px-2 py-1 rounded-full text-xs font-semibold capitalize">{user.role}</span>
              <button
                onClick={handleLogout}
                className="bg-green-700 hover:bg-green-800 px-3 py-1 rounded text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
