import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    borrow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Borrow",
      required: true, // Link to the borrow record to ensure they actually read it
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 200, // Keep it short for young students
      trim: true,
    },
    isApproved: {
      type: Boolean,
      default: false, // Reviews need librarian approval for young students
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
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

// Ensure one review per user per book
reviewSchema.index({ book: 1, reviewer: 1 }, { unique: true })

export default mongoose.model("Review", reviewSchema)
