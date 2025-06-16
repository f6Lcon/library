const API_BASE_URL = "http://localhost:5000/api"

const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export const userService = {
  async getAllUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const response = await fetch(`${API_BASE_URL}/users?${queryString}`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch users")
    }

    return response.json()
  },

  async updateUserRole(userId, role) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to update user role")
    }

    return response.json()
  },

  async toggleUserStatus(userId) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/toggle-status`, {
      method: "PUT",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to toggle user status")
    }

    return response.json()
  },
}
