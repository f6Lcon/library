const { body, validationResult } = require("express-validator")

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

// Validation middleware for user registration
const validateRegistration = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).*$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["student", "librarian"])
    .withMessage("Invalid role. Role must be either student or librarian"),
  body("studentId")
    .optional()
    .custom((value, { req }) => {
      // Only validate studentId if role is student
      if (req.body.role === "student") {
        if (!value || value.trim().length === 0) {
          throw new Error("Student ID is required for student accounts")
        }
        if (value.trim().length < 3 || value.trim().length > 20) {
          throw new Error("Student ID must be between 3 and 20 characters")
        }
        if (!/^[a-zA-Z0-9]+$/.test(value.trim())) {
          throw new Error("Student ID can only contain letters and numbers")
        }
      }
      return true
    }),
  handleValidationErrors,
]

// Validation middleware for book creation
const validateBookCreation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title cannot exceed 255 characters"),
  body("author")
    .trim()
    .notEmpty()
    .withMessage("Author is required")
    .isLength({ max: 255 })
    .withMessage("Author cannot exceed 255 characters"),
  body("isbn")
    .trim()
    .notEmpty()
    .withMessage("ISBN is required")
    .isLength({ min: 10, max: 13 })
    .withMessage("ISBN must be between 10 and 13 characters")
    .matches(/^[0-9-]+$/)
    .withMessage("ISBN can only contain numbers and hyphens"),
  body("publicationDate").optional().isISO8601().toDate().withMessage("Invalid publication date format"),
  body("genre").optional().isLength({ max: 50 }).withMessage("Genre cannot exceed 50 characters"),
  body("quantity").isInt({ min: 0 }).withMessage("Quantity must be a non-negative integer"),
  handleValidationErrors,
]

// Validation middleware for book update
const validateBookUpdate = [
  body("title").optional().trim().isLength({ max: 255 }).withMessage("Title cannot exceed 255 characters"),
  body("author").optional().trim().isLength({ max: 255 }).withMessage("Author cannot exceed 255 characters"),
  body("isbn")
    .optional()
    .trim()
    .isLength({ min: 10, max: 13 })
    .withMessage("ISBN must be between 10 and 13 characters")
    .matches(/^[0-9-]+$/)
    .withMessage("ISBN can only contain numbers and hyphens"),
  body("publicationDate").optional().isISO8601().toDate().withMessage("Invalid publication date format"),
  body("genre").optional().isLength({ max: 50 }).withMessage("Genre cannot exceed 50 characters"),
  body("quantity").optional().isInt({ min: 0 }).withMessage("Quantity must be a non-negative integer"),
  handleValidationErrors,
]

// Validation middleware for loan creation
const validateLoanCreation = [
  body("bookId").notEmpty().withMessage("Book ID is required").isMongoId().withMessage("Invalid Book ID"),
  body("studentId").notEmpty().withMessage("Student ID is required").isMongoId().withMessage("Invalid Student ID"),
  body("loanDate").optional().isISO8601().toDate().withMessage("Invalid loan date format"),
  body("returnDate").optional().isISO8601().toDate().withMessage("Invalid return date format"),
  handleValidationErrors,
]

// Validation middleware for loan update
const validateLoanUpdate = [
  body("bookId").optional().isMongoId().withMessage("Invalid Book ID"),
  body("studentId").optional().isMongoId().withMessage("Invalid Student ID"),
  body("loanDate").optional().isISO8601().toDate().withMessage("Invalid loan date format"),
  body("returnDate").optional().isISO8601().toDate().withMessage("Invalid return date format"),
  body("status").optional().isIn(["loaned", "returned", "overdue"]).withMessage("Invalid loan status"),
  handleValidationErrors,
]

module.exports = {
  validateRegistration,
  validateBookCreation,
  validateBookUpdate,
  validateLoanCreation,
  validateLoanUpdate,
  handleValidationErrors,
}
