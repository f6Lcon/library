import express from "express"
import {
  borrowBook,
  returnBook,
  getBorrowHistory,
  getAllBorrows,
  getOverdueBooks,
} from "../controllers/borrow.controller.js"
import { authenticate, authorize } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/", authenticate, authorize("admin", "librarian"), borrowBook)
router.put("/return/:borrowId", authenticate, authorize("admin", "librarian"), returnBook)
router.get("/history/:userId", authenticate, getBorrowHistory)
router.get("/", authenticate, authorize("admin", "librarian"), getAllBorrows)
router.get("/overdue", authenticate, authorize("admin", "librarian"), getOverdueBooks)

export default router
