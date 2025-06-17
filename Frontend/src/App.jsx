"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { useAuth } from "./context/AuthContext"
import Homepage from "./pages/Homepage"
import BooksPage from "./pages/BooksPage"
import Login from "./pages/Login"
import Register from "./pages/Register"
import AdminDashboard from "./pages/AdminDashboard"
import LibrarianDashboard from "./pages/LibrarianDashboard"
import StudentDashboard from "./pages/StudentDashboard"
import CommunityDashboard from "./pages/CommunityDashboard"
import Navbar from "./components/Navbar"
import LoadingSpinner from "./components/LoadingSpinner"

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()

  if (loading) return <LoadingSpinner />

  if (!user) return <Navigate to="/login" />

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />
  }

  return children
}

const DashboardRouter = () => {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" />

  switch (user.role) {
    case "admin":
      return <AdminDashboard />
    case "librarian":
      return <LibrarianDashboard />
    case "student":
      return <StudentDashboard />
    case "community":
      return <CommunityDashboard />
    default:
      return <Navigate to="/login" />
  }
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/login" element={<Login />} />
            {/* Restrict register page to librarians and admins only */}
            <Route
              path="/register"
              element={
                <ProtectedRoute allowedRoles={["admin", "librarian"]}>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/unauthorized"
              element={
                <div className="flex items-center justify-center h-screen">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
                    <p className="text-gray-600">Access Denied - Insufficient Permissions</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Only librarians and administrators can register new users.
                    </p>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
