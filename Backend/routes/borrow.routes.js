import express from "express"
import {
  borrowBook,
  returnBook,
  getBorrowHistory,
  getAllBorrows,
  getOverdueBooks,
  getBorrowStats,
} from "../controllers/borrow.controller.js"
import { authenticate, authorize } from "../middlewares/auth.middleware.js"

const router = express.Router()

// Issue a book (librarians and admins only)
router.post("/", authenticate, authorize("admin", "librarian"), borrowBook)

// Return a book (librarians and admins only)
router.put("/return/:borrowId", authenticate, authorize("admin", "librarian"), returnBook)

// Get borrow history for a specific user (user themselves, librarians, and admins)
router.get("/history/:userId", authenticate, getBorrowHistory)

// Get all borrows (librarians and admins only) - but allow limited access for stats
router.get("/", authenticate, getAllBorrows)

// Get overdue books (librarians and admins only)
router.get("/overdue", authenticate, authorize("admin", "librarian"), getOverdueBooks)

// Get borrow statistics (accessible to all authenticated users for homepage)
router.get("/stats", authenticate, getBorrowStats)

export default router
