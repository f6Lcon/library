const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token")
}

// Create axios-like request function with proper headers
const apiRequest = async (url, options = {}) => {
  const token = getAuthToken()
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const config = {
    method: options.method || "GET",
    headers,
    ...options,
  }

  if (options.body) {
    config.body = JSON.stringify(options.body)
  }

  const response = await fetch(`${API_URL}${url}`, config)
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Network error" }))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export const authService = {
  async register(userData) {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: userData,
    })
    return response
  },

  async login(email, password) {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
    })
    return response
  },

  async getProfile() {
    const response = await apiRequest("/auth/profile")
    return response
  },

  async logout() {
    localStorage.removeItem("token")
  },
}