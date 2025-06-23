import Borrow from "../models/borrow.model.js"
import Book from "../models/book.model.js"
import User from "../models/user.model.js"
import mongoose from "mongoose"

export const borrowBook = async (req, res) => {
  try {
    console.log("=== BORROW BOOK REQUEST ===")
    console.log("Request body:", req.body)
    console.log("User:", req.user)
    console.log("Headers:", req.headers)

    const { bookId, borrowerId } = req.body

    // Validate required fields
    if (!bookId || !borrowerId) {
      console.log("Missing required fields:", { bookId, borrowerId })
      return res.status(400).json({
        success: false,
        message: "Book ID and Borrower ID are required",
        received: { bookId, borrowerId },
      })
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      console.log("Invalid book ID:", bookId)
      return res.status(400).json({
        success: false,
        message: "Invalid book ID format",
      })
    }

    if (!mongoose.Types.ObjectId.isValid(borrowerId)) {
      console.log("Invalid borrower ID:", borrowerId)
      return res.status(400).json({
        success: false,
        message: "Invalid borrower ID format",
      })
    }

    // Find the book
    const book = await Book.findById(bookId).populate("branch")
    if (!book) {
      console.log("Book not found:", bookId)
      return res.status(404).json({
        success: false,
        message: "Book not found",
      })
    }

    console.log("Found book:", book.title, "Available copies:", book.availableCopies)

    if (book.availableCopies <= 0) {
      console.log("Book not available")
      return res.status(400).json({
        success: false,
        message: "Book not available for borrowing",
      })
    }

    // Find the borrower
    const borrower = await User.findById(borrowerId).populate("branch")
    if (!borrower) {
      console.log("Borrower not found:", borrowerId)
      return res.status(404).json({
        success: false,
        message: "Borrower not found",
      })
    }

    console.log("Found borrower:", borrower.firstName, borrower.lastName)

    // Check if user already has this book borrowed
    const existingBorrow = await Borrow.findOne({
      book: bookId,
      borrower: borrowerId,
      status: "borrowed",
    })

    if (existingBorrow) {
      console.log("Book already borrowed by this user")
      return res.status(400).json({
        success: false,
        message: "Book already borrowed by this user",
      })
    }

    // Create borrow record
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14) // 2 weeks borrowing period

    const borrowData = {
      book: bookId,
      borrower: borrowerId,
      dueDate,
      issuedBy: req.user._id,
      branch: borrower.branch?._id || req.user.branch?._id,
    }

    console.log("Creating borrow with data:", borrowData)

    const borrow = new Borrow(borrowData)
    await borrow.save()

    // Update book availability
    book.availableCopies -= 1
    await book.save()

    console.log("Book availability updated. New count:", book.availableCopies)

    // Populate the borrow record for response
    await borrow.populate([
      { path: "book", select: "title author isbn imageUrl" },
      { path: "borrower", select: "firstName lastName email studentId" },
      { path: "issuedBy", select: "firstName lastName" },
      { path: "branch", select: "name code" },
    ])

    console.log("Book borrowed successfully")

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      borrow,
    })
  } catch (error) {
    console.error("=== BORROW ERROR ===")
    console.error("Error details:", error)
    console.error("Stack trace:", error.stack)

    // Ensure we always return JSON
    res.status(500).json({
      success: false,
      message: "Failed to borrow book",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
}

export const returnBook = async (req, res) => {
  try {
    const { borrowId } = req.params

    if (!mongoose.Types.ObjectId.isValid(borrowId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid borrow ID format",
      })
    }

    const borrow = await Borrow.findById(borrowId).populate("book")
    if (!borrow || borrow.status !== "borrowed") {
      return res.status(404).json({
        success: false,
        message: "Borrow record not found or already returned",
      })
    }

    // Calculate fine if overdue
    const today = new Date()
    let fine = 0
    if (today > borrow.dueDate) {
      const overdueDays = Math.ceil((today - borrow.dueDate) / (1000 * 60 * 60 * 24))
      fine = overdueDays * 1 // $1 per day fine
    }

    // Update borrow record
    borrow.returnDate = today
    borrow.status = "returned"
    borrow.fine = fine
    borrow.returnedBy = req.user._id
    await borrow.save()

    // Update book availability
    const book = await Book.findById(borrow.book._id)
    book.availableCopies += 1
    await book.save()

    await borrow.populate([
      { path: "borrower", select: "firstName lastName email" },
      { path: "issuedBy", select: "firstName lastName" },
      { path: "returnedBy", select: "firstName lastName" },
    ])

    res.json({
      success: true,
      message: "Book returned successfully",
      borrow,
    })
  } catch (error) {
    console.error("Error in returnBook:", error)
    res.status(500).json({
      success: false,
      message: "Failed to return book",
      error: error.message,
    })
  }
}

export const getBorrowHistory = async (req, res) => {
  try {
    const { userId } = req.params
    const { status, page = 1, limit = 10 } = req.query

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      })
    }

    const query = { borrower: userId }
    if (status) query.status = status

    const borrows = await Borrow.find(query)
      .populate("book", "title author isbn imageUrl")
      .populate("borrower", "firstName lastName email")
      .populate("issuedBy", "firstName lastName")
      .populate("returnedBy", "firstName lastName")
      .populate("branch", "name")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ borrowDate: -1 })

    const total = await Borrow.countDocuments(query)

    res.json({
      success: true,
      borrows,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error in getBorrowHistory:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch borrow history",
      error: error.message,
    })
  }
}

