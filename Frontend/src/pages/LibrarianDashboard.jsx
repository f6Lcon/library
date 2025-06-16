"use client"

import { useState, useEffect } from "react"
import { bookService } from "../services/bookService"
import { borrowService } from "../services/borrowService"
import BookForm from "../components/BookForm"
import BorrowForm from "../components/BorrowForm"

const LibrarianDashboard = () => {
  const [books, setBooks] = useState([])
  const [borrows, setBorrows] = useState([])
  const [overdueBooks, setOverdueBooks] = useState([])
  const [activeTab, setActiveTab] = useState("books")
  const [showBookForm, setShowBookForm] = useState(false)
  const [showBorrowForm, setShowBorrowForm] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [booksRes, borrowsRes, overdueRes] = await Promise.all([
        bookService.getAllBooks(),
        borrowService.getAllBorrows({ status: "borrowed" }),
        borrowService.getOverdueBooks(),
      ])

      setBooks(booksRes.books)
      setBorrows(borrowsRes.borrows)
      setOverdueBooks(overdueRes.overdueBooks)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBook = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await bookService.deleteBook(bookId)
        fetchData()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const handleReturnBook = async (borrowId) => {
    try {
      await borrowService.returnBook(borrowId)
      fetchData()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Librarian Dashboard</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {["books", "borrows", "overdue"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab} {tab === "overdue" && overdueBooks.length > 0 && `(${overdueBooks.length})`}
              </button>
            ))}
          </nav>
        </div>

        {/* Books Tab */}
        {activeTab === "books" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Books Management</h2>
              <button
                onClick={() => setShowBookForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add New Book
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {books.map((book) => (
                  <li key={book._id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{book.title}</h3>
                        <p className="text-sm text-gray-600">by {book.author}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span className="mr-4">ISBN: {book.isbn}</span>
                          <span className="mr-4">Category: {book.category}</span>
                          <span>
                            Available: {book.availableCopies}/{book.totalCopies}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            setEditingBook(book)
                            setShowBookForm(true)
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          Edit
                        </button>
                        <button onClick={() => handleDeleteBook(book._id)} className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Borrows Tab */}
        {activeTab === "borrows" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Active Borrows</h2>
              <button
                onClick={() => setShowBorrowForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Issue Book
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrower</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrow Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {borrows.map((borrow) => (
                      <tr key={borrow._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{borrow.book.title}</div>
                          <div className="text-sm text-gray-500">by {borrow.book.author}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {borrow.borrower.firstName} {borrow.borrower.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{borrow.borrower.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(borrow.borrowDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-sm ${
                              new Date(borrow.dueDate) < new Date() ? "text-red-600 font-semibold" : "text-gray-900"
                            }`}
                          >
                            {new Date(borrow.dueDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleReturnBook(borrow._id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Return Book
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Overdue Tab */}
        {activeTab === "overdue" && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Overdue Books</h2>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-red-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrower</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Overdue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {overdueBooks.map((borrow) => {
                      const daysOverdue = Math.ceil((new Date() - new Date(borrow.dueDate)) / (1000 * 60 * 60 * 24))
                      return (
                        <tr key={borrow._id} className="bg-red-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{borrow.book.title}</div>
                            <div className="text-sm text-gray-500">by {borrow.book.author}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {borrow.borrower.firstName} {borrow.borrower.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{borrow.borrower.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                            {new Date(borrow.dueDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                            {daysOverdue} days
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{borrow.borrower.phone}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleReturnBook(borrow._id)}
                              className="text-green-600 hover:text-green-900 mr-3"
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
            </div>
          </div>
        )}

        {/* Book Form Modal */}
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

        {/* Borrow Form Modal */}
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
