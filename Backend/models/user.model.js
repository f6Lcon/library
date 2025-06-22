import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "librarian", "student", "community"],
        message: "Role must be admin, librarian, student, or community",
      },
      default: "community",
    },
    studentId: {
      type: String,
      sparse: true,
      trim: true,
      validate: {
        validator: function (v) {
          // Only validate if role is student
          if (this.role === "student") {
            return v && v.length >= 3 && v.length <= 20
          }
          return true
        },
        message: "Student ID must be between 3 and 20 characters for student accounts",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        validator: (v) => {
          // More flexible phone validation - accepts various formats
          const phoneRegex = /^[+]?[1-9][\d\s\-$$$$]{7,15}$/
          return phoneRegex.test(v.replace(/\s/g, ""))
        },
        message: "Please provide a valid phone number (e.g., +1234567890, (555) 123-4567, 555-123-4567)",
      },
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      minlength: [10, "Address must be at least 10 characters"],
      maxlength: [200, "Address cannot exceed 200 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    membershipDate: {
      type: Date,
      default: Date.now,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: [true, "Branch selection is required"],
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
userSchema.index({ email: 1 })
userSchema.index({ studentId: 1 }, { sparse: true })
userSchema.index({ role: 1 })
userSchema.index({ branch: 1 })

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  // Only hash password if it's modified
  if (!this.isModified("password")) return next()

  try {
    const saltRounds = Number.parseInt(process.env.BCRYPT_ROUNDS) || 12
    this.password = await bcrypt.hash(this.password, saltRounds)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    throw new Error("Password comparison failed")
  }
}

// Pre-save validation for student ID
userSchema.pre("save", function (next) {
  if (this.role === "student" && !this.studentId) {
    next(new Error("Student ID is required for student accounts"))
  } else {
    next()
  }
})

export default mongoose.model("User", userSchema)
