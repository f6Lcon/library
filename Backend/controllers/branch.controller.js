import Branch from "../models/branch.model.js"

export const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find({ isActive: true })
      .populate("manager", "firstName lastName email")
      .sort({ name: 1 })

    res.json({ branches })
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch branches", error: error.message })
  }
}

export const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id).populate("manager", "firstName lastName email")
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" })
    }
    res.json({ branch })
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch branch", error: error.message })
  }
}

export const createBranch = async (req, res) => {
  try {
    const branch = new Branch(req.body)
    await branch.save()
    await branch.populate("manager", "firstName lastName email")
    res.status(201).json({ message: "Branch created successfully", branch })
  } catch (error) {
    res.status(500).json({ message: "Failed to create branch", error: error.message })
  }
}

export const updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("manager", "firstName lastName email")

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" })
    }

    res.json({ message: "Branch updated successfully", branch })
  } catch (error) {
    res.status(500).json({ message: "Failed to update branch", error: error.message })
  }
}

export const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" })
    }
    res.json({ message: "Branch deactivated successfully" })
  } catch (error) {
    res.status(500).json({ message: "Failed to deactivate branch", error: error.message })
  }
}
