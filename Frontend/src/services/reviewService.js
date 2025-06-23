import api from "./api"

export const reviewService = {
  async createReview(data) {
    try {
      const response = await api.post("/review", data)
      return response.data
    } catch (error) {
      console.error("Error creating review:", error)
      throw error
    }
  },

  async getBookReviews(bookId, params = {}) {
    try {
      const response = await api.get(`/review/book/${bookId}`, { params })
      return response.data
    } catch (error) {
      console.error("Error fetching book reviews:", error)
      throw error
    }
  },

  async getPendingReviews() {
    try {
      const response = await api.get("/review/pending")
      return response.data
    } catch (error) {
      console.error("Error fetching pending reviews:", error)
      throw error
    }
  },

  async approveReview(reviewId, approved) {
    try {
      const response = await api.put(`/review/approve/${reviewId}`, { approved })
      return response.data
    } catch (error) {
      console.error("Error approving review:", error)
      throw error
    }
  },

  async getUserEligibleBooks() {
    try {
      const response = await api.get("/review/eligible")
      return response.data
    } catch (error) {
      console.error("Error fetching eligible books:", error)
      throw error
    }
  },
}
