import Branch from "../models/branch.model.js"
import Book from "../models/book.model.js"
import User from "../models/user.model.js"

// Create a new branch
export const createBranch = async (req, res) => {
  try {
    const { name, address, phone, email, manager, description, facilities, operatingHours } = req.body

    // Check if branch with same name already exists
    const existingBranch = await Branch.findOne({ name })
    if (existingBranch) {
      return res.status(400).json({
        success: false,
        message: "Branch with this name already exists",
      })
    }

    // Create new branch
    const branch = new Branch({
      name,
      address,
      phone,
      email,
      manager,
      description,
      facilities: facilities || [],
      operatingHours: operatingHours || {
        monday: { open: "09:00", close: "17:00", closed: false },
        tuesday: { open: "09:00", close: "17:00", closed: false },
        wednesday: { open: "09:00", close: "17:00", closed: false },
        thursday: { open: "09:00", close: "17:00", closed: false },
        friday: { open: "09:00", close: "17:00", closed: false },
        saturday: { open: "09:00", close: "15:00", closed: false },
        sunday: { open: "10:00", close: "14:00", closed: false },
      },
    })

    await branch.save()

    res.status(201).json({
      success: true,
      message: "Branch created successfully",
      data: branch,
    })
  } catch (error) {
    console.error("Create branch error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create branch",
      error: error.message,
    })
  }
}

// Get all branches
export const getAllBranches = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query

    // Build query
    const query = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { manager: { $regex: search, $options: "i" } },
      ]
    }

    if (status) {
      query.status = status
    }

    // Execute query with pagination
    const branches = await Branch.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const total = await Branch.countDocuments(query)

    res.status(200).json({
      success: true,
      data: {
        branches,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      },
    })
  } catch (error) {
    console.error("Get branches error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch branches",
      error: error.message,
    })
  }
}

// Get branch by ID
export const getBranchById = async (req, res) => {
  try {
    const { id } = req.params

    const branch = await Branch.findById(id)

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      })
    }

    // Get additional stats for this branch
    const bookCount = await Book.countDocuments({ branch: id })
    const userCount = await User.countDocuments({ branch: id })

    res.status(200).json({
      success: true,
      data: {
        ...branch.toObject(),
        stats: {
          totalBooks: bookCount,
          totalUsers: userCount,
        },
      },
    })
  } catch (error) {
    console.error("Get branch error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch branch",
      error: error.message,
    })
  }
}

// Update branch
export const updateBranch = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Check if branch exists
    const branch = await Branch.findById(id)
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      })
    }

    // Check if name is being changed and if it conflicts
    if (updateData.name && updateData.name !== branch.name) {
      const existingBranch = await Branch.findOne({ name: updateData.name })
      if (existingBranch) {
        return res.status(400).json({
          success: false,
          message: "Branch with this name already exists",
        })
      }
    }

    // Update branch
    const updatedBranch = await Branch.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      message: "Branch updated successfully",
      data: updatedBranch,
    })
  } catch (error) {
    console.error("Update branch error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update branch",
      error: error.message,
    })
  }
}

// Delete branch
export const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params

    // Check if branch exists
    const branch = await Branch.findById(id)
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      })
    }

    // Check if branch has associated books or users
    const bookCount = await Book.countDocuments({ branch: id })
    const userCount = await User.countDocuments({ branch: id })

    if (bookCount > 0 || userCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete branch. It has ${bookCount} books and ${userCount} users associated with it.`,
      })
    }

    // Delete branch
    await Branch.findByIdAndDelete(id)

    res.status(200).json({
      success: true,
      message: "Branch deleted successfully",
    })
  } catch (error) {
    console.error("Delete branch error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete branch",
      error: error.message,
    })
  }
}

// Get branch statistics
export const getBranchStats = async (req, res) => {
  try {
    const totalBranches = await Branch.countDocuments()
    const activeBranches = await Branch.countDocuments({ status: "active" })
    const inactiveBranches = await Branch.countDocuments({ status: "inactive" })

    // Get branches with book and user counts
    const branchStats = await Branch.aggregate([
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "branch",
          as: "books",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "branch",
          as: "users",
        },
      },
      {
        $project: {
          name: 1,
          address: 1,
          status: 1,
          bookCount: { $size: "$books" },
          userCount: { $size: "$users" },
          createdAt: 1,
        },
      },
      {
        $sort: { bookCount: -1 },
      },
    ])

    res.status(200).json({
      success: true,
      data: {
        overview: {
          total: totalBranches,
          active: activeBranches,
          inactive: inactiveBranches,
        },
        branches: branchStats,
      },
    })
  } catch (error) {
    console.error("Get branch stats error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch branch statistics",
      error: error.message,
    })
  }
}
