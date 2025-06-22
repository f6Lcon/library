"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { borrowService } from "../services/borrowService"
import { userService } from "../services/userService"
import { useAuth } from "../context/AuthContext"
import LoadingSpinner from "./LoadingSpinner"
import { FiX, FiSearch, FiUser, FiBook, FiCalendar, FiAlertCircle, FiRefreshCw } from "react-icons/fi"
import { toast } from "react-toastify"

const IssueBookModal = ({ book, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth()
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [filteredStudents, setFilteredStudents] = useState([])
  const [issuing, setIssuing] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchStudents()
    }
  }, [isOpen])

  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter(
        (student) =>
          student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (student.studentId && student.studentId.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredStudents(filtered)
    } else {
      setFilteredStudents(students)
    }
  }, [searchTerm, students])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      setError("")

      // Build query parameters based on user role
      const params = {
        role: "student,community",
        activeOnly: true,
        limit: 200,
      }

      // If librarian, only get students from their branch
      if (user.role === "librarian" && user.branch) {
        params.branch = user.branch._id
      }

      console.log("Fetching students with params:", params)

      const response = await userService.getAllUsers(params)
      console.log("Fetched students response:", response)

      const fetchedStudents = response.users || []
      setStudents(fetchedStudents)
      setFilteredStudents(fetchedStudents)

      if (fetchedStudents.length === 0) {
        setError("No students found. Please check if there are active students in your branch.")
      }
    } catch (err) {
      console.error("Error fetching students:", err)
      const errorMessage = err.response?.data?.message || "Failed to fetch students"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleIssueBook = async (e) => {
    e.preventDefault()
    if (!selectedStudent) {
      setError("Please select a student")
      return
    }

    try {
      setIssuing(true)
      setError("")

      console.log("Issuing book:", {
        bookId: book._id,
        borrowerId: selectedStudent,
      })

      const result = await borrowService.borrowBook({
        bookId: book._id,
        borrowerId: selectedStudent,
      })

      console.log("Book issued successfully:", result)
      toast.success("Book issued successfully!")
      onSuccess()
      onClose()
    } catch (err) {
      console.error("Error issuing book:", err)
      const errorMessage = err.response?.data?.message || err.message || "Failed to issue book"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIssuing(false)
    }
  }

  const resetForm = () => {
    setSelectedStudent("")
    setSearchTerm("")
    setError("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FiBook className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Issue Book</h2>
                  <p className="text-teal-100">Select a student to issue this book</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Book Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-20 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {book.imageUrl ? (
                    <img
                      src={book.imageUrl || "/placeholder.svg"}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=80&width=64"
                      }}
                    />
                  ) : (
                    <FiBook className="w-6 h-6 text-teal-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{book.title}</h3>
                  <p className="text-gray-600 text-sm mb-1">by {book.author}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>ISBN: {book.isbn}</span>
                    <span>Available: {book.availableCopies}</span>
                    {book.branch && <span>Branch: {book.branch.name}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <FiAlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
                <button
                  onClick={fetchStudents}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Retry loading students"
                >
                  <FiRefreshCw className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            <form onSubmit={handleIssueBook} className="space-y-6">
              {/* Student Search */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Search Students</label>
                  <button
                    type="button"
                    onClick={fetchStudents}
                    className="text-teal-600 hover:text-teal-800 text-sm flex items-center space-x-1"
                  >
                    <FiRefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, email, or student ID..."
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  />
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {/* Students List */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Student ({filteredStudents.length} available)
                </label>
                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-xl">
                  {loading ? (
                    <div className="p-8 text-center">
                      <LoadingSpinner size="md" text="Loading students..." />
                    </div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="p-8 text-center">
                      <FiUser className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 mb-2">
                        {searchTerm ? "No students found matching your search" : "No students available"}
                      </p>
                      {user.role === "librarian" && (
                        <p className="text-gray-400 text-sm">
                          Only students from your branch ({user.branch?.name}) are shown
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <label
                          key={student._id}
                          className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                            selectedStudent === student._id ? "bg-teal-50 border-teal-200" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="student"
                            value={student._id}
                            checked={selectedStudent === student._id}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {student.firstName} {student.lastName}
                                </p>
                                <p className="text-sm text-gray-500">{student.email}</p>
                                {student.branch && (
                                  <p className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded mt-1 inline-block">
                                    {student.branch.name} ({student.branch.code})
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                {student.studentId && (
                                  <p className="text-xs text-teal-600 font-mono bg-teal-100 px-2 py-1 rounded">
                                    {student.studentId}
                                  </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">{student.phone || "No phone"}</p>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    student.role === "student"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-purple-100 text-purple-800"
                                  }`}
                                >
                                  {student.role}
                                </span>
                              </div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Issue Details */}
              {selectedStudent && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 rounded-xl p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <FiCalendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">Issue Details</span>
                  </div>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>Issue Date: {new Date().toLocaleDateString()}</p>
                    <p>Due Date: {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    <p>
                      Issued by: {user?.firstName} {user?.lastName} ({user?.role})
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedStudent || issuing}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {issuing ? (
                    <>
                      <LoadingSpinner size="sm" color="white" />
                      <span>Issuing...</span>
                    </>
                  ) : (
                    <>
                      <FiBook className="w-4 h-4" />
                      <span>Issue Book</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default IssueBookModal
