import api from "./api"

// Get all users with filtering options
const getAllUsers = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams()

    // Add all parameters to query string
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== "") {
        queryParams.append(key, params[key])
      }
    })

    const queryString = queryParams.toString()
    const url = queryString ? `/api/users?${queryString}` : "/api/users"

    const response = await api.get(url)
    return response.data
  } catch (error) {
    console.error("Get users error:", error)
    throw error.response?.data || { message: "Failed to fetch users" }
  }
}

// Get active users count for homepage
const getActiveUsersCount = async () => {
  try {
    const response = await api.get("/api/users?activeOnly=true&limit=1000")
    return response.data
  } catch (error) {
    console.error("Get active users count error:", error)
    throw error.response?.data || { message: "Failed to fetch active users count" }
  }
}

export const userService = {
  getAllUsers,
  getActiveUsersCount,
  // ... other existing methods
}
