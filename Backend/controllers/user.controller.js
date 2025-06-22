import User from "../models/user.model.js"

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role, activeOnly = false, branch } = req.query

    const skip = (page - 1) * limit

    // Build query
    const query = {}

    // Add search functionality
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
      ]
    }

    // Add role filtering
    if (role) {
      const roles = role.split(",").map((r) => r.trim())
      query.role = { $in: roles }
    }

    // Add active filter
    if (activeOnly === "true") {
      query.isActive = { $ne: false }
    }

    // Add branch filtering
    if (branch) {
      query.branch = branch
    }

    // For librarians, filter by their branch when not explicitly searching for book issuing
    if (req.user.role === "librarian" && !role) {
      query.branch = req.user.branch._id
    }

    console.log("User query:", query)
    console.log("User role:", req.user.role)

    const users = await User.find(query)
      .select("-password")
      .populate("branch", "name location code")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    const total = await User.countDocuments(query)

    console.log(`Found ${users.length} users out of ${total} total`)

    res.json({
      success: true,
      users,
      total,
      page: Number.parseInt(page),
      totalPages: Math.ceil(total / limit),
      hasMore: skip + users.length < total,
    })
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

export const getActiveUsersCount = async (req, res) => {
  try {
    const query = {
      isActive: { $ne: false },
      role: { $in: ["student", "community"] },
    }

    const count = await User.countDocuments(query)

    res.json({
      success: true,
      count,
    })
  } catch (error) {
    console.error("Get active users count error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch active users count",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params
    const { role } = req.body

    // Only admins can update user roles
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." })
    }

    const validRoles = ["student", "community", "librarian", "admin"]
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" })
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select("-password").populate("branch")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      success: true,
      message: "User role updated successfully",
      user,
    })
  } catch (error) {
    console.error("Update user role error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params

    // Only admins can toggle user status
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.isActive = !user.isActive
    await user.save()

    const updatedUser = await User.findById(userId).select("-password").populate("branch")

    res.json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
      user: updatedUser,
    })
  } catch (error) {
    console.error("Toggle user status error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to toggle user status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}
