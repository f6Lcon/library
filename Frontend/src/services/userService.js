import api from "./api"

export const userService = {
  // Get all users with filtering options
  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get("/users", { params })
      return response.data
    } catch (error) {
      console.error("Get users error:", error)
      throw error.response?.data || { message: "Failed to fetch users" }
    }
  },

  // Get active users count for statistics
  getActiveUsersCount: async () => {
    try {
      const response = await api.get("/users/stats/active-count")
      return response.data
    } catch (error) {
      console.error("Get active users count error:", error)
      throw error.response?.data || { message: "Failed to fetch active users count" }
    }
  },

  // Update user role (admin only)
  updateUserRole: async (userId, role) => {
    try {
      const response = await api.put(`/users/${userId}/role`, { role })
      return response.data
    } catch (error) {
      console.error("Update user role error:", error)
      throw error.response?.data || { message: "Failed to update user role" }
    }
  },

  // Toggle user active status (admin only)
  toggleUserStatus: async (userId) => {
    try {
      const response = await api.put(`/users/${userId}/toggle-status`)
      return response.data
    } catch (error) {
      console.error("Toggle user status error:", error)
      throw error.response?.data || { message: "Failed to toggle user status" }
    }
  },

  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await api.get("/auth/profile")
      return response.data
    } catch (error) {
      console.error("Get user profile error:", error)
      throw error.response?.data || { message: "Failed to fetch user profile" }
    }
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    try {
      const response = await api.put("/auth/profile", profileData)
      return response.data
    } catch (error) {
      console.error("Update user profile error:", error)
      throw error.response?.data || { message: "Failed to update user profile" }
    }
  },
}

export default userService
