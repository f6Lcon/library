import api from "./api"

export const borrowService = {
  async borrowBook(data) {
    try {
      console.log("Sending borrow request:", data)
      const response = await api.post("/borrow", data)
      console.log("Borrow response:", response.data)
      return response.data
    } catch (error) {
      console.error("Error in borrowBook:", error)
      throw error
    }
  },

  async returnBook(borrowId) {
    try {
      const response = await api.put(`/borrow/return/${borrowId}`)
      return response.data
    } catch (error) {
      console.error("Error in returnBook:", error)
      throw error
    }
  },

  async getBorrowHistory(userId, params = {}) {
    try {
      const response = await api.get(`/borrow/history/${userId}`, { params })
      return response.data
    } catch (error) {
      console.error("Error in getBorrowHistory:", error)
      throw error
    }
  },

  async getAllBorrows(params = {}) {
    try {
      const response = await api.get("/borrow", { params })
      return response.data
    } catch (error) {
      console.error("Error in getAllBorrows:", error)
      throw error
    }
  },

  async getOverdueBooks() {
    try {
      const response = await api.get("/borrow/overdue")
      return response.data
    } catch (error) {
      console.error("Error in getOverdueBooks:", error)
      throw error
    }
  },

  async getBorrowStats() {
    try {
      const response = await api.get("/borrow/stats")
      return response.data
    } catch (error) {
      console.error("Error in getBorrowStats:", error)
      throw error
    }
  },
}
