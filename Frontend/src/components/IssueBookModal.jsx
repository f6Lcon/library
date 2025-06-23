"use client"

import { useState, useEffect } from "react"
import { borrowService } from "../services/borrowService"
import { userService } from "../services/userService"

const IssueBookModal = ({ isOpen, onClose, book, onSuccess }) => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState([])

  useEffect(() => {
    if (isOpen) {
      fetchUsers()
    }
  }, [isOpen])

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.studentId && user.studentId.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchTerm, users])

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers()
      const eligibleUsers = response.users.filter((user) => user.role === "student" || user.role === "community")
      setUsers(eligibleUsers)
      setFilteredUsers(eligibleUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedUser) {
      alert("Please select a user")
      return
    }

    if (!book?._id) {
      alert("Invalid book selected")
      return
    }

    setLoading(true)

    try {
      console.log("=== ISSUE BOOK MODAL ===")
      console.log("Selected user:", selectedUser)
      console.log("Book ID:", book._id)

      // Ensure clean data
      const borrowData = {
        bookId: String(book._id).trim(),
        borrowerId: String(selectedUser).trim(),
      }

      console.log("Prepared borrow data:", borrowData)

      const result = await borrowService.borrowBook(borrowData)

      console.log("Borrow result:", result)

      if (result.success) {
        alert("Book issued successfully!")
        onSuccess?.()
        onClose()
        setSelectedUser("")
        setSearchTerm("")
      } else {
        alert(result.message || "Failed to issue book")
      }
    } catch (error) {
      console.error("Error issuing book:", error)
      alert(error.response?.data?.message || error.message || "Failed to issue book")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Issue Book</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl" type="button">
            ×
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-700">Book Details:</h3>
          <p className="text-sm text-gray-600">
            <strong>Title:</strong> {book?.title}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Author:</strong> {book?.author}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Available:</strong> {book?.availableCopies} copies
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search User</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or student ID..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select User</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose a user...</option>
              {filteredUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName}
                  {user.studentId && ` (${user.studentId})`} - {user.email}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedUser}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Issuing..." : "Issue Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default IssueBookModal
