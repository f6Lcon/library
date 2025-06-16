import { dummyBooks, dummyCategories } from "../data/dummyBooks"

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

// Helper function to simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Helper function to filter books based on search criteria
const filterBooks = (books, { search, category }) => {
  return books.filter((book) => {
    const matchesSearch =
      !search ||
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.isbn.toLowerCase().includes(search.toLowerCase())

    const matchesCategory = !category || book.category === category

    return matchesSearch && matchesCategory
  })
}

// Helper function to paginate results
const paginateResults = (items, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedItems = items.slice(startIndex, endIndex)

  return {
    items: paginatedItems,
    totalPages: Math.ceil(items.length / limit),
    currentPage: Number.parseInt(page),
    total: items.length,
  }
}

export const bookService = {
  async getAllBooks(params = {}) {
    // Simulate API delay
    await delay(500)

    try {
      // Try to fetch from API first
      const queryString = new URLSearchParams(params).toString()
      const response = await fetch(`${API_BASE_URL}/books?${queryString}`, {
        headers: getPublicHeaders(),
      })

      if (response.ok) {
        return response.json()
      }
    } catch (error) {
      console.log("API not available, using dummy data")
    }

    // Fallback to dummy data
    const { search, category, page = 1, limit = 12 } = params
    const filteredBooks = filterBooks(dummyBooks, { search, category })
    const paginatedResult = paginateResults(filteredBooks, page, limit)

    return {
      books: paginatedResult.items,
      totalPages: paginatedResult.totalPages,
      currentPage: paginatedResult.currentPage,
      total: paginatedResult.total,
    }
  },

  async getBookById(id) {
    await delay(300)

    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        headers: getPublicHeaders(),
      })

      if (response.ok) {
        return response.json()
      }
    } catch (error) {
      console.log("API not available, using dummy data")
    }

    // Fallback to dummy data
    const book = dummyBooks.find((book) => book._id === id)
    if (!book) {
      throw new Error("Book not found")
    }

    return { book }
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
    await delay(200)

    try {
      const response = await fetch(`${API_BASE_URL}/books/categories`, {
        headers: getPublicHeaders(),
      })

      if (response.ok) {
        return response.json()
      }
    } catch (error) {
      console.log("API not available, using dummy data")
    }

    // Fallback to dummy data
    return { categories: dummyCategories }
  },
}