export const getAllBorrows = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query

    // For non-admin/librarian users, restrict access
    if (req.user.role !== "admin" && req.user.role !== "librarian") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      })
    }

    const query = {}
    if (status) query.status = status

    // If user is librarian, only show borrows from their branch
    if (req.user.role === "librarian" && req.user.branch) {
      query.branch = req.user.branch
    }

    const borrows = await Borrow.find(query)
      .populate("book", "title author isbn imageUrl")
      .populate("borrower", "firstName lastName email studentId")
      .populate("issuedBy", "firstName lastName")
      .populate("returnedBy", "firstName lastName")
      .populate("branch", "name")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ borrowDate: -1 })

    const total = await Borrow.countDocuments(query)

    res.json({
      success: true,
      borrows,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error in getAllBorrows:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch borrows",
      error: error.message,
    })
  }
}

export const getOverdueBooks = async (req, res) => {
  try {
    const today = new Date()
    const query = {
      status: "borrowed",
      dueDate: { $lt: today },
    }

    // If user is librarian, only show overdue books from their branch
    if (req.user.role === "librarian" && req.user.branch) {
      query.branch = req.user.branch
    }

    const overdueBooks = await Borrow.find(query)
      .populate("book", "title author isbn imageUrl")
      .populate("borrower", "firstName lastName email phone")
      .populate("branch", "name")
      .sort({ dueDate: 1 })

    res.json({
      success: true,
      overdueBooks,
    })
  } catch (error) {
    console.error("Error in getOverdueBooks:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch overdue books",
      error: error.message,
    })
  }
}

export const getBorrowStats = async (req, res) => {
  try {
    console.log("Getting borrow stats for user:", req.user.role)

    // Get total borrowed books count
    const totalBorrowedBooks = await Borrow.countDocuments({ status: "borrowed" })

    // Get overdue books count
    const today = new Date()
    const overdueBooks = await Borrow.countDocuments({
      status: "borrowed",
      dueDate: { $lt: today },
    })

    // Get total books count
    const totalBooks = await Book.countDocuments()

    // Get active users count (excluding admins)
    const activeUsers = await User.countDocuments({
      isActive: { $ne: false },
      role: { $in: ["student", "community"] },
    })

    const stats = {
      totalBooks,
      totalBorrowedBooks,
      overdueBooks,
      activeUsers,
      yearsOfService: 25, // Static institutional data
    }

    console.log("Borrow stats:", stats)

    res.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error("Error in getBorrowStats:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch borrow statistics",
      error: error.message,
    })
  }
}
