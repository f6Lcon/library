import api from "./api"

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post("/auth/login", { email, password })

      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        console.log("Login successful, token stored")
      }

      return response.data
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  },

  async register(userData) {
    try {
      const response = await api.post("/auth/register", userData)
      console.log("Registration response:", response.data)
      return response.data
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  },

  async getProfile() {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No token found")
      }

      console.log("Fetching profile with token")
      const response = await api.get("/auth/profile")
      console.log("Profile fetch successful")
      return response.data
    } catch (error) {
      console.error("Get profile error:", error)
      // Clear invalid token
      if (error.status === 401 || error.status === 404) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
      throw error
    }
  },

  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    console.log("Logout completed, redirecting to login")
    window.location.href = "/login"
  },
}

export default authService
