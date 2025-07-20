import api from "./api"
import { dummyBooks, dummyCategories } from "../data/dummyBooks"

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
    console.log("bookService.getAllBooks called with params:", params)

    try {
      console.log("Making API request to /books with params:", params)
      const response = await api.get("/books", { params })
      console.log("API response received:", response)
      console.log("Response data:", response.data)

      // Check if response has the expected structure
      if (response.data && response.data.success) {
        console.log("API response successful, returning data")
        return {
          books: response.data.books || [],
          totalPages: response.data.totalPages || 1,
          currentPage: response.data.currentPage || 1,
          total: response.data.total || 0,
          categories: response.data.categories || [],
        }
      }

      // If API response doesn't have expected structure, throw error to use fallback
      console.warn("API response doesn't have expected structure, using fallback")
      throw new Error("Invalid API response structure")
    } catch (error) {
      console.log("API error occurred:", error.message)
      console.log("Full error:", error)

      // Check if it's a network error or server error
      if (error.response) {
        console.log("Server responded with error:", error.response.status, error.response.data)
      } else if (error.request) {
        console.log("No response received from server")
      } else {
        console.log("Error setting up request:", error.message)
      }

      console.log("Using dummy data as fallback")

      // Fallback to dummy data
      await delay(500)
      const { search, category, page = 1, limit = 12 } = params
      const filteredBooks = filterBooks(dummyBooks, { search, category })
      const paginatedResult = paginateResults(filteredBooks, page, limit)

      return {
        books: paginatedResult.items,
        totalPages: paginatedResult.totalPages,
        currentPage: paginatedResult.currentPage,
        total: paginatedResult.total,
        categories: dummyCategories,
      }
    }
  },

  async getBookById(id) {
    console.log("bookService.getBookById called with id:", id)

    try {
      const response = await api.get(`/books/${id}`)
      console.log("Book details API response:", response.data)

      if (response.data && response.data.success) {
        return { book: response.data.book }
      }

      throw new Error("Invalid API response structure")
    } catch (error) {
      console.log("API not available for book details, using dummy data")

      // Fallback to dummy data
      await delay(300)
      const book = dummyBooks.find((book) => book._id === id)
      if (!book) {
        throw new Error("Book not found")
      }
      return { book }
    }
  },

  async addBook(bookData) {
    try {
      const response = await api.post("/books", bookData)
      return response.data
    } catch (error) {
      console.error("Add book error:", error)
      throw error.response?.data || { message: "Failed to add book" }
    }
  },

  async updateBook(id, bookData) {
    try {
      const response = await api.put(`/books/${id}`, bookData)
      return response.data
    } catch (error) {
      console.error("Update book error:", error)
      throw error.response?.data || { message: "Failed to update book" }
    }
  },

  async deleteBook(id) {
    try {
      const response = await api.delete(`/books/${id}`)
      return response.data
    } catch (error) {
      console.error("Delete book error:", error)
      throw error.response?.data || { message: "Failed to delete book" }
    }
  },

  async getCategories() {
    console.log("bookService.getCategories called")

    try {
      const response = await api.get("/books/categories")
      console.log("Categories API response:", response.data)

      if (response.data && response.data.success) {
        return { categories: response.data.categories || [] }
      }

      throw new Error("Invalid API response structure")
    } catch (error) {
      console.log("API not available for categories, using dummy data")

      // Fallback to dummy data
      await delay(200)
      return { categories: dummyCategories }
    }
  },

  async getBookStats() {
    try {
      const response = await api.get("/books/stats")
      return response.data
    } catch (error) {
      console.error("Get book stats error:", error)
      throw error.response?.data || { message: "Failed to fetch book statistics" }
    }
  },
}

export default bookService
