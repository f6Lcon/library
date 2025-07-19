import Book from "../models/book.model.js"
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/imageUtils.js"

export const getAllBooks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = "",
      category = "",
      author = "",
      availability = "",
      branch = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query

    // Build filter object
    const filter = {}

    // Text search across title, author, and description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { isbn: { $regex: search, $options: "i" } },
      ]
    }

    // Category filter
    if (category) {
      filter.category = { $regex: category, $options: "i" }
    }

    // Author filter
    if (author) {
      filter.author = { $regex: author, $options: "i" }
    }

    // Availability filter
    if (availability === "available") {
      filter.availableCopies = { $gt: 0 }
    } else if (availability === "unavailable") {
      filter.availableCopies = { $lte: 0 }
    }

    // Branch filter
    if (branch) {
      filter.branch = branch
    }

    // Sort options
    const sortOptions = {}
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1

    // Execute query with pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)
    const books = await Book.find(filter)
      .populate("branch", "name location")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number.parseInt(limit))

    // Get total count for pagination
    const totalBooks = await Book.countDocuments(filter)
    const totalPages = Math.ceil(totalBooks / Number.parseInt(limit))

    // Get unique categories for filters
    const categories = await Book.distinct("category")

    res.status(200).json({
      success: true,
      books: books,
      totalPages: totalPages,
      currentPage: Number.parseInt(page),
      total: totalBooks,
      categories: categories.sort(),
    })
  } catch (error) {
    console.error("Error fetching books:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching books",
      error: error.message,
    })
  }
}

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params

    const book = await Book.findById(id)
      .populate("branch", "name location contact")
      .populate({
        path: "reviews",
        populate: {
          path: "user",
          select: "name email",
        },
      })

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      })
    }

    // Calculate average rating
    const avgRating =
      book.reviews && book.reviews.length > 0
        ? book.reviews.reduce((sum, review) => sum + review.rating, 0) / book.reviews.length
        : 0

    res.status(200).json({
      success: true,
      book: {
        ...book.toObject(),
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: book.reviews ? book.reviews.length : 0,
      },
    })
  } catch (error) {
    console.error("Error fetching book:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching book",
      error: error.message,
    })
  }
}

