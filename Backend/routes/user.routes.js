import express from "express"
import User from "../models/user.model.js"
import { authenticate, authorize } from "../middlewares/auth.middleware.js"

const router = express.Router()

// Get all users (with role-based filtering)
router.get("/", authenticate, async (req, res) => {
  try {
    const { role, search, page = 1, limit = 10, activeOnly } = req.query
    const query = {}

    // Only include active users if activeOnly is true
    if (activeOnly === "true") {
      query.isActive = true
    }

    // Role filtering
    if (role) {
      const roles = role.split(",").map((r) => r.trim())
      query.role = { $in: roles }
    }

    // Search functionality
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
      ]
    }

    // Branch filtering for librarians
    if (req.user.role === "librarian") {
      query.branch = req.user.branch
    }

    // Authorization check
    const requestingRoles = role ? role.split(",") : []
    const isBookIssueRequest = requestingRoles.some((r) => ["student", "community"].includes(r.trim()))

    if (isBookIssueRequest && !["librarian", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" })
    } else if (!isBookIssueRequest && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" })
    }

    const users = await User.find(query)
      .populate("branch", "name location")
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await User.countDocuments(query)

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: Number.parseInt(page),
      total,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ message: "Failed to fetch users", error: error.message })
  }
})

// Get active users count for statistics
router.get("/stats/active-count", authenticate, async (req, res) => {
  try {
    const count = await User.countDocuments({
      isActive: true,
      role: { $in: ["student", "community", "librarian"] },
    })
    res.json({ count })
  } catch (error) {
    console.error("Error getting active users count:", error)
    res.status(500).json({ message: "Failed to get active users count", error: error.message })
  }
})

// Update user role (admin only)
router.put("/:id/role", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { role } = req.body
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true, runValidators: true }).select(
      "-password",
    )

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ message: "User role updated successfully", user })
  } catch (error) {
    res.status(500).json({ message: "Failed to update user role", error: error.message })
  }
})

// Toggle user active status (admin only)
router.put("/:id/toggle-status", authenticate, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.isActive = !user.isActive
    await user.save()

    res.json({
      message: "User status updated successfully",
      user: { ...user.toObject(), password: undefined },
    })
  } catch (error) {
    res.status(500).json({ message: "Failed to update user status", error: error.message })
  }
})

export default router
