export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role, activeOnly = false } = req.query

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

    // Add active filter for homepage stats
    if (activeOnly === "true") {
      query.isActive = { $ne: false }
    }

    // For librarians, only show users from their branch (except when fetching for book issuing)
    if (req.user.role === "librarian" && !role) {
      query.branch = req.user.branch._id
    }

    const users = await User.find(query)
      .select("-password")
      .populate("branch", "name location")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    const total = await User.countDocuments(query)

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
