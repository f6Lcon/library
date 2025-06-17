const API_BASE_URL = "http://localhost:5000/api"

const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export const authService = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  },

  async register(userData) {
    try {
      console.log("Registering user with data:", userData)

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      })

      const data = await response.json()
      console.log("Registration response:", data)

      if (!response.ok) {
        throw new Error(data.message || data.errors?.join(", ") || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  },

  async getProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error("Get profile error:", error)
      throw error
    }
  },
}
