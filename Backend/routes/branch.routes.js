import express from "express"
import {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../controllers/branch.controller.js"
import { authenticate, authorize } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.get("/", getAllBranches)
router.get("/:id", authenticate, getBranchById)
router.post("/", authenticate, authorize("admin"), createBranch)
router.put("/:id", authenticate, authorize("admin"), updateBranch)
router.delete("/:id", authenticate, authorize("admin"), deleteBranch)

export default router
