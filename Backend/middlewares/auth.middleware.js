import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret")
    console.log("Decoded token:", decoded) // Debug log

    const user = await User.findById(decoded.userId).select("-password").populate("branch")

    if (!user || !user.isActive) {
      console.log("User not found or inactive:", { userId: decoded.userId, user: !!user, isActive: user?.isActive })
      return res.status(401).json({ message: "Invalid token or user not found." })
    }

    console.log("Authenticated user:", { id: user._id, role: user.role, branch: user.branch?.name }) // Debug log
    req.user = user
    next()
  } catch (error) {
    console.error("Authentication error:", error)
    res.status(401).json({ message: "Invalid token." })
  }
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    console.log("Authorization check:", { userRole: req.user?.role, requiredRoles: roles }) // Debug log

    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
        userRole: req.user.role,
        requiredRoles: roles,
      })
    }
    next()
  }
}

// New middleware for registration permissions
export const canRegisterUsers = (req, res, next) => {
  console.log("Registration permission check:", { userRole: req.user?.role }) // Debug log

  if (!req.user) {
    return res.status(401).json({ message: "Authentication required." })
  }

  // Admin can register anyone, librarian can register students and community members
  if (req.user.role === "admin") {
    return next()
  }

  if (req.user.role === "librarian") {
    const { role } = req.body
    if (role === "student" || role === "community") {
      return next()
    } else {
      return res.status(403).json({
        message: "Librarians can only register students and community members.",
        userRole: req.user.role,
        attemptedRole: role,
      })
    }
  }

  return res.status(403).json({
    message: "Only administrators and librarians can register new users.",
    userRole: req.user.role,
  })
}
