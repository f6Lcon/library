"use client"

import { useState, useEffect } from "react"
import { bookService } from "../services/bookService"
import { borrowService } from "../services/borrowService"
import { useAuth } from "../context/AuthContext"

const StudentDashboard = () => {
  const { user } = useAuth()
  const [books, setBooks] = useState([])
  const [borrowHistory, setBorrowHistory] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [activeTab, setActiveTab] = useState("search")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (searchTerm || selectedCategory) {
      searchBooks()
    } else {
      fetchBooks()
    }
  }, [searchTerm, selectedCategory])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [categoriesRes, borrowHistoryRes] = await Promise.all([
        bookService.getCategories(),
        borrowService.getBorrowHistory(user.id),
      ])

      setCategories(categoriesRes.categories)
      setBorrowHistory(borrowHistoryRes.borrows)

      await fetchBooks()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchBooks = async () => {
    try {
      const response = await bookService.getAllBooks()
      setBooks(response.books)
    } catch (err) {
      setError(err.message)
    }
  }

  const searchBooks = async () => {
    try {
      const params = {}
      if (searchTerm) params.search = searchTerm
      if (selectedCategory) params.category = selectedCategory

      const response = await bookService.getAllBooks(params)
      setBooks(response.books)
    } catch (err) {
      setError(err.message)
    }
  }

  const truncateDescription = (description, maxLength = 100) => {
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength) + "..."
  }

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Dashboard</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {["search", "history"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab === "search" ? "Search Books" : "Borrow History"}
              </button>
            ))}
          </nav>
        </div>

        {/* Search Books Tab */}
        {activeTab === "search" && (
          <div>
            {/* Search Filters */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Books</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title, author, or ISBN..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {books.map((book) => (
                <div
                  key={book._id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                >
                  {/* Book Image */}
                  <div className="aspect-[2/3] overflow-hidden bg-gray-100 relative">
                    <img
                      src={book.imageUrl || "/placeholder.svg?height=300&width=200"}
                      alt={`${book.title} cover`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=300&width=200"
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium shadow-sm ${
                          book.availableCopies > 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        }`}
                      >
                        {book.availableCopies > 0 ? book.availableCopies : "Out"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3">
                    <h3
                      className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight"
                      title={book.title}
                    >
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2 truncate" title={book.author}>
                      by {book.author}
                    </p>
                    <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded mb-2 inline-block">
                      {book.category}
                    </span>

                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="flex justify-between">
                        <span>Year:</span>
                        <span>{book.publishedYear}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pages:</span>
                        <span>{book.pages}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {books.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No books found matching your criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* Borrow History Tab */}
        {activeTab === "history" && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Your Borrow History</h2>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrow Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Return Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fine</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {borrowHistory.map((borrow) => (
                      <tr key={borrow._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{borrow.book.title}</div>
                          <div className="text-sm text-gray-500">by {borrow.book.author}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(borrow.borrowDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(borrow.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {borrow.returnDate ? new Date(borrow.returnDate).toLocaleDateString() : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              borrow.status === "returned"
                                ? "bg-green-100 text-green-800"
                                : borrow.status === "overdue"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {borrow.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {borrow.fine > 0 ? `$${borrow.fine}` : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {borrowHistory.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">You haven't borrowed any books yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentDashboard
