"use client"

import { useState, useEffect } from "react"
import { bookService } from "../services/bookService"
import { userService } from "../services/userService"
import { borrowService } from "../services/borrowService"

const BorrowForm = ({ onClose, onSuccess }) => {
  const [books, setBooks] = useState([])
  const [users, setUsers] = useState([])
  const [selectedBook, setSelectedBook] = useState("")
  const [selectedUser, setSelectedUser] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [booksRes, usersRes] = await Promise.all([
        bookService.getAllBooks(),
        userService.getAllUsers({ role: "student,community" }),
      ])

      // Only show available books
      setBooks(booksRes.books.filter((book) => book.availableCopies > 0))
      setUsers(usersRes.users.filter((user) => user.isActive))
    } catch (err) {
      setError("Failed to load data")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("=== BORROW FORM SUBMIT ===")
      console.log("Selected book:", selectedBook)
      console.log("Selected user:", selectedUser)

      // Prepare data with correct field names
      const borrowData = {
        bookId: selectedBook,
        borrowerId: selectedUser,
      }

      console.log("Sending borrow data:", borrowData)

      const result = await borrowService.borrowBook(borrowData)
      console.log("Borrow result:", result)

      if (result.success) {
        onSuccess()
        onClose()
      } else {
        setError(result.message || "Failed to issue book")
      }
    } catch (err) {
      console.error("Borrow form error:", err)
      setError(err.response?.data?.message || err.message || "Failed to issue book")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Issue Book</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Book *</label>
            <select
              value={selectedBook}
              onChange={(e) => {
                console.log("Book selected:", e.target.value)
                setSelectedBook(e.target.value)
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Choose a book</option>
              {books.map((book) => (
                <option key={book._id} value={book._id}>
                  {book.title} by {book.author} ({book.availableCopies} available)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select User *</label>
            <select
              value={selectedUser}
              onChange={(e) => {
                console.log("User selected:", e.target.value)
                setSelectedUser(e.target.value)
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Choose a user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName} ({user.role}) - {user.email}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <p>
              <strong>Note:</strong> Books are issued for 14 days. Late returns incur a fine of $1 per day.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedBook || !selectedUser}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Issuing..." : "Issue Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BorrowForm
