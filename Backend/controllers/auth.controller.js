import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "fallback-secret", { expiresIn: "7d" })
}

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, studentId, phone, address } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" })
    }

    const userData = {
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      role: role || "community",
    }

    if (role === "student" && studentId) {
      userData.studentId = studentId
      if (req.body.branch) {
        userData.branch = req.body.branch
      }
    }

    const user = new User(userData)
    await user.save()

    const token = generateToken(user._id)

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        branch: user.branch,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = generateToken(user._id)

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        branch: user.branch,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message })
  }
}

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    res.json({ user })
  } catch (error) {
    res.status(500).json({ message: "Failed to get profile", error: error.message })
  }
}
