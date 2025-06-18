import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../models/user.model.js"
import Branch from "../models/branch.model.js"
import { validationResult } from "express-validator"

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "fallback-secret", {
    expiresIn: "30d",
  })
}

// Register User
export const register = async (req, res) => {
  try {
    console.log("Registration request received:", {
      ...req.body,
      password: "[HIDDEN]",
    })

    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array())
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((err) => `${err.path}: ${err.msg}`),
      })
    }

    const { firstName, lastName, email, password, phone, address, role, branch, studentId } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      })
    }

    // Verify branch exists
    const branchExists = await Branch.findById(branch)
    if (!branchExists) {
      return res.status(400).json({
        success: false,
        message: "Selected branch does not exist",
      })
    }

    // Check for duplicate student ID if provided
    if (studentId) {
      const existingStudent = await User.findOne({ studentId })
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: "Student ID already exists",
        })
      }
    }

    // Hash password
    const saltRounds = Number.parseInt(process.env.BCRYPT_ROUNDS) || 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user object
    const userData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone.trim(),
      address: address.trim(),
      role,
      branch,
      isActive: true,
    }

    // Add studentId only if provided and role is student
    if (role === "student" && studentId) {
      userData.studentId = studentId.trim()
    }

    console.log("Creating user with data:", {
      ...userData,
      password: "[HIDDEN]",
    })

    // Create user
    const user = new User(userData)
    await user.save()

    // Generate token
    const token = generateToken(user._id)

    // Return user data without password
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      branch: user.branch,
      studentId: user.studentId,
      isActive: user.isActive,
      createdAt: user.createdAt,
    }

    console.log("User created successfully:", userResponse)

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: userResponse,
    })
  } catch (error) {
    console.error("Registration error:", error)

    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      })
    }

    // Handle MongoDB validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      })
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

// Login User
export const login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((err) => `${err.path}: ${err.msg}`),
      })
    }

    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() }).populate("branch")
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated. Please contact administrator.",
      })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    // Generate token
    const token = generateToken(user._id)

    // Return user data without password
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      branch: user.branch,
      studentId: user.studentId,
      isActive: user.isActive,
      createdAt: user.createdAt,
    }

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: userResponse,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

// Get User Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password").populate("branch")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}
