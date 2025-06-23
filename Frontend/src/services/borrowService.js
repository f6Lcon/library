import api from "./api"

export const borrowService = {
  async borrowBook(data) {
    try {
      console.log("=== FRONTEND BORROW REQUEST ===")
      console.log("Original data:", data)

      // Validate required fields
      if (!data.bookId || !data.borrowerId) {
        throw new Error("Book ID and Borrower ID are required")
      }

      // Ensure data is properly formatted
      const requestData = {
        bookId: String(data.bookId).trim(),
        borrowerId: String(data.borrowerId).trim(),
      }

      console.log("Formatted request data:", requestData)
      console.log("Request data as JSON:", JSON.stringify(requestData))

      const response = await api.post("/borrow", requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Borrow response:", response.data)
      return response.data
    } catch (error) {
      console.error("=== FRONTEND BORROW ERROR ===")
      console.error("Error details:", error)
      console.error("Response data:", error.response?.data)
      console.error("Response status:", error.response?.status)
      console.error("Response headers:", error.response?.headers)

      // Extract error message from response
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }

      // If the response is HTML instead of JSON, it means there's a server error
      if (
        error.response?.data &&
        typeof error.response.data === "string" &&
        error.response.data.includes("<!DOCTYPE")
      ) {
        throw new Error("Server returned HTML instead of JSON. Check server logs for details.")
      }

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
