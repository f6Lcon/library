"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { branchService } from "../services/branchService"
import { motion } from "framer-motion"
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiMapPin,
  FiBookOpen,
  FiArrowRight,
  FiAlertCircle,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiUsers,
  FiHome,
  FiBook, // Changed from FiGraduationCap to FiBook
} from "react-icons/fi"
import { HiSparkles } from "react-icons/hi2"

const Register = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "community",
    studentId: "",
    phone: "",
    address: "",
    branch: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [branches, setBranches] = useState([])
  const [fieldErrors, setFieldErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [showPassword, setShowConfirmPassword] = useState(false)
  const [showConfirmPassword, setShowPassword] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user has permission to access this page
    if (!user || (user.role !== "admin" && user.role !== "librarian")) {
      navigate("/unauthorized")
      return
    }
    fetchBranches()
  }, [user, navigate])

  const fetchBranches = async () => {
    try {
      const response = await branchService.getAllBranches()
      setBranches(response.branches)
    } catch (err) {
      console.error("Error fetching branches:", err)
    }
  }

  // Real-time validation functions
  const validateField = (name, value) => {
    const errors = {}

    switch (name) {
      case "firstName":
        if (!value.trim()) {
          errors.firstName = "First name is required"
        } else if (value.trim().length < 2) {
          errors.firstName = "First name must be at least 2 characters"
        } else if (value.trim().length > 50) {
          errors.firstName = "First name must be less than 50 characters"
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          errors.firstName = "First name can only contain letters and spaces"
        }
        break

      case "lastName":
        if (!value.trim()) {
          errors.lastName = "Last name is required"
        } else if (value.trim().length < 2) {
          errors.lastName = "Last name must be at least 2 characters"
        } else if (value.trim().length > 50) {
          errors.lastName = "Last name must be less than 50 characters"
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          errors.lastName = "Last name can only contain letters and spaces"
        }
        break

      case "email":
        if (!value.trim()) {
          errors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          errors.email = "Please provide a valid email address"
        }
        break

      case "password":
        if (!value) {
          errors.password = "Password is required"
        } else if (value.length < 6) {
          errors.password = "Password must be at least 6 characters long"
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          errors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        }
        break

      case "confirmPassword":
        if (!value) {
          errors.confirmPassword = "Please confirm your password"
        } else if (value !== formData.password) {
          errors.confirmPassword = "Passwords do not match"
        }
        break

      case "phone":
        if (!value.trim()) {
          errors.phone = "Phone number is required"
        } else if (!/^[+]?[1-9][\d]{3,14}$/.test(value.trim().replace(/[\s\-()]/g, ""))) {
          errors.phone = "Please provide a valid phone number"
        }
        break

      case "address":
        if (!value.trim()) {
          errors.address = "Address is required"
        } else if (value.trim().length < 10) {
          errors.address = "Address must be at least 10 characters"
        } else if (value.trim().length > 200) {
          errors.address = "Address must be less than 200 characters"
        }
        break

      case "branch":
        if (!value) {
          errors.branch = "Please select a branch"
        }
        break

      case "studentId":
        if (formData.role === "student") {
          if (!value.trim()) {
            errors.studentId = "Student ID is required for student accounts"
          } else if (value.trim().length < 3) {
            errors.studentId = "Student ID must be at least 3 characters"
          } else if (value.trim().length > 20) {
            errors.studentId = "Student ID must be less than 20 characters"
          } else if (!/^[a-zA-Z0-9]+$/.test(value.trim())) {
            errors.studentId = "Student ID can only contain letters and numbers"
          }
        }
        break

      default:
        break
    }

    return errors
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear studentId when role changes from student to something else
    if (name === "role" && value !== "student" && formData.studentId) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        studentId: "",
      }))
      setFieldErrors((prev) => ({
        ...prev,
        studentId: null,
      }))
    }

    // Mark field as touched
    setTouched({
      ...touched,
      [name]: true,
    })

    // Validate field in real-time
    const fieldError = validateField(name, value)
    setFieldErrors({
      ...fieldErrors,
      ...fieldError,
      [name]: fieldError[name] || null,
    })

    // Also validate confirmPassword when password changes
    if (name === "password" && touched.confirmPassword) {
      const confirmError = validateField("confirmPassword", formData.confirmPassword)
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: confirmError.confirmPassword || null,
      }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target

    setTouched({
      ...touched,
      [name]: true,
    })

    const fieldError = validateField(name, value)
    setFieldErrors({
      ...fieldErrors,
      ...fieldError,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Mark all fields as touched
    const allFields = Object.keys(formData)
    const touchedFields = {}
    allFields.forEach((field) => {
      touchedFields[field] = true
    })
    setTouched(touchedFields)

    // Validate all fields
    let allErrors = {}
    Object.keys(formData).forEach((field) => {
      // Skip studentId validation if role is not student
      if (field === "studentId" && formData.role !== "student") {
        return
      }
      const fieldError = validateField(field, formData[field])
      allErrors = { ...allErrors, ...fieldError }
    })

    setFieldErrors(allErrors)

    // Check if there are any errors
    const hasErrors = Object.values(allErrors).some((error) => error !== null && error !== undefined)

    if (hasErrors) {
      setError("Please fix the errors below before submitting")
      setLoading(false)
      return
    }

    try {
      const { confirmPassword, ...userData } = formData
      await register(userData)
      navigate("/dashboard")
    } catch (err) {
      console.error("Registration error:", err)
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get input class based on validation state
  const getInputClass = (fieldName) => {
    const baseClass =
      "w-full px-4 py-3 pl-12 border rounded-xl focus:outline-none transition-all duration-200 bg-white/50"

    if (touched[fieldName] && fieldErrors[fieldName]) {
      return `${baseClass} border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50/50`
    } else if (touched[fieldName] && !fieldErrors[fieldName] && formData[fieldName]) {
      return `${baseClass} border-green-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50/50`
    } else {
      return `${baseClass} border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500`
    }
  }

  // Helper function to render field error
  const renderFieldError = (fieldName) => {
    if (touched[fieldName] && fieldErrors[fieldName]) {
      return (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-600 flex items-center"
        >
          <FiAlertCircle className="w-4 h-4 mr-1" />
          {fieldErrors[fieldName]}
        </motion.p>
      )
    }
    return null
  }

  // Helper function to render field success
  const renderFieldSuccess = (fieldName) => {
    if (touched[fieldName] && !fieldErrors[fieldName] && formData[fieldName]) {
      return (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-green-600 flex items-center"
        >
          <FiCheckCircle className="w-4 h-4 mr-1" />
          Looks good!
        </motion.p>
      )
    }
    return null
  }

  // Get available roles based on current user's role
  const getAvailableRoles = () => {
    if (user?.role === "admin") {
      return [
        { value: "community", label: "Community Member", icon: FiUsers },
        { value: "student", label: "Student", icon: FiBook }, // Changed icon
        { value: "librarian", label: "Librarian", icon: FiBookOpen },
      ]
    } else if (user?.role === "librarian") {
      return [
        { value: "community", label: "Community Member", icon: FiUsers },
        { value: "student", label: "Student", icon: FiBook }, // Changed icon
      ]
    }
    return []
  }

  // If user doesn't have permission, show unauthorized message
  if (!user || (user.role !== "admin" && user.role !== "librarian")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
          <p className="text-gray-600 mb-6">
            Access Denied - Only administrators and librarians can register new users
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-500 font-semibold"
          >
            <FiHome className="w-5 h-5" />
            <span>Return to Home</span>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "1s" }}
      ></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full space-y-8 relative z-10"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center shadow-2xl mb-6 relative"
          >
            <FiBookOpen className="w-10 h-10 text-white" />
            <motion.div
              className="absolute -top-2 -right-2 w-6 h-6 bg-accent-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <HiSparkles className="w-4 h-4 text-white m-1" />
            </motion.div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 font-display"
          >
            Register New User
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 text-lg"
          >
            {user.role === "admin"
              ? "Create accounts for students, community members, or librarians"
              : "Create accounts for students and community members"}
          </motion.p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50"
        >
          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2"
              >
                <FiAlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center border-b border-gray-200 pb-3">
                  <FiUser className="w-6 h-6 mr-3 text-primary-500" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                    <div className="relative">
                      <input
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClass("firstName")}
                        placeholder="Enter first name"
                      />
                      <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                    {renderFieldError("firstName")}
                    {renderFieldSuccess("firstName")}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                    <div className="relative">
                      <input
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClass("lastName")}
                        placeholder="Enter last name"
                      />
                      <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                    {renderFieldError("lastName")}
                    {renderFieldSuccess("lastName")}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FiMail className="w-4 h-4 mr-2" />
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getInputClass("email")}
                      placeholder="Enter email address"
                    />
                    <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  {renderFieldError("email")}
                  {renderFieldSuccess("email")}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FiPhone className="w-4 h-4 mr-2" />
                    Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getInputClass("phone")}
                      placeholder="Enter phone number"
                    />
                    <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  {renderFieldError("phone")}
                  {renderFieldSuccess("phone")}
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center border-b border-gray-200 pb-3">
                  <FiLock className="w-6 h-6 mr-3 text-primary-500" />
                  Account Information
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FiUsers className="w-4 h-4 mr-2" />
                    Account Type *
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {getAvailableRoles().map((role) => (
                      <label
                        key={role.value}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          formData.role === role.value
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200 hover:border-primary-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          checked={formData.role === role.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <role.icon className="w-6 h-6 mr-3 text-primary-500" />
                        <span className="font-medium">{role.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FiMapPin className="w-4 h-4 mr-2" />
                    Branch *
                  </label>
                  <div className="relative">
                    <select
                      name="branch"
                      required
                      value={formData.branch}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getInputClass("branch")}
                    >
                      <option value="">Select Branch</option>
                      {branches.map((branch) => (
                        <option key={branch._id} value={branch._id}>
                          {branch.name} - {branch.code}
                        </option>
                      ))}
                    </select>
                    <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  {renderFieldError("branch")}
                  {renderFieldSuccess("branch")}
                  {formData.role === "librarian" && (
                    <p className="mt-1 text-xs text-blue-600 flex items-center">
                      <FiBookOpen className="w-3 h-3 mr-1" />
                      This librarian will be assigned to manage this branch
                    </p>
                  )}
                </div>

                {formData.role === "student" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <FiBook className="w-4 h-4 mr-2" /> {/* Changed from FiGraduationCap */}
                      Student ID *
                    </label>
                    <div className="relative">
                      <input
                        name="studentId"
                        type="text"
                        required={formData.role === "student"}
                        value={formData.studentId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClass("studentId")}
                        placeholder="Enter student ID (letters and numbers only)"
                      />
                      <FiBook className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />{" "}
                      {/* Changed icon */}
                    </div>
                    {renderFieldError("studentId")}
                    {renderFieldSuccess("studentId")}
                    <p className="mt-1 text-xs text-gray-500">
                      Student ID must be 3-20 characters, letters and numbers only
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <FiLock className="w-4 h-4 mr-2" />
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClass("password")}
                        placeholder="Create password"
                      />
                      <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                      </button>
                    </div>
                    {renderFieldError("password")}
                    {renderFieldSuccess("password")}
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at least 6 characters with uppercase, lowercase, and number
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <FiLock className="w-4 h-4 mr-2" />
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClass("confirmPassword")}
                        placeholder="Confirm password"
                      />
                      <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                      </button>
                    </div>
                    {renderFieldError("confirmPassword")}
                    {renderFieldSuccess("confirmPassword")}
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <FiHome className="w-4 h-4 mr-2" />
                Address *
              </label>
              <div className="relative">
                <textarea
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows="3"
                  className={getInputClass("address").replace("pl-12", "pl-4 pt-3")}
                  placeholder="Enter full address (minimum 10 characters)"
                />
              </div>
              {renderFieldError("address")}
              {renderFieldSuccess("address")}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center pt-6 space-y-4 sm:space-y-0">
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-semibold"
              >
                <FiArrowRight className="w-5 h-5 rotate-180" />
                <span>Back to Dashboard</span>
              </Link>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || Object.values(fieldErrors).some((error) => error)}
                className="group flex justify-center items-center py-3 px-8 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Creating account...
                  </>
                ) : (
                  <>
                    <HiSparkles className="w-5 h-5 mr-2" />
                    <span>Create Account</span>
                    <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Register
