import Book from "../models/book.model.js"

export const getAllBooks = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query
    const query = {}

    if (req.user && req.user.role !== "admin") {
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
    const book = await Book.findById(req.params.id).populate("addedBy", "firstName lastName")
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
      branch: req.user.branch,
      availableCopies: req.body.totalCopies,
    }

    const book = new Book(bookData)
    await book.save()

    await book.populate("addedBy", "firstName lastName")

    res.status(201).json({ message: "Book added successfully", book })
  } catch (error) {
    res.status(500).json({ message: "Failed to add book", error: error.message })
  }
}

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate(
      "addedBy",
      "firstName lastName",
    )

    if (!book) {
      return res.status(404).json({ message: "Book not found" })
    }

    res.json({ message: "Book updated successfully", book })
  } catch (error) {
    res.status(500).json({ message: "Failed to update book", error: error.message })
  }
}

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id)
    if (!book) {
      return res.status(404).json({ message: "Book not found" })
    }
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
