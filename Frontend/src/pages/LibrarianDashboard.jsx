"use client"

import { useState, useEffect } from "react"
import { bookService } from "../services/bookService"
import { borrowService } from "../services/borrowService"
import { userService } from "../services/userService"
import BookForm from "../components/BookForm"
import BorrowForm from "../components/BorrowForm"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import LoadingSpinner from "../components/LoadingSpinner"
import BookCard from "../components/BookCard"

const LibrarianDashboard = () => {
  const { user } = useAuth()
  const [books, setBooks] = useState([])
  const [borrows, setBorrows] = useState([])
  const [overdueBooks, setOverdueBooks] = useState([])
  const [branchUsers, setBranchUsers] = useState([])
  const [activeTab, setActiveTab] = useState("books")
  const [showBookForm, setShowBookForm] = useState(false)
  const [showBorrowForm, setShowBorrowForm] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    overdueBooks: 0,
    totalUsers: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError("")

      // Fetch data with fallback handling
      const results = await Promise.allSettled([
        bookService.getAllBooks(),
        borrowService.getAllBorrows({ status: "borrowed" }).catch(() => ({ borrows: [] })),
        borrowService.getOverdueBooks().catch(() => ({ overdueBooks: [] })),
        userService.getAllUsers({ role: "student,community" }).catch(() => ({ users: [] })),
      ])

      // Handle books data
      if (results[0].status === "fulfilled") {
        const booksData = results[0].value.books || []
        setBooks(booksData)
        setStats((prev) => ({
          ...prev,
          totalBooks: booksData.length,
          availableBooks: booksData.filter((book) => book.availableCopies > 0).length,
        }))
      } else {
        console.warn("Failed to fetch books:", results[0].reason)
        setBooks([])
      }

      // Handle borrows data
      if (results[1].status === "fulfilled") {
        const borrowsData = results[1].value.borrows || []
        setBorrows(borrowsData)
        setStats((prev) => ({
          ...prev,
          borrowedBooks: borrowsData.length,
        }))
      } else {
        console.warn("Failed to fetch borrows:", results[1].reason)
        setBorrows([])
      }

      // Handle overdue books data
      if (results[2].status === "fulfilled") {
        const overdueData = results[2].value.overdueBooks || []
        setOverdueBooks(overdueData)
        setStats((prev) => ({
          ...prev,
          overdueBooks: overdueData.length,
        }))
      } else {
        console.warn("Failed to fetch overdue books:", results[2].reason)
        setOverdueBooks([])
      }

      // Handle users data
      if (results[3].status === "fulfilled") {
        const usersData = results[3].value.users || []
        setBranchUsers(usersData)
        setStats((prev) => ({
          ...prev,
          totalUsers: usersData.length,
        }))
      } else {
        console.warn("Failed to fetch users:", results[3].reason)
        setBranchUsers([])
      }
    } catch (err) {
      console.error("Dashboard error:", err)
      setError("Some data could not be loaded. Please refresh the page.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBook = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await bookService.deleteBook(bookId)
        await fetchData()
      } catch (err) {
        console.error("Delete error:", err)
        setError("Failed to delete book. Please try again.")
      }
    }
  }

  const handleReturnBook = async (borrowId) => {
    try {
      await borrowService.returnBook(borrowId)
      await fetchData()
    } catch (err) {
      console.error("Return error:", err)
      setError("Failed to return book. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Librarian Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.firstName || "Librarian"}!</p>
          </div>
          <Link
            to="/register"
            className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Register New User</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-blue-600 text-xl">📚</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">{stats.availableBooks}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-green-600 text-xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Borrowed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.borrowedBooks}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-yellow-600 text-xl">📖</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overdueBooks}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-purple-600 text-xl">👥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center space-x-2">
            <span>⚠️</span>
            <span>{error}</span>
            <button onClick={() => setError("")} className="ml-auto text-red-500 hover:text-red-700">
              ✕
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: "books", label: "Books", count: books.length },
                { key: "borrows", label: "Active Borrows", count: borrows.length },
                { key: "overdue", label: "Overdue", count: overdueBooks.length },
                { key: "users", label: "Users", count: branchUsers.length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.key
                      ? "border-teal-500 text-teal-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        activeTab === tab.key ? "bg-teal-100 text-teal-800" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Books Tab */}
            {activeTab === "books" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Books Management</h2>
                  <button
                    onClick={() => setShowBookForm(true)}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span>➕</span>
                    <span>Add New Book</span>
                  </button>
                </div>

                {books.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
                    <p className="text-gray-600 mb-4">Start by adding your first book to the library.</p>
                    <button
                      onClick={() => setShowBookForm(true)}
                      className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200"
                    >
                      Add First Book
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {books.map((book, index) => (
                      <BookCard
                        key={book._id}
                        book={book}
                        index={index}
                        showActions={true}
                        onEdit={(book) => {
                          setEditingBook(book)
                          setShowBookForm(true)
                        }}
                        onDelete={handleDeleteBook}
                        variant="grid"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Borrows Tab */}
            {activeTab === "borrows" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Active Borrows</h2>
                  <button
                    onClick={() => setShowBorrowForm(true)}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span>📖</span>
                    <span>Issue Book</span>
                  </button>
                </div>

                {borrows.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📖</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No active borrows</h3>
                    <p className="text-gray-600">No books are currently borrowed.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Book
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Borrower
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Borrow Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Due Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {borrows.map((borrow) => (
                          <tr key={borrow._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {borrow.book?.title || "Unknown Book"}
                              </div>
                              <div className="text-sm text-gray-500">by {borrow.book?.author || "Unknown Author"}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {borrow.borrower?.firstName || ""} {borrow.borrower?.lastName || ""}
                              </div>
                              <div className="text-sm text-gray-500">{borrow.borrower?.email || ""}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {borrow.borrowDate ? new Date(borrow.borrowDate).toLocaleDateString() : "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`text-sm ${
                                  borrow.dueDate && new Date(borrow.dueDate) < new Date()
                                    ? "text-red-600 font-semibold"
                                    : "text-gray-900"
                                }`}
                              >
                                {borrow.dueDate ? new Date(borrow.dueDate).toLocaleDateString() : "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleReturnBook(borrow._id)}
                                className="text-teal-600 hover:text-teal-900"
                              >
                                Return Book
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Overdue Tab */}
            {activeTab === "overdue" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Overdue Books</h2>

                {overdueBooks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No overdue books</h3>
                    <p className="text-gray-600">All books are returned on time!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-red-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Book
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Borrower
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Due Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Days Overdue
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {overdueBooks.map((borrow) => {
                          const daysOverdue = borrow.dueDate
                            ? Math.ceil((new Date() - new Date(borrow.dueDate)) / (1000 * 60 * 60 * 24))
                            : 0
                          return (
                            <tr key={borrow._id} className="bg-red-50 hover:bg-red-100">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {borrow.book?.title || "Unknown Book"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  by {borrow.book?.author || "Unknown Author"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {borrow.borrower?.firstName || ""} {borrow.borrower?.lastName || ""}
                                </div>
                                <div className="text-sm text-gray-500">{borrow.borrower?.email || ""}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                                {borrow.dueDate ? new Date(borrow.dueDate).toLocaleDateString() : "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                                {daysOverdue} days
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {borrow.borrower?.phone || "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => handleReturnBook(borrow._id)}
                                  className="text-teal-600 hover:text-teal-900 mr-3"
                                >
                                  Return Book
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Branch Users</h2>

                {branchUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                    <p className="text-gray-600 mb-4">No students or community members are registered yet.</p>
                    <Link
                      to="/register"
                      className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200 inline-block"
                    >
                      Register First User
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {branchUsers.map((user) => (
                          <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              {user.studentId && (
                                <div className="text-xs text-blue-600">Student ID: {user.studentId}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phone || "N/A"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                              >
                                {user.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {showBookForm && (
          <BookForm
            book={editingBook}
            onClose={() => {
              setShowBookForm(false)
              setEditingBook(null)
            }}
            onSuccess={() => {
              setShowBookForm(false)
              setEditingBook(null)
              fetchData()
            }}
          />
        )}

        {showBorrowForm && (
          <BorrowForm
            onClose={() => setShowBorrowForm(false)}
            onSuccess={() => {
              setShowBorrowForm(false)
              fetchData()
            }}
          />
        )}
      </div>
    </div>
  )
}

export default LibrarianDashboard
