import Review from "../models/review.model.js"
import Book from "../models/book.model.js"
import Borrow from "../models/borrow.model.js"
import mongoose from "mongoose" // Declare mongoose variable

export const createReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body
    const reviewerId = req.user._id

    // Validate required fields
    if (!bookId || !rating) {
      return res.status(400).json({ message: "Book ID and rating are required" })
    }

    // Check if book exists
    const book = await Book.findById(bookId)
    if (!book) {
      return res.status(404).json({ message: "Book not found" })
    }

    // Check if user has successfully returned this book
    const completedBorrow = await Borrow.findOne({
      book: bookId,
      borrower: reviewerId,
      status: "returned",
    })

    if (!completedBorrow) {
      return res.status(403).json({
        message: "You can only review books you have borrowed and returned",
      })
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      book: bookId,
      reviewer: reviewerId,
    })

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this book" })
    }

    // Create review
    const review = new Review({
      book: bookId,
      reviewer: reviewerId,
      borrow: completedBorrow._id,
      rating: Math.max(1, Math.min(5, Number.parseInt(rating))), // Ensure rating is between 1-5
      comment: comment?.trim() || "",
      branch: req.user.branch,
    })

    await review.save()

    // Populate the review for response
    await review.populate([
      { path: "reviewer", select: "firstName lastName" },
      { path: "book", select: "title" },
    ])

    res.status(201).json({
      message: "Review submitted successfully! It will be visible after librarian approval.",
      review,
    })
  } catch (error) {
    console.error("Error creating review:", error)
    res.status(500).json({ message: "Failed to create review", error: error.message })
  }
}

export const getBookReviews = async (req, res) => {
  try {
    const { bookId } = req.params
    const { page = 1, limit = 10 } = req.query

    const reviews = await Review.find({
      book: bookId,
      isApproved: true, // Only show approved reviews
    })
      .populate("reviewer", "firstName lastName")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await Review.countDocuments({
      book: bookId,
      isApproved: true,
    })

    // Calculate average rating
    const ratingStats = await Review.aggregate([
      { $match: { book: new mongoose.Types.ObjectId(bookId), isApproved: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: "$rating",
          },
        },
      },
    ])

    const stats = ratingStats[0] || { averageRating: 0, totalReviews: 0 }

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      averageRating: Math.round(stats.averageRating * 10) / 10, // Round to 1 decimal
      totalReviews: stats.totalReviews,
    })
  } catch (error) {
    console.error("Error fetching book reviews:", error)
    res.status(500).json({ message: "Failed to fetch reviews", error: error.message })
  }
}

export const getPendingReviews = async (req, res) => {
  try {
    // Only librarians and admins can see pending reviews
    if (req.user.role !== "librarian" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" })
    }

    const query = { isApproved: false }

    // If librarian, only show reviews from their branch
    if (req.user.role === "librarian") {
      query.branch = req.user.branch
    }

    const reviews = await Review.find(query)
      .populate("reviewer", "firstName lastName")
      .populate("book", "title author")
      .populate("branch", "name")
      .sort({ createdAt: -1 })

    res.json({ reviews })
  } catch (error) {
    console.error("Error fetching pending reviews:", error)
    res.status(500).json({ message: "Failed to fetch pending reviews", error: error.message })
  }
}

export const approveReview = async (req, res) => {
  try {
    const { reviewId } = req.params
    const { approved } = req.body

    // Only librarians and admins can approve reviews
    if (req.user.role !== "librarian" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" })
    }

    const review = await Review.findById(reviewId)
    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    // If librarian, ensure review is from their branch
    if (req.user.role === "librarian" && !review.branch.equals(req.user.branch)) {
      return res.status(403).json({ message: "You can only approve reviews from your branch" })
    }

    if (approved) {
      review.isApproved = true
      review.approvedBy = req.user._id
      await review.save()
      res.json({ message: "Review approved successfully", review })
    } else {
      // Delete the review if not approved
      await Review.findByIdAndDelete(reviewId)
      res.json({ message: "Review rejected and deleted" })
    }
  } catch (error) {
    console.error("Error approving review:", error)
    res.status(500).json({ message: "Failed to approve review", error: error.message })
  }
}

export const getUserEligibleBooks = async (req, res) => {
  try {
    const userId = req.user._id

    // Find books that user has returned but hasn't reviewed yet
    const eligibleBorrows = await Borrow.find({
      borrower: userId,
      status: "returned",
    }).populate("book", "title author imageUrl")

    // Get books that user has already reviewed
    const reviewedBooks = await Review.find({
      reviewer: userId,
    }).select("book")

    const reviewedBookIds = reviewedBooks.map((r) => r.book.toString())

    // Filter out already reviewed books
    const eligibleBooks = eligibleBorrows
      .filter((borrow) => !reviewedBookIds.includes(borrow.book._id.toString()))
      .map((borrow) => ({
        borrowId: borrow._id,
        book: borrow.book,
        returnDate: borrow.returnDate,
      }))

    res.json({ eligibleBooks })
  } catch (error) {
    console.error("Error fetching eligible books:", error)
    res.status(500).json({ message: "Failed to fetch eligible books", error: error.message })
  }
}
