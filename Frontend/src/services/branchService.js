const API_BASE_URL = "http://localhost:5000/api"

const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export const branchService = {
  async getAllBranches() {
    const response = await fetch(`${API_BASE_URL}/branches`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch branches")
    }

    return response.json()
  },

  async getBranchById(id) {
    const response = await fetch(`${API_BASE_URL}/branches/${id}`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch branch")
    }

    return response.json()
  },

  async createBranch(branchData) {
    const response = await fetch(`${API_BASE_URL}/branches`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(branchData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create branch")
    }

    return response.json()
  },

  async updateBranch(id, branchData) {
    const response = await fetch(`${API_BASE_URL}/branches/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(branchData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to update branch")
    }

    return response.json()
  },

  async deleteBranch(id) {
    const response = await fetch(`${API_BASE_URL}/branches/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to delete branch")
    }

    return response.json()
  },
}
