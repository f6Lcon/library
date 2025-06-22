import api from "./api"

export const branchService = {
  async getAllBranches() {
    try {
      const response = await api.get("/branches")
      return response.data
    } catch (error) {
      console.error("Get branches error:", error)
      throw error.response?.data || { message: "Failed to fetch branches" }
    }
  },

  async getBranchById(id) {
    try {
      const response = await api.get(`/branches/${id}`)
      return response.data
    } catch (error) {
      console.error("Get branch error:", error)
      throw error.response?.data || { message: "Failed to fetch branch" }
    }
  },

  async createBranch(branchData) {
    try {
      const response = await api.post("/branches", branchData)
      return response.data
    } catch (error) {
      console.error("Create branch error:", error)
      throw error.response?.data || { message: "Failed to create branch" }
    }
  },

  async updateBranch(id, branchData) {
    try {
      const response = await api.put(`/branches/${id}`, branchData)
      return response.data
    } catch (error) {
      console.error("Update branch error:", error)
      throw error.response?.data || { message: "Failed to update branch" }
    }
  },

  async deleteBranch(id) {
    try {
      const response = await api.delete(`/branches/${id}`)
      return response.data
    } catch (error) {
      console.error("Delete branch error:", error)
      throw error.response?.data || { message: "Failed to delete branch" }
    }
  },
}

export default branchService
