import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

console.log("API Base URL:", API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url)
    console.log("Request config:", {
      url: config.url,
      method: config.method,
      params: config.params,
      data: config.data,
    })

    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log("Added auth token to request")
    }
    return config
  },
  (error) => {
    console.error("Request interceptor error:", error)
    return Promise.reject(error)
  },
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`Response received from ${response.config.url}:`, response.status)
    console.log("Response data:", response.data)
    return response
  },
  (error) => {
    console.error("API Error:", error)

    if (error.response) {
      console.error("Error response:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      })
    } else if (error.request) {
      console.error("No response received:", error.request)
    } else {
      console.error("Error setting up request:", error.message)
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      console.log("Authentication error, removing token")
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      // Don't redirect here, let the component handle it
    }

    return Promise.reject(error)
  },
)

export default api
