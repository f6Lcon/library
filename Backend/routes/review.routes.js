import express from "express"
import {
  createReview,
  getBookReviews,
  getPendingReviews,
  approveReview,
  getUserEligibleBooks,
} from "../controllers/review.controller.js"
import { authenticate, authorize } from "../middlewares/auth.middleware.js"

const router = express.Router()

// Create a review (authenticated users only)
router.post("/", authenticate, createReview)

// Get reviews for a specific book (public)
router.get("/book/:bookId", getBookReviews)

// Get pending reviews (librarians/admins only)
router.get("/pending", authenticate, authorize("librarian", "admin"), getPendingReviews)

// Approve/reject a review (librarians/admins only)
router.put("/approve/:reviewId", authenticate, authorize("librarian", "admin"), approveReview)

// Get books eligible for review by current user
router.get("/eligible", authenticate, getUserEligibleBooks)

export default router
