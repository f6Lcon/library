import express from "express"
import {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
  getBranchStats,
} from "../controllers/branch.controller.js"
import { authenticate, authorize } from "../middlewares/auth.middleware.js"

const router = express.Router()

// Public routes
router.get("/", getAllBranches)
router.get("/:id", getBranchById)

// Protected routes - Admin only
router.post("/", authenticate, authorize("admin"), createBranch)
router.put("/:id", authenticate, authorize("admin"), updateBranch)
router.delete("/:id", authenticate, authorize("admin"), deleteBranch)
router.get("/stats/overview", authenticate, authorize("admin"), getBranchStats)

export default router
