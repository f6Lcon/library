const API_BASE_URL = "http://localhost:5000/api"

const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

const getPublicHeaders = () => {
  return {
    "Content-Type": "application/json",
  }
}

export const bookService = {
  async getAllBooks(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    // Use public headers for book browsing - no auth required
    const response = await fetch(`${API_BASE_URL}/books?${queryString}`, {
      headers: getPublicHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch books")
    }

    return response.json()
  },

  async getBookById(id) {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      headers: getPublicHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch book")
    }

    return response.json()
  },

  async addBook(bookData) {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(bookData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to add book")
    }

    return response.json()
  },

  async updateBook(id, bookData) {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(bookData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to update book")
    }

    return response.json()
  },

  async deleteBook(id) {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to delete book")
    }

    return response.json()
  },

  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/books/categories`, {
      headers: getPublicHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch categories")
    }

    return response.json()
  },
}
