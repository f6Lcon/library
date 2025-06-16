const API_BASE_URL = "http://localhost:5000/api"

const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export const borrowService = {
  async borrowBook(bookId, borrowerId) {
    const response = await fetch(`${API_BASE_URL}/borrow`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ bookId, borrowerId }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to borrow book")
    }

    return response.json()
  },

  async returnBook(borrowId) {
    const response = await fetch(`${API_BASE_URL}/borrow/return/${borrowId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to return book")
    }

    return response.json()
  },

  async getBorrowHistory(userId, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const response = await fetch(`${API_BASE_URL}/borrow/history/${userId}?${queryString}`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch borrow history")
    }

    return response.json()
  },

  async getAllBorrows(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const response = await fetch(`${API_BASE_URL}/borrow?${queryString}`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch borrows")
    }

    return response.json()
  },

  async getOverdueBooks() {
    const response = await fetch(`${API_BASE_URL}/borrow/overdue`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch overdue books")
    }

    return response.json()
  },
}
