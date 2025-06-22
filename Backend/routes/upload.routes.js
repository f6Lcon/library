import express from "express"
import { uploadBookCover, uploadGeneralImage, uploadProfileImage } from "../middlewares/upload.middleware.js"
import { authenticate, authorize } from "../middlewares/auth.middleware.js"

const router = express.Router()

// Upload book cover image - Allow all authenticated users to upload book covers
router.post("/book-cover", authenticate, uploadBookCover.single("image"), async (req, res) => {
  try {
    console.log("Upload request from user:", {
      userId: req.user?._id,
      role: req.user?.role,
      email: req.user?.email,
    })

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" })
    }

    console.log("File uploaded successfully:", {
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
    })

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: req.file.path,
      publicId: req.file.filename,
    })
  } catch (error) {
    console.error("Book cover upload error:", error)
    res.status(500).json({ message: "Failed to upload image", error: error.message })
  }
})

// Upload general image - Allow all authenticated users
router.post("/image", authenticate, uploadGeneralImage.single("image"), async (req, res) => {
  try {
    console.log("General image upload from user:", {
      userId: req.user?._id,
      role: req.user?.role,
      email: req.user?.email,
    })

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" })
    }

    console.log("General image uploaded successfully:", {
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
    })

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: req.file.path,
      publicId: req.file.filename,
    })
  } catch (error) {
    console.error("General image upload error:", error)
    res.status(500).json({ message: "Failed to upload image", error: error.message })
  }
})

// Upload profile image - Restrict to admin and librarian only
router.post(
  "/profile",
  authenticate,
  authorize("admin", "librarian"),
  uploadProfileImage.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" })
      }

      res.status(200).json({
        message: "Profile image uploaded successfully",
        imageUrl: req.file.path,
        publicId: req.file.filename,
      })
    } catch (error) {
      console.error("Profile image upload error:", error)
      res.status(500).json({ message: "Failed to upload profile image", error: error.message })
    }
  },
)

export default router
