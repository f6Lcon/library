"use client"

import { useState, useEffect } from "react"
import { userService } from "../services/userService"
import { bookService } from "../services/bookService"
import { borrowService } from "../services/borrowService"
import BranchManagement from "../components/BranchManagement"
import LoadingSpinner from "../components/LoadingSpinner"
import { Link } from "react-router-dom"
import {
  MdDashboard,
  MdPeople,
  MdPersonAdd,
  MdSchool,
  MdLocalLibrary,
  MdGroup,
  MdBook,
  MdSchedule,
  MdCheckCircle,
  MdError,
  MdWarning,
  MdRefresh,
  MdClose,
  MdBusiness,
  MdAnalytics,
  MdTrendingUp,
  MdAssignment,
} from "react-icons/md"

const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalLibrarians: 0,
    totalCommunity: 0,
    totalBooks: 0,
    totalBorrows: 0,
    activeBorrows: 0,
    overdueBorrows: 0,
  })
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState([])
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchData()
  }, [])

  const addError = (message) => {
    const errorId = Date.now()
    setErrors((prev) => [...prev, { id: errorId, message }])
    setTimeout(() => {
      setErrors((prev) => prev.filter((error) => error.id !== errorId))
    }, 5000)
  }

  const dismissError = (errorId) => {
    setErrors((prev) => prev.filter((error) => error.id !== errorId))
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      setErrors([])

      const results = await Promise.allSettled([
        userService.getAllUsers(),
        bookService.getAllBooks({ page: 1, limit: 1000 }),
        borrowService.getAllBorrows ? borrowService.getAllBorrows() : Promise.resolve({ borrows: [] }),
      ])

      // Handle users
      if (results[0].status === "fulfilled") {
        const userData = results[0].value.users || []
        setUsers(userData)

        // Calculate user stats
        const userStats = userData.reduce(
          (acc, user) => {
            acc.totalUsers++
            if (user.role === "student") acc.totalStudents++
            else if (user.role === "librarian") acc.totalLibrarians++
            else if (user.role === "community") acc.totalCommunity++
            return acc
          },
          {
            totalUsers: 0,
            totalStudents: 0,
            totalLibrarians: 0,
            totalCommunity: 0,
          },
        )

        setStats((prev) => ({ ...prev, ...userStats }))
      } else {
        addError("Failed to load users")
        setUsers([])
      }

      // Handle books
      if (results[1].status === "fulfilled") {
        const bookData = results[1].value.books || []
        setStats((prev) => ({ ...prev, totalBooks: bookData.length }))
      } else {
        addError("Failed to load books statistics")
      }

      // Handle borrows
      if (results[2].status === "fulfilled") {
        const borrowData = results[2].value.borrows || []
        const borrowStats = {
          totalBorrows: borrowData.length,
          activeBorrows: borrowData.filter((b) => b.status === "borrowed").length,
          overdueBorrows: borrowData.filter((b) => b.status === "overdue").length,
        }
        setStats((prev) => ({ ...prev, ...borrowStats }))
      } else {
        addError("Failed to load borrow statistics")
      }
    } catch (err) {
      addError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userService.updateUserRole(userId, newRole)
      fetchData() // Refresh the data
    } catch (err) {
      addError("Failed to update user role")
    }
  }

  const handleToggleStatus = async (userId) => {
    try {
      await userService.toggleUserStatus(userId)
      fetchData() // Refresh the data
    } catch (err) {
      addError("Failed to toggle user status")
    }
  }

  const refreshData = () => {
    fetchData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" color="green" text="Loading admin dashboard..." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <MdDashboard className="text-green-600" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Manage users, books, and system settings</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={refreshData}
                className="bg-gray-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-gray-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
              >
                <MdRefresh className="w-4 h-4" />
                Refresh
              </button>
              <Link
                to="/register"
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <MdPersonAdd className="w-4 h-4" />
                Register New User
              </Link>
            </div>
          </div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="mb-6 space-y-2">
              {errors.map((error) => (
                <div
                  key={error.id}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <MdError className="w-5 h-5" />
                    <span>{error.message}</span>
                  </div>
                  <button onClick={() => dismissError(error.id)} className="text-red-500 hover:text-red-700">
                    <MdClose className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  { key: "overview", label: "Overview", icon: MdAnalytics, count: null },
                  { key: "users", label: "Users", icon: MdPeople, count: stats.totalUsers },
                  { key: "branches", label: "Branches", icon: MdBusiness, count: null },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-3 px-6 py-4 font-medium text-sm transition-all duration-200 ${
                      activeTab === tab.key
                        ? "border-b-2 border-green-500 text-green-600 bg-green-50"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {tab.count !== null && (
                      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">{tab.count}</span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Main Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Total Users</p>
                      <p className="text-3xl font-bold">{stats.totalUsers}</p>
                      <p className="text-green-200 text-xs mt-1">System-wide</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <MdPeople className="w-8 h-8" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm font-medium">Total Books</p>
                      <p className="text-3xl font-bold">{stats.totalBooks}</p>
                      <p className="text-emerald-200 text-xs mt-1">In collection</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <MdBook className="w-8 h-8" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-teal-100 text-sm font-medium">Active Borrows</p>
                      <p className="text-3xl font-bold">{stats.activeBorrows}</p>
                      <p className="text-teal-200 text-xs mt-1">Currently borrowed</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <MdSchedule className="w-8 h-8" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Overdue</p>
                      <p className="text-3xl font-bold">{stats.overdueBorrows}</p>
                      <p className="text-orange-200 text-xs mt-1">Need attention</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <MdWarning className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </div>

              {/* User Type Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Students</h3>
                    <div className="bg-green-100 p-2 rounded-xl">
                      <MdSchool className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalStudents}</div>
                  <div className="text-sm text-gray-500">Registered students</div>
                  <div className="mt-4 bg-green-50 rounded-lg p-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Percentage</span>
                      <span className="font-medium text-green-600">
                        {stats.totalUsers > 0 ? Math.round((stats.totalStudents / stats.totalUsers) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Librarians</h3>
                    <div className="bg-emerald-100 p-2 rounded-xl">
                      <MdLocalLibrary className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-emerald-600 mb-2">{stats.totalLibrarians}</div>
                  <div className="text-sm text-gray-500">Active librarians</div>
                  <div className="mt-4 bg-emerald-50 rounded-lg p-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Percentage</span>
                      <span className="font-medium text-emerald-600">
                        {stats.totalUsers > 0 ? Math.round((stats.totalLibrarians / stats.totalUsers) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Community</h3>
                    <div className="bg-teal-100 p-2 rounded-xl">
                      <MdGroup className="w-6 h-6 text-teal-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-teal-600 mb-2">{stats.totalCommunity}</div>
                  <div className="text-sm text-gray-500">Community members</div>
                  <div className="mt-4 bg-teal-50 rounded-lg p-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Percentage</span>
                      <span className="font-medium text-teal-600">
                        {stats.totalUsers > 0 ? Math.round((stats.totalCommunity / stats.totalUsers) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Health */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MdTrendingUp className="text-green-600" />
                  System Health
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Borrows</span>
                      <span className="font-semibold text-gray-900">{stats.totalBorrows}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active Borrows</span>
                      <span className="font-semibold text-green-600">{stats.activeBorrows}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Overdue Items</span>
                      <span className="font-semibold text-orange-600">{stats.overdueBorrows}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">System Status</span>
                      <span className="flex items-center gap-1 text-green-600 font-semibold">
                        <MdCheckCircle className="w-4 h-4" />
                        Operational
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Database</span>
                      <span className="flex items-center gap-1 text-green-600 font-semibold">
                        <MdCheckCircle className="w-4 h-4" />
                        Connected
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="text-gray-900 font-semibold">{new Date().toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Management Tab */}
          {activeTab === "users" && (
            <div>
              {/* Users Table */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MdPeople className="text-green-600" />
                    User Management
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">Manage user roles and permissions</p>
                </div>

                {users.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <MdPeople className="w-4 h-4" />
                              User
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <MdAssignment className="w-4 h-4" />
                              Role
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <MdBusiness className="w-4 h-4" />
                              Branch
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                                {user.studentId && (
                                  <div className="text-xs text-green-600 flex items-center gap-1">
                                    <MdSchool className="w-3 h-3" />
                                    Student ID: {user.studentId}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              >
                                <option value="community">Community</option>
                                <option value="student">Student</option>
                                <option value="librarian">Librarian</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.branch?.name || "No branch assigned"}</div>
                              <div className="text-xs text-gray-500">{user.branch?.code || ""}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                                  user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                              >
                                {user.isActive ? (
                                  <MdCheckCircle className="w-3 h-3" />
                                ) : (
                                  <MdError className="w-3 h-3" />
                                )}
                                {user.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleToggleStatus(user._id)}
                                className={`${
                                  user.isActive
                                    ? "text-red-600 hover:text-red-900"
                                    : "text-green-600 hover:text-green-900"
                                } transition-colors duration-200`}
                              >
                                {user.isActive ? "Deactivate" : "Activate"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-6">👥</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No users found</h3>
                    <p className="text-gray-500 mb-6">Start by registering your first user.</p>
                    <Link
                      to="/register"
                      className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 inline-flex items-center gap-2"
                    >
                      <MdPersonAdd className="w-4 h-4" />
                      Register First User
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Branch Management Tab */}
          {activeTab === "branches" && <BranchManagement />}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
