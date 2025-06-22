import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    console.log("🔍 Authentication attempt:", {
      hasToken: !!token,
      tokenStart: token ? token.substring(0, 20) + "..." : "None",
    })

    if (!token) {
      console.log("❌ No token provided")
      return res.status(401).json({ message: "Access denied. No token provided." })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret")
    console.log("✅ Token decoded:", {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    })

    const user = await User.findById(decoded.userId).select("-password").populate("branch")

    if (!user || !user.isActive) {
      console.log("❌ User not found or inactive:", {
        userId: decoded.userId,
        userExists: !!user,
        isActive: user?.isActive,
      })
      return res.status(401).json({ message: "Invalid token or user not found." })
    }

    console.log("✅ User authenticated:", {
      id: user._id,
      email: user.email,
      role: user.role,
      branch: user.branch?.name,
    })

    req.user = user
    next()
  } catch (error) {
    console.error("❌ Authentication error:", error.message)
    res.status(401).json({ message: "Invalid token." })
  }
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    console.log("🔐 Authorization check:", {
      userRole: req.user?.role,
      requiredRoles: roles,
      hasPermission: roles.includes(req.user?.role),
    })

    if (!req.user) {
      console.log("❌ No authenticated user")
      return res.status(401).json({ message: "Authentication required." })
    }

    if (!roles.includes(req.user.role)) {
      console.log("❌ Insufficient permissions:", {
        userRole: req.user.role,
        requiredRoles: roles,
      })
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
        userRole: req.user.role,
        requiredRoles: roles,
      })
    }

    console.log("✅ Authorization successful")
    next()
  }
}

// New middleware for registration permissions
export const canRegisterUsers = (req, res, next) => {
  console.log("👥 Registration permission check:", {
    userRole: req.user?.role,
    targetRole: req.body?.role,
  })

  if (!req.user) {
    return res.status(401).json({ message: "Authentication required." })
  }

  // Admin can register anyone, librarian can register students and community members
  if (req.user.role === "admin") {
    console.log("✅ Admin can register anyone")
    return next()
  }

  if (req.user.role === "librarian") {
    const { role } = req.body
    if (role === "student" || role === "community") {
      console.log("✅ Librarian can register students/community members")
      return next()
    } else {
      console.log("❌ Librarian cannot register:", role)
      return res.status(403).json({
        message: "Librarians can only register students and community members.",
        userRole: req.user.role,
        attemptedRole: role,
      })
    }
  }

  console.log("❌ User cannot register others:", req.user.role)
  return res.status(403).json({
    message: "Only administrators and librarians can register new users.",
    userRole: req.user.role,
  })
}
