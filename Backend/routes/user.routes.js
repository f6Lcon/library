import express from "express"
import User from "../models/user.model.js"
import { authenticate, authorize } from "../middlewares/auth.middleware.js"

const router = express.Router()

// Get all users (admin only)
router.get("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query
    const query = {}

    if (role) query.role = role
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ]
    }

    const users = await User.find(query)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await User.countDocuments(query)

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message })
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

    res.json({ message: "User status updated successfully", user: { ...user.toObject(), password: undefined } })
  } catch (error) {
    res.status(500).json({ message: "Failed to update user status", error: error.message })
  }
})

export default router
