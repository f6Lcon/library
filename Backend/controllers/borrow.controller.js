import Borrow from "../models/borrow.model.js"
import Book from "../models/book.model.js"
import User from "../models/user.model.js"

export const borrowBook = async (req, res) => {
  try {
    const { bookId, borrowerId } = req.body

    console.log("Borrow request:", { bookId, borrowerId, userId: req.user._id })

    // Validate required fields
    if (!bookId || !borrowerId) {
      return res.status(400).json({
        message: "Book ID and Borrower ID are required",
        received: { bookId, borrowerId },
      })
    }

    // Find the book
    const book = await Book.findById(bookId)
    if (!book) {
      return res.status(404).json({ message: "Book not found" })
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "Book not available for borrowing" })
    }

    // Find the borrower
    const borrower = await User.findById(borrowerId)
    if (!borrower) {
      return res.status(404).json({ message: "Borrower not found" })
    }

    // Check if user already has this book borrowed
    const existingBorrow = await Borrow.findOne({
      book: bookId,
      borrower: borrowerId,
      status: "borrowed",
    })

    if (existingBorrow) {
      return res.status(400).json({ message: "Book already borrowed by this user" })
    }

    // Create borrow record
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14) // 2 weeks borrowing period

    const borrowData = {
      book: bookId,
      borrower: borrowerId,
      dueDate,
      issuedBy: req.user._id,
      branch: borrower.branch || req.user.branch, // Use borrower's branch or issuer's branch
    }

    console.log("Creating borrow with data:", borrowData)

    const borrow = new Borrow(borrowData)
    await borrow.save()

    // Update book availability
    book.availableCopies -= 1
    await book.save()

    // Populate the borrow record for response
    await borrow.populate([
      { path: "book", select: "title author isbn" },
      { path: "borrower", select: "firstName lastName email studentId" },
      { path: "issuedBy", select: "firstName lastName" },
      { path: "branch", select: "name" },
    ])

    console.log("Book borrowed successfully:", borrow)

    res.status(201).json({
      message: "Book borrowed successfully",
      borrow,
      success: true,
    })
  } catch (error) {
    console.error("Error in borrowBook:", error)
    res.status(500).json({
      message: "Failed to borrow book",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
}

export const returnBook = async (req, res) => {
  try {
    const { borrowId } = req.params

    const borrow = await Borrow.findById(borrowId).populate("book")
    if (!borrow || borrow.status !== "borrowed") {
      return res.status(404).json({ message: "Borrow record not found or already returned" })
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

    res.json({ message: "Book returned successfully", borrow })
  } catch (error) {
    console.error("Error in returnBook:", error)
    res.status(500).json({ message: "Failed to return book", error: error.message })
  }
}

export const getBorrowHistory = async (req, res) => {
  try {
    const { userId } = req.params
    const { status, page = 1, limit = 10 } = req.query

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
      borrows,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error in getBorrowHistory:", error)
    res.status(500).json({ message: "Failed to fetch borrow history", error: error.message })
  }
}

export const getAllBorrows = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query

    // For non-admin/librarian users, restrict access
    if (req.user.role !== "admin" && req.user.role !== "librarian") {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." })
    }

    const query = {}
    if (status) query.status = status

    // If user is librarian, only show borrows from their branch
    if (req.user.role === "librarian") {
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
      borrows,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error in getAllBorrows:", error)
    res.status(500).json({ message: "Failed to fetch borrows", error: error.message })
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
    if (req.user.role === "librarian") {
      query.branch = req.user.branch
    }

    const overdueBooks = await Borrow.find(query)
      .populate("book", "title author isbn imageUrl")
      .populate("borrower", "firstName lastName email phone")
      .populate("branch", "name")
      .sort({ dueDate: 1 })

    res.json({ overdueBooks })
  } catch (error) {
    console.error("Error in getOverdueBooks:", error)
    res.status(500).json({ message: "Failed to fetch overdue books", error: error.message })
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
      message: "Failed to fetch borrow statistics",
      error: error.message,
    })
  }
}
