import { body } from "express-validator"

// Registration validation
export const validateRegistration = [
  body("firstName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("email").trim().isEmail().withMessage("Please provide a valid email address").normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),

  body("phone").trim().isMobilePhone().withMessage("Please provide a valid phone number"),

  body("address").trim().isLength({ min: 10, max: 200 }).withMessage("Address must be between 10 and 200 characters"),

  body("role")
    .isIn(["student", "community", "librarian", "admin"])
    .withMessage("Role must be one of: student, community, librarian, admin"),

  body("branch").isMongoId().withMessage("Please select a valid branch"),

  body("studentId")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Student ID must be between 3 and 20 characters")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Student ID can only contain letters and numbers"),
]

// Login validation
export const validateLogin = [
  body("email").trim().isEmail().withMessage("Please provide a valid email address").normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
]

// Book validation
export const validateBook = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title is required and must be less than 200 characters"),

  body("author")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Author is required and must be less than 100 characters"),

  body("isbn")
    .trim()
    .matches(
      /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/,
    )
    .withMessage("Please provide a valid ISBN"),

  body("category")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Category is required and must be less than 50 characters"),

  body("totalCopies").isInt({ min: 1 }).withMessage("Total copies must be a positive integer"),

  body("branch").isMongoId().withMessage("Please select a valid branch"),
]
