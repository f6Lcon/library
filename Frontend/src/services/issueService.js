import api from "./api"

export const issueService = {
  // Issue a book to a user
  issueBook: async (bookId, userId, dueDate) => {
    try {
      const response = await api.post("/borrow", {
        bookId,
        borrowerId: userId,
        dueDate,
      })
      return response.data
    } catch (error) {
      console.error("Issue book error:", error)
      throw error.response?.data || { message: "Failed to issue book" }
    }
  },

  // Return a book
  returnBook: async (borrowId) => {
    try {
      const response = await api.put(`/borrow/return/${borrowId}`)
      return response.data
    } catch (error) {
      console.error("Return book error:", error)
      throw error.response?.data || { message: "Failed to return book" }
    }
  },

  // Get all active borrows
  getActiveBorrows: async (params = {}) => {
    try {
      const response = await api.get("/borrow", { params })
      return response.data
    } catch (error) {
      console.error("Get active borrows error:", error)
      throw error.response?.data || { message: "Failed to fetch active borrows" }
    }
  },

  // Get overdue books
  getOverdueBooks: async () => {
    try {
      const response = await api.get("/borrow/overdue")
      return response.data
    } catch (error) {
      console.error("Get overdue books error:", error)
      throw error.response?.data || { message: "Failed to fetch overdue books" }
    }
  },

  // Get borrow history for a user
  getBorrowHistory: async (userId, params = {}) => {
    try {
      const response = await api.get(`/borrow/history/${userId}`, { params })
      return response.data
    } catch (error) {
      console.error("Get borrow history error:", error)
      throw error.response?.data || { message: "Failed to fetch borrow history" }
    }
  },

  // Get borrow statistics
  getBorrowStats: async () => {
    try {
      const response = await api.get("/borrow/stats")
      return response.data
    } catch (error) {
      console.error("Get borrow stats error:", error)
      throw error.response?.data || { message: "Failed to fetch borrow statistics" }
    }
  },
}

export default issueService
