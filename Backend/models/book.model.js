import mongoose from "mongoose"

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Fiction",
        "Non-Fiction",
        "Science",
        "Technology",
        "History",
        "Biography",
        "Romance",
        "Mystery",
        "Fantasy",
        "Educational",
      ],
    },
    description: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    publishedYear: {
      type: Number,
      required: true,
    },
    totalCopies: {
      type: Number,
      required: true,
      min: 1,
    },
    availableCopies: {
      type: Number,
      required: true,
      min: 0,
    },
    language: {
      type: String,
      default: "English",
    },
    pages: {
      type: Number,
      required: true,
    },
    // Cloudinary image fields
    imageUrl: {
      type: String,
      default: null,
    },
    imagePublicId: {
      type: String,
      default: null,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("Book", bookSchema)