export const addBook = async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      category,
      description,
      totalCopies,
      branch,
      publisher,
      publishedYear,
      language = "English",
    } = req.body

    // Validate required fields
    if (!title || !author || !isbn || !category || !totalCopies || !branch) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        required: ["title", "author", "isbn", "category", "totalCopies", "branch"],
      })
    }

    // Check if book with same ISBN already exists
    const existingBook = await Book.findOne({ isbn })
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: "Book with this ISBN already exists",
      })
    }

    // Handle cover image upload
    let coverImageUrl = null
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer, {
          folder: "library/books",
          public_id: `book_${isbn}_${Date.now()}`,
        })
        coverImageUrl = uploadResult.secure_url
      } catch (uploadError) {
        console.error("Image upload error:", uploadError)
        return res.status(400).json({
          success: false,
          message: "Error uploading cover image",
          error: uploadError.message,
        })
      }
    }

    // Create new book
    const newBook = new Book({
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      category: category.trim(),
      description: description?.trim(),
      totalCopies: Number.parseInt(totalCopies),
      availableCopies: Number.parseInt(totalCopies),
      branch,
      publisher: publisher?.trim(),
      publishedYear: publishedYear ? Number.parseInt(publishedYear) : undefined,
      language: language.trim(),
      coverImage: coverImageUrl,
      addedBy: req.user._id,
    })

    const savedBook = await newBook.save()
    await savedBook.populate("branch", "name location")

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: savedBook,
    })
  } catch (error) {
    console.error("Error adding book:", error)
    res.status(500).json({
      success: false,
      message: "Error adding book",
      error: error.message,
    })
  }
}

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = { ...req.body }

    // Find existing book
    const existingBook = await Book.findById(id)
    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      })
    }

    // Check if ISBN is being changed and if it conflicts
    if (updateData.isbn && updateData.isbn !== existingBook.isbn) {
      const isbnConflict = await Book.findOne({
        isbn: updateData.isbn,
        _id: { $ne: id },
      })
      if (isbnConflict) {
        return res.status(400).json({
          success: false,
          message: "Book with this ISBN already exists",
        })
      }
    }

    // Handle cover image upload
    if (req.file) {
      try {
        // Delete old image if exists
        if (existingBook.coverImage) {
          await deleteFromCloudinary(existingBook.coverImage)
        }

        // Upload new image
        const uploadResult = await uploadToCloudinary(req.file.buffer, {
          folder: "library/books",
          public_id: `book_${updateData.isbn || existingBook.isbn}_${Date.now()}`,
        })
        updateData.coverImage = uploadResult.secure_url
      } catch (uploadError) {
        console.error("Image upload error:", uploadError)
        return res.status(400).json({
          success: false,
          message: "Error uploading cover image",
          error: uploadError.message,
        })
      }
    }

    // Update available copies if total copies changed
    if (updateData.totalCopies) {
      const borrowedCopies = existingBook.totalCopies - existingBook.availableCopies
      updateData.availableCopies = Math.max(0, Number.parseInt(updateData.totalCopies) - borrowedCopies)
    }

    // Clean string fields
    const stringFields = ["title", "author", "isbn", "category", "description", "publisher", "language"]
    stringFields.forEach((field) => {
      if (updateData[field]) {
        updateData[field] = updateData[field].trim()
      }
    })

    // Convert numeric fields
    if (updateData.totalCopies) updateData.totalCopies = Number.parseInt(updateData.totalCopies)
    if (updateData.publishedYear) updateData.publishedYear = Number.parseInt(updateData.publishedYear)

    updateData.updatedAt = new Date()

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate(
      "branch",
      "name location",
    )

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    })
  } catch (error) {
    console.error("Error updating book:", error)
    res.status(500).json({
      success: false,
      message: "Error updating book",
      error: error.message,
    })
  }
}

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params

    const book = await Book.findById(id)
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      })
    }

    // Check if book has active borrows
    const borrowedCopies = book.totalCopies - book.availableCopies
    if (borrowedCopies > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete book. ${borrowedCopies} copies are currently borrowed.`,
      })
    }

    // Delete cover image from Cloudinary
    if (book.coverImage) {
      try {
        await deleteFromCloudinary(book.coverImage)
      } catch (imageError) {
        console.error("Error deleting image:", imageError)
        // Continue with book deletion even if image deletion fails
      }
    }

    await Book.findByIdAndDelete(id)

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting book:", error)
    res.status(500).json({
      success: false,
      message: "Error deleting book",
      error: error.message,
    })
  }
}

export const getCategories = async (req, res) => {
  try {
    const categories = await Book.distinct("category")
    res.status(200).json({
      success: true,
      categories: categories.sort(),
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    })
  }
}

export const getBookStats = async (req, res) => {
  try {
    const { branch } = req.query
    const userRole = req.user?.role
    const userBranch = req.user?.branch

    // Build filter based on user role and permissions
    const filter = {}
    if (userRole === "librarian" && userBranch) {
      filter.branch = userBranch._id
    } else if (branch && userRole === "admin") {
      filter.branch = branch
    }

    // Get basic counts
    const totalBooks = await Book.countDocuments(filter)
    const availableBooks = await Book.countDocuments({
      ...filter,
      availableCopies: { $gt: 0 },
    })
    const borrowedBooks = await Book.countDocuments({
      ...filter,
      availableCopies: { $lt: "$totalCopies" },
    })

    // Get category distribution
    const categoryStats = await Book.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalCopies: { $sum: "$totalCopies" },
          availableCopies: { $sum: "$availableCopies" },
        },
      },
      { $sort: { count: -1 } },
    ])

    // Get recent additions (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentAdditions = await Book.countDocuments({
      ...filter,
      createdAt: { $gte: thirtyDaysAgo },
    })

    // Get most popular books (by borrow frequency)
    const popularBooks = await Book.find(filter)
      .select("title author totalCopies availableCopies")
      .sort({ availableCopies: 1 })
      .limit(5)

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalBooks,
          availableBooks,
          borrowedBooks,
          recentAdditions,
        },
        categoryDistribution: categoryStats,
        popularBooks,
        filter: {
          branch: branch || (userBranch ? userBranch.name : "All branches"),
          userRole,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching book statistics:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching book statistics",
      error: error.message,
    })
  }
}
