import api from "./api"

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post("/auth/login", { email, password })

      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
      }

      return response.data
    } catch (error) {
      console.error("Login error:", error)
      throw error.response?.data || { message: "Login failed" }
    }
  },

  async register(userData) {
    try {
      const response = await api.post("/auth/register", userData)
      return response.data
    } catch (error) {
      console.error("Registration error:", error)
      throw error.response?.data || { message: "Registration failed" }
    }
  },

  async getProfile() {
    try {
      const response = await api.get("/auth/profile")
      return response.data
    } catch (error) {
      console.error("Get profile error:", error)
      throw error.response?.data || { message: "Failed to fetch profile" }
    }
  },

  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  },
}

export default authService
