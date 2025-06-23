"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authService } from "../services/authService"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem("token")
      const storedUser = localStorage.getItem("user")

      console.log("Initializing auth - Token exists:", !!token, "Stored user exists:", !!storedUser)

      if (token && storedUser) {
        try {
          // First set user from localStorage for immediate UI update
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          console.log("Set user from localStorage:", parsedUser.email)

          // Then verify token is still valid by fetching fresh profile
          const response = await authService.getProfile()
          console.log("Profile verification successful:", response.user.email)
          setUser(response.user)
          // Update stored user with fresh data
          localStorage.setItem("user", JSON.stringify(response.user))
        } catch (error) {
          console.error("Token validation failed:", error)
          // Only clear auth data if it's a real authentication error
          if (error.status === 401 || error.status === 404 || error.message?.includes("token")) {
            console.log("Clearing invalid auth data")
            clearAuthData()
          } else {
            console.log("Network error, keeping stored user data")
            // Keep the stored user for offline functionality
          }
        }
      } else {
        console.log("No token or stored user found")
      }
    } catch (error) {
      console.error("Auth initialization error:", error)
      // Only clear on authentication errors, not network errors
      if (error.status === 401 || error.status === 404) {
        clearAuthData()
      }
    } finally {
      setLoading(false)
    }
  }

  const clearAuthData = () => {
    console.log("Clearing authentication data")
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      console.log("Login successful:", response.user.email)
      setUser(response.user)
      return response
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      if (response.token) {
        localStorage.setItem("token", response.token)
        localStorage.setItem("user", JSON.stringify(response.user))
        setUser(response.user)
        console.log("Registration successful:", response.user.email)
      }
      return response
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    }
  }

  const logout = () => {
    console.log("Logging out user")
    clearAuthData()
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
