import express from "express"
import { uploadBookCover, uploadGeneralImage, uploadProfileImage } from "../middlewares/upload.middleware.js"
import { authenticate, authorize } from "../middlewares/auth.middleware.js"

const router = express.Router()

// Upload book cover
router.post(
  "/book-cover",
  authenticate,
  authorize("admin", "librarian"),
  uploadBookCover.single("image"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" })
      }

      res.json({
        message: "Book cover uploaded successfully",
        imageUrl: req.file.path,
        publicId: req.file.filename,
      })
    } catch (error) {
      res.status(500).json({ message: "Failed to upload image", error: error.message })
    }
  },
)

// Upload general image
router.post(
  "/general",
  authenticate,
  authorize("admin", "librarian"),
  uploadGeneralImage.single("image"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" })
      }

      res.json({
        message: "Image uploaded successfully",
        imageUrl: req.file.path,
        publicId: req.file.filename,
      })
    } catch (error) {
      res.status(500).json({ message: "Failed to upload image", error: error.message })
    }
  },
)

// Upload profile image
router.post("/profile", authenticate, authorize("admin"), uploadProfileImage.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" })
    }

    res.json({
      message: "Profile image uploaded successfully",
      imageUrl: req.file.path,
      publicId: req.file.filename,
    })
  } catch (error) {
    res.status(500).json({ message: "Failed to upload image", error: error.message })
  }
})

export default router
