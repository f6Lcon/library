import Book from "../models/book.model.js"

export const getAllBooks = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query
    const query = {}

    // Filter by branch if user is a librarian (only see their branch books)
    if (req.user && req.user.role === "librarian" && req.user.branch) {
      query.branch = req.user.branch
    }

    if (category) query.category = category
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { isbn: { $regex: search, $options: "i" } },
      ]
    }

    const books = await Book.find(query)
      .populate("addedBy", "firstName lastName")
      .populate("branch", "name code")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await Book.countDocuments(query)

    res.json({
      books,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books", error: error.message })
  }
}

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("addedBy", "firstName lastName")
      .populate("branch", "name code")
    if (!book) {
      return res.status(404).json({ message: "Book not found" })
    }
    res.json({ book })
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch book", error: error.message })
  }
}

export const addBook = async (req, res) => {
  try {
    const bookData = {
      ...req.body,
      addedBy: req.user._id,
      branch: req.user.branch, // Use the librarian's branch
      availableCopies: req.body.totalCopies,
    }

    const book = new Book(bookData)
    await book.save()

    await book.populate("addedBy", "firstName lastName")
    await book.populate("branch", "name code")

    res.status(201).json({ message: "Book added successfully", book })
  } catch (error) {
    res.status(500).json({ message: "Failed to add book", error: error.message })
  }
}

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)

    if (!book) {
      return res.status(404).json({ message: "Book not found" })
    }

    // Check if librarian can only edit books from their branch
    if (req.user.role === "librarian" && book.branch.toString() !== req.user.branch.toString()) {
      return res.status(403).json({ message: "You can only edit books from your branch" })
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("addedBy", "firstName lastName")
      .populate("branch", "name code")

    res.json({ message: "Book updated successfully", book: updatedBook })
  } catch (error) {
    res.status(500).json({ message: "Failed to update book", error: error.message })
  }
}

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)

    if (!book) {
      return res.status(404).json({ message: "Book not found" })
    }

    // Check if librarian can only delete books from their branch
    if (req.user.role === "librarian" && book.branch.toString() !== req.user.branch.toString()) {
      return res.status(403).json({ message: "You can only delete books from your branch" })
    }

    await Book.findByIdAndDelete(req.params.id)
    res.json({ message: "Book deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Failed to delete book", error: error.message })
  }
}

export const getCategories = async (req, res) => {
  try {
    const categories = await Book.distinct("category")
    res.json({ categories })
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error: error.message })
  }
}
