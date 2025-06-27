"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Homepage from "./pages/Homepage"
import Login from "./pages/Login"
import Register from "./pages/Register"
import BooksPage from "./pages/BooksPage"
import BookDetails from "./pages/BookDetails"
import AdminDashboard from "./pages/AdminDashboard"
import LibrarianDashboard from "./pages/LibrarianDashboard"
import StudentDashboard from "./pages/StudentDashboard"
import CommunityDashboard from "./pages/CommunityDashboard"
import LoadingSpinner from "./components/LoadingSpinner"

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

// Dashboard Route Component
const DashboardRoute = () => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

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
      return <Navigate to="/" replace />
  }
}

// Unauthorized Component
const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-cream-300">
    <div className="text-center bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
      <div className="w-20 h-20 bg-gradient-to-br from-error-500 to-error-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <span className="text-white text-2xl font-bold">403</span>
      </div>
      <h1 className="text-4xl font-bold text-error-600 mb-4">Access Denied</h1>
      <p className="text-secondary-600 mb-6">You don't have permission to access this resource.</p>
      <button
        onClick={() => window.history.back()}
        className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-500 font-semibold"
      >
        <span>Go Back</span>
      </button>
    </div>
  </div>
)

function App() {
  return (
    <Router
      future={{
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <div className="App min-h-screen bg-cream-300">
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

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
                  <DashboardRoute />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
