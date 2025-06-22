const express = require("express")
const router = express.Router()
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  updateUserRole,
} = require("../controllers/user.controller")
const { authenticate, authorize } = require("../middleware/auth")

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logout", authenticate, logoutUser)
router.get("/profile", authenticate, getUserProfile)
router.put("/profile", authenticate, updateUserProfile)

// Get all users (with role-based filtering)
router.get(
  "/",
  authenticate,
  (req, res, next) => {
    const { role } = req.query

    // If requesting specific roles for book issuing
    if (role && (role.includes("student") || role.includes("community"))) {
      // Allow librarians and admins to fetch students/community for book issuing
      if (req.user.role === "librarian" || req.user.role === "admin") {
        return next()
      }
    }

    // For general user management, require admin privileges
    authorize("admin")(req, res, next)
  },
  getAllUsers,
)

router.delete("/:id", authenticate, authorize("admin"), deleteUser)
router.put("/:id", authenticate, authorize("admin"), updateUserRole)

module.exports = router
