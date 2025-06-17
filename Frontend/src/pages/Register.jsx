"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { branchService } from "../services/branchService"

const Register = () => {
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

  const { register } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchBranches()
  }, [])

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
        } else if (!/^[+]?[1-9][\d]{3,14}$/.test(value.trim().replace(/[\s\-$$$$]/g, ""))) {
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
      console.log("Submitting registration data:", {
        ...formData,
        password: "[HIDDEN]",
        confirmPassword: "[HIDDEN]",
      })

      const { confirmPassword, ...userData } = formData
      await register(userData)

      // Navigate based on role
      switch (userData.role) {
        case "admin":
          navigate("/admin")
          break
        case "librarian":
          navigate("/librarian")
          break
        case "student":
          navigate("/student")
          break
        default:
          navigate("/community")
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get input class based on validation state
  const getInputClass = (fieldName) => {
    const baseClass = "w-full px-4 py-3 border rounded-xl focus:outline-none transition-all duration-200"

    if (touched[fieldName] && fieldErrors[fieldName]) {
      return `${baseClass} border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50`
    } else if (touched[fieldName] && !fieldErrors[fieldName]) {
      return `${baseClass} border-green-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50`
    } else {
      return `${baseClass} border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500`
    }
  }

  // Helper function to render field error
  const renderFieldError = (fieldName) => {
    if (touched[fieldName] && fieldErrors[fieldName]) {
      return (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠️</span>
          {fieldErrors[fieldName]}
        </p>
      )
    }
    return null
  }

  // Helper function to render field success
  const renderFieldSuccess = (fieldName) => {
    if (touched[fieldName] && !fieldErrors[fieldName] && formData[fieldName]) {
      return (
        <p className="mt-1 text-sm text-green-600 flex items-center">
          <span className="mr-1">✅</span>
          Looks good!
        </p>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <span className="text-white font-bold text-2xl">K</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Join KEY Library</h2>
          <p className="text-gray-600">Create your account and start your learning journey</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-primary-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">👤 Personal Information</h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
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
                  {renderFieldError("firstName")}
                  {renderFieldSuccess("firstName")}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
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
                  {renderFieldError("lastName")}
                  {renderFieldSuccess("lastName")}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📧 Email Address *</label>
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
                  {renderFieldError("email")}
                  {renderFieldSuccess("email")}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📞 Phone Number *</label>
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
                  {renderFieldError("phone")}
                  {renderFieldSuccess("phone")}
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">🔐 Account Information</h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">👥 Account Type *</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass("role")}
                  >
                    <option value="community">Community Member</option>
                    <option value="student">Student</option>
                  </select>
                  {renderFieldError("role")}
                  {renderFieldSuccess("role")}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">🏢 Branch *</label>
                  <select
                    name="branch"
                    required
                    value={formData.branch}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass("branch")}
                  >
                    <option value="">Select Your Branch</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name} - {branch.code}
                      </option>
                    ))}
                  </select>
                  {renderFieldError("branch")}
                  {renderFieldSuccess("branch")}
                </div>

                {formData.role === "student" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">🎓 Student ID *</label>
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
                    {renderFieldError("studentId")}
                    {renderFieldSuccess("studentId")}
                    <p className="mt-1 text-xs text-gray-500">
                      Student ID must be 3-20 characters, letters and numbers only
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">🔒 Password *</label>
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass("password")}
                    placeholder="Create password"
                  />
                  {renderFieldError("password")}
                  {renderFieldSuccess("password")}
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 6 characters with uppercase, lowercase, and number
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">🔒 Confirm Password *</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass("confirmPassword")}
                    placeholder="Confirm password"
                  />
                  {renderFieldError("confirmPassword")}
                  {renderFieldSuccess("confirmPassword")}
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">🏠 Address *</label>
              <textarea
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                rows="3"
                className={getInputClass("address")}
                placeholder="Enter your full address (minimum 10 characters)"
              />
              {renderFieldError("address")}
              {renderFieldSuccess("address")}
            </div>

            <button
              type="submit"
              disabled={loading || Object.values(fieldErrors).some((error) => error)}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </>
              ) : (
                <>✨ Create Account</>
              )}
            </button>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                  Sign in here
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
