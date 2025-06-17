import Borrow from "../models/borrow.model.js"
import Book from "../models/book.model.js"
import User from "../models/user.model.js"

export const borrowBook = async (req, res) => {
  try {
    const { bookId, borrowerId } = req.body

    const book = await Book.findById(bookId).populate("branch")
    if (!book || book.availableCopies <= 0) {
      return res.status(400).json({ message: "Book not available for borrowing" })
    }

    const borrower = await User.findById(borrowerId)
    if (!borrower) {
      return res.status(400).json({ message: "Borrower not found" })
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

    const borrow = new Borrow({
      book: bookId,
      borrower: borrowerId,
      dueDate,
      issuedBy: req.user._id,
      branch: book.branch._id,
    })

    await borrow.save()

    // Update book availability
    book.availableCopies -= 1
    await book.save()

    await borrow.populate(["book", "borrower", "issuedBy", "branch"])

    res.status(201).json({ message: "Book borrowed successfully", borrow })
  } catch (error) {
    res.status(500).json({ message: "Failed to borrow book", error: error.message })
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

    await borrow.populate(["borrower", "issuedBy", "returnedBy", "branch"])

    res.json({ message: "Book returned successfully", borrow })
  } catch (error) {
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
      .populate("book", "title author isbn")
      .populate("borrower", "firstName lastName email")
      .populate("issuedBy", "firstName lastName")
      .populate("returnedBy", "firstName lastName")
      .populate("branch", "name code")
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
    res.status(500).json({ message: "Failed to fetch borrow history", error: error.message })
  }
}

export const getAllBorrows = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    const query = {}

    // Filter by branch if user is a librarian
    if (req.user.role === "librarian" && req.user.branch) {
      query.branch = req.user.branch
    }

    if (status) query.status = status

    const borrows = await Borrow.find(query)
      .populate("book", "title author isbn")
      .populate("borrower", "firstName lastName email studentId")
      .populate("issuedBy", "firstName lastName")
      .populate("returnedBy", "firstName lastName")
      .populate("branch", "name code")
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

    // Filter by branch if user is a librarian
    if (req.user.role === "librarian" && req.user.branch) {
      query.branch = req.user.branch
    }

    const overdueBooks = await Borrow.find(query)
      .populate("book", "title author isbn")
      .populate("borrower", "firstName lastName email phone")
      .populate("branch", "name code")
      .sort({ dueDate: 1 })

    res.json({ overdueBooks })
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch overdue books", error: error.message })
  }
}
